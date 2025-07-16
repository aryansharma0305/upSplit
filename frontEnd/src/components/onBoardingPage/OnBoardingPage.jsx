


// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { format } from 'date-fns';
// import { Calendar as CalendarIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { cn } from '@/lib/utils';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { toast } from 'sonner';
// import AvatarEditor from 'react-avatar-editor';
// import Logo from '../logo';
// import { Typewriter } from 'react-simple-typewriter';
// import RiveSplitAnim from '../riveSplitAnim';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Calendar } from '@/components/ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// const OnBoardingPage = () => {
//   const Navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: '',
//     upiId: '',
//     dateOfBirth: null,
//     phoneNumber: '',
//     username: '',
//     photo: '/default-avatar.png',
//   });
//   const [image, setImage] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [showCropper, setShowCropper] = useState(false);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const editorRef = useRef(null);

//   // Load user details from localStorage
//   useEffect(() => {
//     const userDetails = localStorage.getItem('userDetails');
//     if (userDetails) {
//       const parsedDetails = JSON.parse(userDetails);
//       console.log('Parsed DETAILS:', parsedDetails);
//       setFormData({
//         name: parsedDetails.name || '',
//         upiId: parsedDetails.upiId || '',
//         dateOfBirth: parsedDetails.dateOfBirth ? new Date(parsedDetails.dateOfBirth) : null,
//         phoneNumber: parsedDetails.phoneNumber || '',
//         username: parsedDetails.username || '',
//         photo: parsedDetails.picture || '/default-avatar.png',
//       });
//     } else {
//       Navigate('/login');
//     }
//   }, [Navigate]);

// //   useEffect(() => {
// //     AOS.init({ once: false, duration: 800, offset: -100 });
// //   }, []);

//   useEffect(() => {
//     console.log('FormData:', formData);
//   }, [formData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDateChange = (date) => {
//     setFormData((prev) => ({ ...prev, dateOfBirth: date }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//       setShowCropper(true);
//     }
//   };

//   const handleScaleChange = (e) => {
//     setScale(parseFloat(e.target.value));
//   };

//   const handleCrop = useCallback(async () => {
//     if (editorRef.current) {
//       try {
//         const croppedImageUrl = await getCroppedImg(editorRef.current);
//         setCroppedImage(croppedImageUrl);
//         setFormData((prev) => ({ ...prev, photo: croppedImageUrl }));
//         setShowCropper(false);
//         toast.success('Profile picture cropped successfully!');
//       } catch (error) {
//         toast.error('Error cropping image!');
//         console.error('Crop error:', error);
//       }
//     }
//   }, []);

//   const validateStep = () => {
//     if (currentStep === 1) {
//       if (!formData.name || !formData.username || !formData.dateOfBirth) {
//         toast.error('Please fill in Name, Username, and Date of Birth.');
//         return false;
//       }
//     } else if (currentStep === 2) {
//       const phoneRegex = /^\+?[1-9]\d{1,14}$/;
//       if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
//         toast.error('Please enter a valid phone number (e.g., +1234567890).');
//         return false;
//       }
//     } else if (currentStep === 3) {
//       const upiRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
//       if (!formData.upiId || !upiRegex.test(formData.upiId)) {
//         toast.error('Please enter a valid UPI ID (e.g., yourname@upi).');
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleNext = () => {
//     if (validateStep()) {
//       setCurrentStep((prev) => Math.min(prev + 1, 3));
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateStep()) return;
//     try {
//       const response = await axios.post(
//         '/api/user/complete-profile',
//         {
//           ...formData,
//           profilePicture: croppedImage || formData.photo,
//           dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : '',
//         },
//         { withCredentials: true }
//       );
//       toast.success('Profile updated successfully!');
//       Navigate(response.data.redirect || '/dashboard');
//     } catch (error) {
//       toast.error('Error updating profile!');
//       console.error('Profile update error:', error.message);
//     }
//   };

//   const getProgressWidth = () => {
//     return `${(currentStep / 3) * 100}%`;
//   };

//   async function getCroppedImg(editor) {
//     return new Promise((resolve) => {
//       const canvas = editor.getImageScaledToCanvas();
//       canvas.toBlob((blob) => {
//         resolve(URL.createObjectURL(blob));
//       }, 'image/jpeg');
//     });
//   }

//   return (
//     <div className="grid min-h-svh lg:grid-cols-2 h-screen overflow-hidden">
//       <div className="bg-gray-100 relative hidden lg:flex lg:flex-col justify-center items-center h-full">
//         <div className="w-full flex h-full text-black text-5xl flex-col items-center justify-center">
//           <div className="flex" data-aos="fade-down">
//             <h1 className="py-1 mr-3 w-auto text-black font-semibold">Complete Your</h1>
//             <h1 className="py-1 w-auto font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//               <Typewriter
//                 words={['Profile', 'Journey', 'Setup']}
//                 loop={true}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={70}
//                 deleteSpeed={50}
//                 delaySpeed={2000}
//               />
//             </h1>
//           </div>
//           <RiveSplitAnim height={window.innerHeight * 4 / 6} width="1000px" />
//         </div>
//       </div>
//       <div className="flex flex-col gap-4 p-6 md:p-10 h-full overflow-y-auto">
//         <div className="flex justify-center gap-2">
//           <a href="/" className="flex items-center gap-2 font-medium">
//             <Logo height="100px" width="200px" />
//           </a>
//         </div>
//         <div className="flex flex-1 items-center justify-center">
//           <div className="w-full max-w-md">
//             <div className="mb-6">
//               <div className="h-2 bg-gray-200 rounded-full">
//                 <div
//                   className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full transition-all duration-500"
//                   style={{ width: getProgressWidth() }}
//                 ></div>
//               </div>
//               <p className="text-center text-sm text-muted-foreground mt-2">
//                 Step {currentStep} of 3
//               </p>
//             </div>
//             <form onSubmit={handleSubmit} className={cn(" gap-6 pt-0")}>
//               <div className="flex flex-col align-top mt-0 items-center gap-2 text-center" data-aos="fade-down">
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//                   Complete Your Profile
//                 </h1>
//                 <p className="text-muted-foreground text-sm text-balance">
//                   {currentStep === 1
//                     ? 'Add your personal details'
//                     : currentStep === 2
//                     ? 'Verify your phone number'
//                     : 'Enter your UPI ID'}
//                 </p>
//               </div>
//               <div className="grid gap-6 bg-white p-6 rounded-lg shadow-lg">
//                 {currentStep === 1 && (
//                   <>
//                     <div className="grid gap-3" data-aos="fade-up" data-aos-delay="0">
//                       <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
//                       <div className="flex items-center gap-4">
//                         <img
//                           src={croppedImage || formData.photo}
//                           alt="Profile"
//                           className="w-24 h-24 rounded-full object-cover"
//                         />
//                         <Input
//                           id="profilePicture"
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageChange}
//                           className="w-full cursor-pointer"
//                         />
//                       </div>
//                       {showCropper && (
//                         <div className="relative w-full mb-[10px] mt-[20px] flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg shadow-md">
//                           <AvatarEditor
//                             ref={editorRef}
//                             image={image}
//                             width={300}
//                             height={300}
//                             border={50}
//                             borderRadius={150}
//                             scale={scale}
//                             rotate={0}
//                             className="mx-auto"
//                           />
//                           <div className="mt-4 w-full">
//                             <Label htmlFor="scale" className="block text-center mb-2 cursor-pointer">
//                               Zoom
//                             </Label>
//                             <Input
//                               id="scale"
//                               type="range"
//                               min="1"
//                               max="2"
//                               step="0.01"
//                               value={scale}
//                               onChange={handleScaleChange}
//                               className="w-full"
//                             />
//                           </div>
//                           <Button
//                             type="button"
//                             onClick={handleCrop}
//                             className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
//                           >
//                             Crop Image
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                     <div className="grid gap-3" data-aos="fade-up" data-aos-delay="50">
//                       <Label htmlFor="name">Full Name</Label>
//                       <Input
//                         id="name"
//                         name="name"
//                         type="text"
//                         placeholder={formData.name || 'John Doe'}
//                         value={formData.name}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="grid gap-3" data-aos="fade-up" data-aos-delay="100">
//                       <Label htmlFor="username">Username</Label>
//                       <Input
//                         id="username"
//                         name="username"
//                         type="text"
//                         placeholder="john_doe"
//                         value={formData.username}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="grid gap-3" data-aos="fade-up" data-aos-delay="150">
//                       <Label htmlFor="dateOfBirth">Date of Birth</Label>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className={cn(
//                               "w-full justify-start text-left font-normal",
//                               !formData.dateOfBirth && "text-muted-foreground"
//                             )}
//                           >
//                             <CalendarIcon className="mr-2 h-4 w-4" />
//                             {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : <span>Pick a date</span>}
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0">
//                           <Calendar
//                             mode="single"
//                             selected={formData.dateOfBirth}
//                             onSelect={handleDateChange}
//                             initialFocus
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                   </>
//                 )}
//                 {currentStep === 2 && (
//                   <div className="grid gap-3" data-aos="fade-up" data-aos-delay="50">
//                     <Label htmlFor="phoneNumber">Phone Number</Label>
//                     <Input
//                       id="phoneNumber"
//                       name="phoneNumber"
//                       type="tel"
//                       placeholder="+1234567890"
//                       value={formData.phoneNumber}
//                       onChange={handleInputChange}
//                     />

//                   </div>
//                 )}
//                 {currentStep === 3 && (
//                   <div className="grid gap-3" data-aos="fade-up" data-aos-delay="50">
//                     <Label htmlFor="upiId">UPI ID</Label>
//                     <Input
//                       id="upiId"
//                       name="upiId"
//                       type="text"
//                       placeholder="yourname@upi"
//                       value={formData.upiId}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 )}
//                 <div className="flex flex-col gap-4 mt-4">
//                   {currentStep > 1 && (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={handleBack}
//                       className="w-full"
                     
//                     >
//                       Back
//                     </Button>
//                   )}
//                   {currentStep < 3 ? (
//                     <Button
//                       type="button"
//                       onClick={handleNext}
//                       className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      
//                     >
//                       Next
//                     </Button>
//                   ) : (
//                     <Button
//                       type="submit"
//                       className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:-translate-y-1"
//                       data-aos="fade-up"
//                       data-aos-delay="300"
//                       onClick={()=>{console.log("Form submitted with data:", formData)}}
//                     >
//                       Save Profile
//                     </Button>
//                   )}
//                 </div>
//               </div>
              
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnBoardingPage;



import React, { useEffect, useState, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'sonner';
import AvatarEditor from 'react-avatar-editor';
import Logo from '../logo';
import { Typewriter } from 'react-simple-typewriter';
import RiveSplitAnim from '../riveSplitAnim';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { auth, RecaptchaVerifier } from '@/firebase.js'
import { signInWithPhoneNumber } from 'firebase/auth'

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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const editorRef = useRef(null);
  const otpInputs = useRef([]);

  // Load user details from localStorage
  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    if (userDetails) {
      const parsedDetails = JSON.parse(userDetails);
      console.log('Parsed DETAILS:', parsedDetails);
      setFormData({
        name: parsedDetails.name || '',
        upiId: parsedDetails.upiId || '',
        dateOfBirth: parsedDetails.dateOfBirth ? new Date(parsedDetails.dateOfBirth) : null,
        phoneNumber: parsedDetails.phoneNumber || '',
        username: parsedDetails.username || '',
        photo: parsedDetails.picture || '/default-avatar.png',
      });
      if (parsedDetails.phoneNumber) {
        setIsOtpVerified(true);
      }
    } else {
      Navigate('/login');
    }
  }, []);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ once: false, duration: 800, offset: -100 });
  }, []);

  // Resend OTP cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Log formData changes
  useEffect(() => {
    console.log('FormData:', formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'phoneNumber') {
      setIsOtpSent(false);
      setIsOtpVerified(false);
      setOtp(['', '', '', '', '', '']);
      setResendCooldown(0);
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
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

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      otpInputs.current[5].focus();
    }
  };

   const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: () => handleSendOtp()
    }, auth);
  }

  const handleSendOtp = async () => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      toast.error('Please enter a valid phone number (e.g., +1234567890).');
      return;
    }
     setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      
        
      setResendCooldown(30);
      toast.success('OTP sent to your phone number!');
      otpInputs.current[0].focus();
    } catch (error) {
      toast.error('Error sending OTP!');
      console.error('Send OTP error:', error.message);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter a 6-digit OTP.');
      return;
    }
    
    try {
      const response = await axios.post(
        '/api/user/verify-otp',
        { phoneNumber: formData.phoneNumber, otp: otpString },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsOtpVerified(true);
        toast.success('OTP verified successfully!');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }

    } catch (error) {
      toast.error('Error verifying OTP!');
      console.error('Verify OTP error:', error.message);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setOtp(['', '', '', '', '', '']);
    await handleSendOtp();
  };

  const validateStep = async () => {
    if (currentStep === 1) {
        if (!formData.name || !formData.username || !formData.dateOfBirth) {
            toast.error('Please fill in Name, Username, and Date of Birth.');
            return false;
        }
        if( formData.username.length < 3 || formData.username.length > 20 ) {
            toast.error('Username must be between 3 and 20 characters.');
            return false;
        }
        if(formData.username.includes(' ')) {
            toast.error('Username cannot contain spaces.');
            return false;
        }
        try{
            const resp= await axios.post(
                '/api/auth/verifyIfUserNameIsUnique',
                { userName: formData.username } 
            );
            if (!resp.data.isUnique) {
                toast.error('Username is already taken. Please choose a different one.');
                return false;
            }
        } 
        catch (error) 
        {
            toast.error('Error checking username uniqueness!');
            console.error('Username uniqueness check error:', error.message);
            return false;
            
        }

    } else if (currentStep === 2) {
      if (!isOtpVerified) {
        toast.error('Please verify your phone number with OTP.');
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

  const handleNext = async() => {
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
    const flag= await validateStep();
    if ( !flag ) return;
    try {
      const response = await axios.post(
        '/api/user/complete-profile',
        {
          ...formData,
          profilePicture: croppedImage || formData.photo,
          dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : '',
        },
        { withCredentials: true }
      );
      toast.success('Profile updated successfully!');
      Navigate(response.data.redirect || '/dashboard');
    } catch (error) {
      toast.error('Error updating profile!');
      console.error('Profile update error:', error.message);
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
          <div className="flex" data-aos="fade-down">
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
            <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6 pt-0")}>
              <div className="flex flex-col align-top mt-0 items-center gap-2 text-center" data-aos="fade-down">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Complete Your Profile
                </h1>
                <p className="text-muted-foreground text-sm text-balance">
                  {currentStep === 1
                    ? 'Add your personal details'
                    : currentStep === 2
                    ? 'Verify your phone number'
                    : 'Enter your UPI ID'}
                </p>
              </div>
              <div className="grid gap-6 bg-white p-6 rounded-lg shadow-lg">
                {currentStep === 1 && (
                  <>
                    <div className="grid gap-3" data-aos="fade-up" data-aos-delay="0">
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
                    <div className="grid gap-3" data-aos="fade-up" data-aos-delay="50">
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
                    <div className="grid gap-3" data-aos="fade-up" data-aos-delay="100">
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
                    <div className="grid gap-3" data-aos="fade-up" data-aos-delay="150">
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
                            {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : <span>Pick a date</span>}
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
                  <div className="grid gap-3" data-aos="fade-up" data-aos-delay="50">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={isOtpVerified}
                    />
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      disabled={isOtpSent || isOtpVerified}
                      data-aos="fade-up"
                      data-aos-delay="100"
                    >
                      Send OTP
                    </Button>
                    <Label>One-Time Password</Label>
                    <div className="flex items-center justify-center gap-2" onPaste={handleOtpPaste}>
                      {otp.map((digit, index) => (
                        <React.Fragment key={index}>
                          <input
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            disabled={!isOtpSent || isOtpVerified}
                            ref={(el) => (otpInputs.current[index] = el)}
                            className={cn(
                              "w-10 h-10 text-center text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500",
                              !isOtpSent || isOtpVerified ? "opacity-50 cursor-not-allowed" : "bg-white"
                            )}
                          />
                          {index === 2 && <span className="text-gray-500">-</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      {isOtpVerified
                        ? 'Phone number verified!'
                        : isOtpSent
                        ? 'Enter the OTP sent to your phone.'
                        : 'Click Send OTP to receive a code.'}
                    </p>
                    {isOtpSent && !isOtpVerified && (
                      <>
                        <Button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          data-aos="fade-up"
                          data-aos-delay="150"
                        >
                          Verify OTP
                        </Button>
                        <Button
                          type="button"
                          onClick={handleResendOtp}
                          className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                          disabled={resendCooldown > 0}
                          data-aos="fade-up"
                          data-aos-delay="200"
                        >
                          {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
                        </Button>
                      </>
                    )}
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="grid gap-3" data-aos="fade-up" data-aos-delay="50">
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
                      data-aos="fade-up"
                      data-aos-delay="200"
                    >
                      Back
                    </Button>
                  )}
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:-translate-y-1"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      Save Profile
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-center text-sm" data-aos="fade-up" data-aos-delay="350">
                <a
                  href="/dashboard"
                  className="underline underline-offset-4 font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:text-emerald-700"
                >
                  Skip for now
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;