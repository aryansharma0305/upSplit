  // "use client"

  // import React, { useState, useRef, useCallback, use } from "react"
  // import { motion } from "framer-motion"
  // import { Button } from "@/components/ui/button"
  // import { Input } from "@/components/ui/input"
  // import { Label } from "@/components/ui/label"
  // import { useNavigate } from "react-router-dom"
  // import { Calendar, User, User2, Phone, CreditCard, LogOut } from "lucide-react"
  // import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
  // import { GlowingEffect } from "../ui/glowing-effect"
  // import { format, isValid } from "date-fns"
  // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
  // import { Calendar as CalendarComponent } from "@/components/ui/calendar"
  // import AvatarEditor from "react-avatar-editor"
  // import { toast } from "sonner"
  // import { Edit } from "lucide-react"
  // import { useEffect } from "react"

  // // Sample user data (aligned with userSchema, no groups or joined date)
  // const userData = {
  //   name: "Riya Sharma",
  //   username: "riya_sharma",
  //   phoneNumber: "+919876543210",
  //   upi: "riya@upi",
  //       dateOfBirth: "15-01-1995",
  //   photoURL: "/deafult-avatar.png",
  // }

  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.05,
  //       delayChildren: 0.05,
  //     },
  //   },
  // }

  // const cardVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     scale: 1,
  //     transition: {
  //       duration: 0.06,
  //     },
  //   },
  // }

  // export default function ProfilePage() {
  //   const navigate = useNavigate()
  //   const [isEditing, setIsEditing] = useState(false)
  //   const [formData, setFormData] = useState({
  //     name: userData.name,
  //     username: userData.username,
  //     phoneNumber: userData.phoneNumber,
  //     upi: userData.upi,
  //     dateOfBirth: userData.dob ? new Date(userData.dob.split("-").reverse().join("-")) : null,
  //     photo: userData.photoURL,
  //   })
  //   const [image, setImage] = useState(null)
  //   const [scale, setScale] = useState(1)
  //   const [showCropper, setShowCropper] = useState(false)
  //   const [croppedImage, setCroppedImage] = useState(null)
  //   const editorRef = useRef(null)

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target
  //     setFormData((prev) => ({ ...prev, [name]: value }))
  //   }

  //   const handleDateChange = (date) => {
  //     setFormData((prev) => ({ ...prev, dateOfBirth: date }))
  //   }

  //   const handleImageChange = (e) => {
  //     const file = e.target.files[0]
  //     if (file) {
  //       setImage(file)
  //       setShowCropper(true)
  //     }
  //   }

  //   const handleScaleChange = (e) => {
  //     setScale(parseFloat(e.target.value))
  //   }

  //   const handleCrop = useCallback(async () => {
  //     if (editorRef.current) {
  //       try {
  //         const canvas = editorRef.current.getImageScaledToCanvas()
  //         canvas.toBlob((blob) => {
  //           const croppedImageUrl = URL.createObjectURL(blob)
  //           setCroppedImage(croppedImageUrl)
  //           setFormData((prev) => ({ ...prev, photo: croppedImageUrl }))
  //           setShowCropper(false)
  //           toast.success("Profile picture cropped successfully!")
  //         }, "image/jpeg")
  //       } catch (error) {
  //         toast.error("Error cropping image!")
  //         console.error("Crop error:", error)
  //       }
  //     }
  //   }, [])

  //   const handleSave = () => {
  //     // Validate inputs
  //     if (!formData.name || formData.name.length < 2) {
  //       toast.error("Please enter a valid name (at least 2 characters).")
  //       return
  //     }
  //     if (!formData.username || formData.username.length < 3 || formData.username.includes(" ")) {
  //       toast.error("Username must be at least 3 characters and contain no spaces.")
  //       return
  //     }
  //     const phoneRegex = /^\+?[1-9]\d{9,14}$/
  //     if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
  //       toast.error("Please enter a valid phone number (e.g., +1234567890).")
  //       return
  //     }
  //     const upiRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/
  //     if (!formData.upi || !upiRegex.test(formData.upi)) {
  //       toast.error("Please enter a valid UPI ID (e.g., yourname@upi).")
  //       return
  //     }
  //     if (!formData.dateOfBirth || !isValid(formData.dateOfBirth)) {
  //       toast.error("Please select a valid date of birth.")
  //       return
  //     }

   

  //     toast.success("Profile updated successfully!")
  //     setIsEditing(false)
  //   }

  //   const handleCancel = () => {
  //     setFormData({
  //       name: userData.name,
  //       username: userData.username,
  //       phoneNumber: userData.phoneNumber,
  //       upi: userData.upi,
  //       dateOfBirth: userData.dob ? new Date(userData.dob.split("-").reverse().join("-")) : null,
  //       photo: userData.photoURL,
  //     })
  //     setImage(null)
  //     setCroppedImage(null)
  //     setShowCropper(false)
  //     setIsEditing(false)
  //   }

  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //       let localStorageData = localStorage.getItem("userDetails")
  //       localStorageData = JSON.parse(localStorageData)
  //         try {
  //         const response = await fetch(`/api/users/getUser/${localStorageData.email}`)
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch user data")
  //         }
  //         const data = await response.json()
          
          
  //         // date is in dd-mm-yyyy format, convert it to Date object
  //         const dobParts = data.dob ? data.dob.split("-") : []
  //         const dobDate = dobParts.length === 3 ? new Date(`${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`) : null


  //          setFormData({
  //           name: data.name,
  //           username: data.username,  
  //           phoneNumber: data.phoneNumber,
  //           upi: data.upi,
  //           photo: data.photoURL || userData.photoURL,
  //           dateOfBirth: dobDate,
  //         })

  //       } catch (error) {
  //         console.error("Error fetching user data:", error)
  //         toast.error("Failed to load user data.")
  //       }
  //     }
  //     fetchUserData()
  //   }, [])
  //   return (
  //     <div className="w-full p-0 pt-4 sm:p-4 min-h-screen">
  //       <div className="flex mb-5 flex-wrap">
  //         <h1 className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
  //           My Profile
  //         </h1>
  //       </div>

  //       <TooltipProvider>
  //         <motion.div
  //           className="grid gap-4 grid-cols-1 max-w-2xl mx-auto"
  //           variants={containerVariants}
  //           initial="hidden"
  //           animate="visible"
  //         >
  //           {/* Profile Card */}
  //           <motion.div
  //             variants={cardVariants}
  //             className="relative rounded-lg border p-6 shadow-lg bg-white dark:bg-gray-800 text-sm flex flex-col gap-4"
  //           >
  //             <GlowingEffect
  //               blur={0.5}
  //               borderWidth={1.5}
  //               spread={100}
  //               glow={true}
  //               disabled={false}
  //               proximity={20}
  //               inactiveZone={0}
  //               className="z-0"
  //             />

  //             {/* Edit Profile Button */}
  //             <div className="absolute top-3 right-4">
  //               {!isEditing && (
  //                 <Button
  //                   variant="ghost"
  //                   size="sm"
  //                   className="text-emerald-600 hover:bg-emerald-50"
  //                   onClick={() => setIsEditing(true)}
  //                 >
  //                   <Edit className="w-4 h-4 mr-2" />
  //                   Edit Profile
  //                 </Button>
  //               )}
  //             </div>

  //             {/* Profile Picture */}
  //             <div className="flex items-center gap-4">
  //               <img
  //                 src={croppedImage || formData.photo}
  //                 alt="Profile"
  //                 className="w-24 h-24 rounded-full border object-cover"
  //               />
  //               {isEditing && (
  //                 <div className="grid gap-2 w-full">
  //                   <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
  //                   <Input
  //                     id="profilePicture"
  //                     type="file"
  //                     accept="image/*"
  //                     onChange={handleImageChange}
  //                     className="cursor-pointer"
  //                   />
  //                 </div>
  //               )}
  //             </div>

  //             {/* Cropper */}
  //             {showCropper && (
  //               <div className="relative w-full mb-4 flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg shadow-md">
  //                 <AvatarEditor
  //                   ref={editorRef}
  //                   image={image}
  //                   width={200}
  //                   height={200}
  //                   border={50}
  //                   borderRadius={100}
  //                   scale={scale}
  //                   rotate={0}
  //                   className="mx-auto"
  //                 />
  //                 <div className="mt-4 w-full max-w-xs">
  //                   <Label htmlFor="scale" className="block text-center mb-2 cursor-pointer">
  //                     Zoom
  //                   </Label>
  //                   <Input
  //                     id="scale"
  //                     type="range"
  //                     min="1"
  //                     max="2"
  //                     step="0.01"
  //                     value={scale}
  //                     onChange={handleScaleChange}
  //                     className="w-full"
  //                   />
  //                 </div>
  //                 <Button
  //                   type="button"
  //                   onClick={handleCrop}
  //                   className="mt-4 w-full max-w-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
  //                 >
  //                   Crop Image
  //                 </Button>
  //               </div>
  //             )}

  //             {/* Profile Details */}
  //             <div className="grid gap-3">
  //               <div className="flex items-center gap-2">
  //                 <User className="w-4 h-4 text-muted-foreground" />
  //                 {isEditing ? (
  //                   <div className="grid gap-1 w-full">
  //                     <Label htmlFor="name">Full Name</Label>
  //                     <Input
  //                       id="name"
  //                       name="name"
  //                       type="text"
  //                       placeholder="John Doe"
  //                       value={formData.name}
  //                       onChange={handleInputChange}
  //                     />
  //                   </div>
  //                 ) : (
  //                   <span className="text-sm">
  //                     Name: <strong className="text-foreground">{formData.name || "Not set"}</strong>
  //                   </span>
  //                 )}
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <User2 className="w-4 h-4 text-muted-foreground" />
  //                 {isEditing ? (
  //                   <div className="grid gap-1 w-full">
  //                     <Label htmlFor="username">Username</Label>
  //                     <Input
  //                       id="username"
  //                       name="username"
  //                       type="text"
  //                       placeholder="john_doe"
  //                       value={formData.username}
  //                       onChange={handleInputChange}
  //                     />
  //                   </div>
  //                 ) : (
  //                   <span className="text-sm">
  //                     Username: <strong className="text-foreground">{formData.username || "Not set"}</strong>
  //                   </span>
  //                 )}
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Phone className="w-4 h-4 text-muted-foreground" />
  //                 {isEditing ? (
  //                   <div className="grid gap-1 w-full">
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
  //                 ) : (
  //                   <span className="text-sm">
  //                     Phone: <strong className="text-foreground">{formData.phoneNumber || "Not set"}</strong>
  //                   </span>
  //                 )}
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <CreditCard className="w-4 h-4 text-muted-foreground" />
  //                 {isEditing ? (
  //                   <div className="grid gap-1 w-full">
  //                     <Label htmlFor="upi">UPI ID</Label>
  //                     <Input
  //                       id="upi"
  //                       name="upi"
  //                       type="text"
  //                       placeholder="yourname@upi"
  //                       value={formData.upi}
  //                       onChange={handleInputChange}
  //                     />
  //                   </div>
  //                 ) : (
  //                   <span className="text-sm">
  //                     UPI: <strong className="text-foreground">{formData.upi || "Not set"}</strong>
  //                   </span>
  //                 )}
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Calendar className="w-4 h-4 text-muted-foreground" />
  //                 {isEditing ? (
  //                   <div className="grid gap-1 w-full">
  //                     <Label htmlFor="dateOfBirth">Date of Birth</Label>
  //                     <Popover>
  //                       <PopoverTrigger asChild>
  //                         <Button
  //                           variant="outline"
  //                           className="w-full justify-start text-left font-normal text-sm"
  //                         >
  //                           <Calendar className="mr-2 h-4 w-4" />
  //                           {formData.dateOfBirth && isValid(formData.dateOfBirth) ? (
  //                             format(formData.dateOfBirth, "PPP")
  //                           ) : (
  //                             <span>Pick a date</span>
  //                           )}
  //                         </Button>
  //                       </PopoverTrigger>
  //                       <PopoverContent className="w-auto p-0">
  //                         <CalendarComponent
  //                           mode="single"
  //                           selected={formData.dateOfBirth}
  //                           onSelect={handleDateChange}
  //                           initialFocus
  //                         />
  //                       </PopoverContent>
  //                     </Popover>
  //                   </div>
  //                 ) : (
  //                   <span className="text-sm">
  //                     DOB: <strong className="text-foreground">
  //                       {formData.dateOfBirth && isValid(formData.dateOfBirth)
  //                         ? format(formData.dateOfBirth, "dd-MM-yyyy")
  //                         : "Not set"}
  //                     </strong>
  //                   </span>
  //                 )}
  //               </div>
  //             </div>

  //             {/* Edit Actions */}
  //             {isEditing && (
  //               <div className="flex gap-2 mt-4">
  //                 <Button
  //                   size="sm"
  //                   className="bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
  //                   onClick={handleSave}
  //                 >
  //                   Save
  //                 </Button>
  //                 <Button
  //                   size="sm"
  //                   variant="secondary"
  //                   onClick={handleCancel}
  //                 >
  //                   Cancel
  //                 </Button>
                  
  //               </div>
  //             )}
  //           </motion.div>
  //         </motion.div>
  //       </TooltipProvider>
  //     </div>
  //   )
  // }









  "use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { Calendar, User, User2, Phone, CreditCard, LogOut } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { GlowingEffect } from "../ui/glowing-effect"
import { format, isValid } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import AvatarEditor from "react-avatar-editor"
import { toast } from "sonner"
import { Edit } from "lucide-react"
import axios from "axios"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "@/firebase.js"
import confetti from "canvas-confetti"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.06,
    },
  },
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phoneNumber: "",
    upi: "",
    dateOfBirth: null,
    photo: "/default-avatar.png",
  })
  const [image, setImage] = useState(null)
  const [scale, setScale] = useState(1)
  const [showCropper, setShowCropper] = useState(false)
  const [croppedImage, setCroppedImage] = useState(null)
  const editorRef = useRef(null)

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const localStorageData = localStorage.getItem("userDetails")
      if (!localStorageData) {
        toast.error("User not authenticated. Please log in.")
        navigate("/login")
        return
      }
      const user = JSON.parse(localStorageData)
      try {
        const response = await axios.get(`/api/users/getUser/${user.email}`, { withCredentials: true })
        const data = response.data
        const dobParts = data.dob ? data.dob.split("-") : []
        const dobDate = dobParts.length === 3 ? new Date(`${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`) : null

        setFormData({
          name: data.name || "",
          username: data.username || "",
          phoneNumber: data.phoneNumber || "",
          upi: data.upi || "",
          photo: data.photoURL || "/default-avatar.png",
          dateOfBirth: dobDate,
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load user data.")
      }
    }
    fetchUserData()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setShowCropper(true)
    }
  }

  const handleScaleChange = (e) => {
    setScale(parseFloat(e.target.value))
  }

  const handleCrop = useCallback(async () => {
    if (editorRef.current) {
      try {
        const canvas = editorRef.current.getImageScaledToCanvas()
        canvas.toBlob((blob) => {
          const croppedImageUrl = URL.createObjectURL(blob)
          setCroppedImage(croppedImageUrl)
          setFormData((prev) => ({ ...prev, photo: croppedImageUrl }))
          setShowCropper(false)
          toast.success("Profile picture cropped successfully!")
        }, "image/jpeg")
      } catch (error) {
        toast.error("Error cropping image!")
        console.error("Crop error:", error)
      }
    }
  }, [])

  const validateInputs = async () => {
    if (!formData.name || formData.name.length < 2) {
      toast.error("Please enter a valid name (at least 2 characters).")
      return false
    }
    if (!formData.username || formData.username.length < 3 || formData.username.includes(" ")) {
      toast.error("Username must be at least 3 characters and contain no spaces.")
      return false
    }
    const phoneRegex = /^\+?[1-9]\d{9,14}$/
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number (e.g., +1234567890).")
      return false
    }
    const upiRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/
    if (!formData.upi || !upiRegex.test(formData.upi)) {
      toast.error("Please enter a valid UPI ID (e.g., yourname@upi).")
      return false
    }
    if (!formData.dateOfBirth || !isValid(formData.dateOfBirth)) {
      toast.error("Please select a valid date of birth.")
      return false
    }
    // Check username uniqueness
    try {
      const resp = await axios.post(
        "/api/auth/verifyIfUserNameIsUnique",
        { userName: formData.username },
        { withCredentials: true }
      )
      if (!resp.data.isUnique && formData.username !== JSON.parse(localStorage.getItem("userDetails")).username) {
        toast.error("Username is already taken. Please choose a different one.")
        return false
      }
    } catch (error) {
      toast.error("Error checking username uniqueness!")
      console.error("Username uniqueness check error:", error.message)
      return false
    }
    return true
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const isValidInput = await validateInputs()
      if (!isValidInput) {
        setIsLoading(false)
        return
      }

      const user = JSON.parse(localStorage.getItem("userDetails"))
      if (!user) {
        toast.error("User not authenticated. Please log in.")
        navigate("/login")
        setIsLoading(false)
        return
      }

      let photoURL = formData.photo
      if (image && croppedImage) {
        const sanitizedEmail = user.email.replace(/[^a-zA-Z0-9]/g, "_")
        const storageRef = ref(storage, `users/profileImage/${sanitizedEmail}/${Date.now()}.jpg`)
        const response = await fetch(croppedImage)
        const blob = await response.blob()
        const uploadTask = uploadBytesResumable(storageRef, blob, { contentType: "image/jpeg" })

        photoURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log(`Upload is ${progress}% done`)
            },
            (error) => {
              console.error("Upload error:", error)
              toast.error("Error uploading image to Firebase Storage!")
              reject(error)
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  console.log("Download URL:", downloadURL)
                  resolve(downloadURL)
                })
                .catch((error) => {
                  console.error("Download URL error:", error)
                  toast.error("Error getting download URL!")
                  reject(error)
                })
            }
          )
        })
      }

      // Update backend
      const response = await axios.post(
        "/api/users/updateUser",
        {
          email: user.email,
          name: formData.name,
          username: formData.username,
          dateOfBirth: formData.dateOfBirth && isValid(formData.dateOfBirth) ? format(formData.dateOfBirth, "dd-MM-yyyy") : "",
          upi: formData.upi,
          photoURL: photoURL,
          phoneNumber: formData.phoneNumber,
        },
        { withCredentials: true }
      )

      // Update localStorage
      localStorage.setItem(
        "userDetails",
        JSON.stringify({
          ...user,
          name: formData.name,
          username: formData.username,
          dateOfBirth: formData.dateOfBirth && isValid(formData.dateOfBirth) ? format(formData.dateOfBirth, "dd-MM-yyyy") : "",
          upi: formData.upi,
          phoneNumber: formData.phoneNumber,
          picture: photoURL,
        })
      )

      toast.success("Profile updated successfully!")
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.85 },
        colors: ["#34D399", "#10B981", "#059669"],
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error(`Error updating profile: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    const user = JSON.parse(localStorage.getItem("userDetails"))
    const dobParts = user.dateOfBirth ? user.dateOfBirth.split("-") : []
    const dobDate = dobParts.length === 3 ? new Date(`${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`) : null

    setFormData({
      name: user.name || "",
      username: user.username || "",
      phoneNumber: user.phoneNumber || "",
      upi: user.upi || "",
      dateOfBirth: dobDate,
      photo: user.picture || "/default-avatar.png",
    })
    setImage(null)
    setCroppedImage(null)
    setShowCropper(false)
    setIsEditing(false)
  }

  return (
    <div className="w-full p-0 pt-4 sm:p-4 min-h-screen">
      <div className="flex mb-5 flex-wrap">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          My Profile
        </h1>
      </div>

      <TooltipProvider>
        <motion.div
          className="grid gap-4 grid-cols-1 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Card */}
          <motion.div
            variants={cardVariants}
            className="relative rounded-lg border p-6 shadow-lg bg-white dark:bg-gray-800 text-sm flex flex-col gap-4"
          >
            <GlowingEffect
              blur={0.5}
              borderWidth={1.5}
              spread={100}
              glow={true}
              disabled={false}
              proximity={20}
              inactiveZone={0}
              className="z-0"
            />

            {/* Edit Profile Button */}
            <div className="absolute top-3 right-4">
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600 hover:bg-emerald-50"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <img
                src={croppedImage || formData.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full border object-cover"
              />
              {isEditing && (
                <div className="grid gap-2 w-full">
                  <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Cropper */}
            {showCropper && (
              <div className="relative w-full mb-4 flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg shadow-md">
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={200}
                  height={200}
                  border={50}
                  borderRadius={100}
                  scale={scale}
                  rotate={0}
                  className="mx-auto"
                />
                <div className="mt-4 w-full max-w-xs">
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
                  className="mt-4 w-full max-w-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  Crop Image
                </Button>
              </div>
            )}

            {/* Profile Details */}
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <div className="grid gap-1 w-full">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span className="text-sm">
                    Name: <strong className="text-foreground">{formData.name || "Not set"}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <User2 className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <div className="grid gap-1 w-full">
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
                ) : (
                  <span className="text-sm">
                    Username: <strong className="text-foreground">{formData.username || "Not set"}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <div className="grid gap-1 w-full">
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
                ) : (
                  <span className="text-sm">
                    Phone: <strong className="text-foreground">{formData.phoneNumber || "Not set"}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <div className="grid gap-1 w-full">
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input
                      id="upi"
                      name="upi"
                      type="text"
                      placeholder="yourname@upi"
                      value={formData.upi}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span className="text-sm">
                    UPI: <strong className="text-foreground">{formData.upi || "Not set"}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <div className="grid gap-1 w-full">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal text-sm"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.dateOfBirth && isValid(formData.dateOfBirth) ? (
                            format(formData.dateOfBirth, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={formData.dateOfBirth}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <span className="text-sm">
                    DOB: <strong className="text-foreground">
                      {formData.dateOfBirth && isValid(formData.dateOfBirth)
                        ? format(formData.dateOfBirth, "dd-MM-yyyy")
                        : "Not set"}
                    </strong>
                  </span>
                )}
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  className="bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </TooltipProvider>
    </div>
  )
}