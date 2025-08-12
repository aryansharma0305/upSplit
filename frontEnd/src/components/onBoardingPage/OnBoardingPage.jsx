import React, { useEffect, useState, useCallback, useRef } from 'react';
import { format, isValid } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AvatarEditor from 'react-avatar-editor';
import Logo from '../logo';
import { Typewriter } from 'react-simple-typewriter';
import RiveSplitAnim from '../riveSplitAnim';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '@/firebase.js';
import confetti from 'canvas-confetti';

const OnBoardingPage = () => {
  const Navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    upiId: '',
    dateOfBirth: null,
    phoneNumber: '',
    username: '',
    photo: '/default-avatar.png',
  });
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      const parsedDetails = JSON.parse(userDetails);
      const dateOfBirth = parsedDetails.dateOfBirth
        ? new Date(parsedDetails.dateOfBirth)
        : null;
      setFormData({
        name: parsedDetails.name || '',
        upiId: parsedDetails.upiId || '',
        dateOfBirth: dateOfBirth && isValid(dateOfBirth) ? dateOfBirth : null,
        phoneNumber: parsedDetails.phoneNumber || '',
        username: parsedDetails.username || '',
        photo: parsedDetails.picture || '/default-avatar.png',
      });
    } else {
      Navigate('/login');
    }
  }, [Navigate]);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const user = localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails')) : null;
        if (!user) {
          toast.error('User not authenticated. Please log in.');
          Navigate('/login');
          return;
        }
        const resp = await axios.post(
          '/api/auth/isProfileCompleted',
          { email: user.email },
          { withCredentials: true }
        );
        if (resp.data.profileCompleted) {
          Navigate('/dashboard');
        }
      } catch (e) {
        console.error('Error in OnBoardingPage useEffect:', e);
        toast.error('An error occurred while loading your profile data.');
        Navigate('/login');
      }
    };
    checkProfile();
  }, [Navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setShowCropper(true);
    }
  };

  const handleScaleChange = (e) => {
    setScale(parseFloat(e.target.value));
  };

  const handleCrop = useCallback(async () => {
    if (editorRef.current) {
      try {
        const croppedImageUrl = await getCroppedImg(editorRef.current);
        setCroppedImage(croppedImageUrl);
        setFormData((prev) => ({ ...prev, photo: croppedImageUrl }));
        setShowCropper(false);
        toast.success('Profile picture cropped successfully!');
      } catch (error) {
        toast.error('Error cropping image!');
        console.error('Crop error:', error);
      }
    }
  }, []);

  const validateStep = async () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.username || !formData.dateOfBirth || !isValid(formData.dateOfBirth)) {
        toast.error('Please fill in Name, Username, and a valid Date of Birth.');
        return false;
      }
      if (formData.username.length < 3 || formData.username.length > 20) {
        toast.error('Username must be between 3 and 20 characters.');
        return false;
      }
      if (formData.username.includes(' ')) {
        toast.error('Username cannot contain spaces.');
        return false;
      }
      try {
        const resp = await axios.post(
          '/api/auth/verifyIfUserNameIsUnique',
          { userName: formData.username },
          { withCredentials: true }
        );
        if (!resp.data.isUnique) {
          toast.error('Username is already taken. Please choose a different one.');
          return false;
        }
      } catch (error) {
        toast.error('Error checking username uniqueness!');
        console.error('Username uniqueness check error:', error.message);
        return false;
      }
    } else if (currentStep === 2) {
      const phoneRegex = /^\+?[1-9]\d{9,14}$/;
      if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
        toast.error('Please enter a valid phone number (e.g., +1234567890).');
        return false;
      }
    } else if (currentStep === 3) {
      const upiRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
      if (!formData.upiId || !upiRegex.test(formData.upiId)) {
        toast.error('Please enter a valid UPI ID (e.g., yourname@upi).');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    const flag = await validateStep();
    if (flag) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      const flag = await validateStep();
      if (!flag) {
        setIsLoading(false); 
        return;
      }

      const user = localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails')) : null;
      if (!user) {
        toast.error('User not authenticated. Please log in.');
        Navigate('/login');
        setIsLoading(false); 
        return;
      }

      let photoURL = formData.photo; 
      if (image && croppedImage) {
        const sanitizedEmail = user.email.replace(/[^a-zA-Z0-9]/g, '_');
        const storageRef = ref(storage, `users/profileImage/${sanitizedEmail}/${Date.now()}.jpg`);
        console.log('Storage Path:', storageRef.toString()); 
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        console.log('Blob Size:', blob.size); 
        const uploadTask = uploadBytesResumable(storageRef, blob, { contentType: 'image/jpeg' });

        photoURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              console.error('Upload error:', error);
              toast.error('Error uploading image to Firebase Storage!');
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  console.log('Download URL:', downloadURL); 
                  resolve(downloadURL);
                })
                .catch((error) => {
                  console.error('Download URL error:', error);
                  toast.error('Error getting download URL!');
                  reject(error);
                });
            }
          );
        });
      }

      console.log('Sending to backend:', {
        email: user.email,
        name: formData.name,
        username: formData.username,
        dateOfBirth: formData.dateOfBirth && isValid(formData.dateOfBirth) ? format(formData.dateOfBirth, 'dd-MM-yyyy') : '',
        upiID: formData.upiId,
        photo: photoURL,
        phoneNumber: formData.phoneNumber,
      }); 

      const response = await axios.post(
        '/api/auth/onBoardingComplete',
        {
          email: user.email,
          name: formData.name,
          username: formData.username,
          dateOfBirth: formData.dateOfBirth && isValid(formData.dateOfBirth) ? format(formData.dateOfBirth, 'dd-MM-yyyy') : '',
          upiID: formData.upiId,
          photo: photoURL,
          phoneNumber: formData.phoneNumber,
        },
        { withCredentials: true }
      );

      localStorage.setItem(
        'userDetails',
        JSON.stringify({
          ...JSON.parse(localStorage.getItem('userDetails') || '{}'),
          email: user.email,
          name: formData.name,
          username: formData.username,
          dateOfBirth: formData.dateOfBirth && isValid(formData.dateOfBirth) ? format(formData.dateOfBirth, 'dd-MM-yyyy') : '',
          upiId: formData.upiId,
          phoneNumber: formData.phoneNumber,
          picture: photoURL,
        })
      );

      toast.success('Profile updated successfully!');
      Navigate(response.data.redirect || '/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
         confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.85 },
                  colors: ['#34D399', '#10B981', '#059669'],
                })
      setIsLoading(false);
    }
  };

  const getProgressWidth = () => {
    return `${(currentStep / 3) * 100}%`;
  };

  async function getCroppedImg(editor) {
    return new Promise((resolve) => {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2 h-screen overflow-hidden">
      <div className="bg-gray-100 relative hidden lg:flex lg:flex-col justify-center items-center h-full">
        <div className="w-full flex h-full text-black text-5xl flex-col items-center justify-center">
          <div className="flex">
            <h1 className="py-1 mr-3 w-auto text-black font-semibold">Complete Your</h1>
            <h1 className="py-1 w-auto font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              <Typewriter
                words={['Profile', 'Journey', 'Setup']}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </h1>
          </div>
          <RiveSplitAnim height={window.innerHeight * 4 / 6} width="1000px" />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 h-full overflow-y-auto">
        <div className="flex justify-center gap-2">
          <a href="/" className="flex items-center gap-2 font-medium">
            <Logo height="100px" width="200px" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full transition-all duration-500"
                  style={{ width: getProgressWidth() }}
                ></div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Step {currentStep} of 3
              </p>
            </div>

            <form className={cn("flex flex-col gap-6 pt-0")}>
              <div className="flex flex-col align-top mt-0 items-center gap-2 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Complete Your Profile
                </h1>
                <p className="text-muted-foreground text-sm text-balance">
                  {currentStep === 1
                    ? 'Add your personal details'
                    : currentStep === 2
                    ? 'Enter your phone number'
                    : 'Enter your UPI ID'}
                </p>
              </div>
              <div className="grid gap-6 bg-white p-6 rounded-lg shadow-lg">
                {currentStep === 1 && (
                  <>
                    <div className="grid gap-3">
                      <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                      <div className="flex items-center gap-4">
                        <img
                          src={croppedImage || formData.photo}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        <Input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full cursor-pointer"
                        />
                      </div>
                      {showCropper && (
                        <div className="relative w-full mb-[10px] mt-[20px] flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg shadow-md">
                          <AvatarEditor
                            ref={editorRef}
                            image={image}
                            width={300}
                            height={300}
                            border={50}
                            borderRadius={150}
                            scale={scale}
                            rotate={0}
                            className="mx-auto"
                          />
                          <div className="mt-4 w-full">
                            <Label htmlFor="scale" className="block text-center mb-2 cursor-pointer">
                              Zoom
                            </Label>
                            <Input
                              id="scale"
                              type="range"
                              min="1"
                              max="2"
                              step="0.01"
                              value={scale}
                              onChange={handleScaleChange}
                              className="w-full"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleCrop}
                            className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          >
                            Crop Image
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={formData.name || 'John Doe'}
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="john_doe"
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.dateOfBirth && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dateOfBirth && isValid(formData.dateOfBirth) ? format(formData.dateOfBirth, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.dateOfBirth}
                            onSelect={handleDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </>
                )}
                {currentStep === 2 && (
                  <div className="grid gap-3">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="grid gap-3">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      name="upiId"
                      type="text"
                      placeholder="yourname@upi"
                      value={formData.upiId}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-4 mt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="w-full"
                    >
                      Back
                    </Button>
                  )}
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={cn(
                        "w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:-translate-y-1 relative",
                        isLoading && "cursor-not-allowed opacity-70"
                      )}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        "Save Profile"
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-center text-sm">
             
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;