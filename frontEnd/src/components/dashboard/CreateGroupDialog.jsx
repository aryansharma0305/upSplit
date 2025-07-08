"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import  StatefulButton  from "@/components/ui/stateful-button"
import { PlusCircle, Users, UploadCloud, X, Check, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import Cropper from "react-easy-crop"
import { Slider } from "@/components/ui/slider"
import { toast, Toaster } from "sonner"
import { useNavigate } from "react-router-dom"

import confetti from "canvas-confetti"



export function CreateGroupDialog() {
  const [step, setStep] = useState(1)
  const [groupName, setGroupName] = useState("")
  const [groupImage, setGroupImage] = useState(null)
  const [tempImage, setTempImage] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [query, setQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef(null)
  const maxLength = 50
  const maxFileSize = 5 * 1024 * 1024 // 5MB in bytes

  const mockUsers = [
    { id: 1, name: "Tanu Mehra", email: "tanu@example.com", profilePic: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 2, name: "Rishi Patel", email: "rishi@example.com", profilePic: "https://randomuser.me/api/portraits/men/75.jpg" },
    { id: 3, name: "Megha Jain", email: "megha@example.com", profilePic: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 4, name: "Aryan Sharma", email: "aryan.sharma@example.com", profilePic: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: 5, name: "Saanvi Kiran", email: "saanvi.kiran@example.com", profilePic: "https://randomuser.me/api/portraits/women/5.jpg" },
  ]

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = mockUsers.filter(
        user =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered)
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  const validateFile = (file) => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please select an image file.",
      })
      return false
    }
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
      toast.error("Invalid file type", {
        description: "Please upload a PNG, JPG, or JPEG image.",
      })
      return false
    }
    if (file.size > maxFileSize) {
      toast.error("File too large", {
        description: "Image must be smaller than 5MB.",
      })
      return false
    }
    return true
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!validateFile(file)) return
    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = () => {
      setTempImage(reader.result)
      setIsLoading(false)
      console.log("File loaded:", reader.result) // Remove in production
    }
    reader.onerror = () => {
      setIsLoading(false)
      toast.error("Error", {
        description: "Failed to read the image file.",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (!validateFile(file)) return
    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = () => {
      setTempImage(reader.result)
      setIsLoading(false)
      console.log("File dropped:", reader.result) // Remove in production
    }
    reader.onerror = () => {
      setIsLoading(false)
      toast.error("Error", {
        description: "Failed to read the dropped image file.",
      })
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCrop = async () => {
    if (!tempImage || !croppedAreaPixels) {
      toast.error("Error", {
        description: "No image or crop area selected.",
      })
      return
    }
    setIsLoading(true)
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const image = new Image()
      image.src = tempImage
      await new Promise((resolve) => (image.onload = resolve))

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )
      setGroupImage(canvas.toDataURL("image/jpeg"))
      setTempImage(null)
      setZoom(1)
      setCrop({ x: 0, y: 0 })
      toast.success("Image cropped and saved")
    } catch (error) {
      console.error("Crop error:", error)
      toast.error("Error", {
        description: "Failed to crop the image.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMember = (user) => {
    if (selectedMembers.find((m) => m.id === user.id)) {
      setSelectedMembers((prev) => prev.filter((m) => m.id !== user.id))
    } else {
      setSelectedMembers((prev) => [...prev, user])
    }
  }

  const removeMember = (id) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const CloseButtonRef = useRef(null)


  const Navigate=useNavigate()

  const handleCreateGroup=()=>{

    console.log("Button Clicked")
    toast("Creating event...")
     if(selectedMembers.length === 0) {
    
            console.log("No members selected")
        toast("Event has been created");

            
     }
    

      return new Promise((resolve, reject) => {
  
       

            setTimeout(() => {
            resolve();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.85 },
                colors: ['#34D399', '#10B981', '#059669'],
            })
            setTimeout(() => {
                CloseButtonRef.current.click();
                Navigate("/dashboard/group/1")
            }, 500); 
            }, 1000); 
        
        }
    
    )
    }




  const handleNext = () => {
    if (step === 1 && groupName) setStep(2)
  }

  const handleBack = () => {
    if (step === 2) setStep(1)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 hover:-translate-y-0.5 transition-all duration-200">
          <Users className="w-4 h-4" />
          Create Group
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Create a New Group - Step {step} of 2
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Set up your group with a name and a photo."
              : "Add members to your group."}
          </DialogDescription>
          <div className="flex gap-2 mt-2">
            <div className={cn("h-2 w-1/2 rounded-full", step === 1 ? "bg-emerald-600" : "bg-muted")} />
            <div className={cn("h-2 w-1/2 rounded-full", step === 2 ? "bg-emerald-600" : "bg-muted")} />
          </div>
        </DialogHeader>

        {step === 1 && (
          <div className="grid gap-6 py-4">
            {/* Group Name */}
            <div className="grid gap-2">
              <Label htmlFor="group-name" className="text-sm font-medium">
                Group Name
              </Label>
              <Input
                id="group-name"
                placeholder="e.g. Trip to Goa"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value.slice(0, maxLength))}
                maxLength={maxLength}
                className="text-base"
                aria-describedby="group-name-counter"
              />
              <p id="group-name-counter" className="text-xs text-muted-foreground">
                {groupName.length}/{maxLength} characters
              </p>
            </div>

            {/* Group Photo Upload */}
            <div className="grid gap-2 mb-30">
              <Label className="text-sm font-medium">Group Photo</Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-full flex items-center justify-center h-64 w-64 mx-auto bg-muted transition-colors relative",
                  isDragging ? "border-emerald-500 bg-emerald-50" : "hover:bg-muted/60",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !groupImage && !tempImage && !isLoading && fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (!isLoading) setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : groupImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={groupImage}
                      alt="Group"
                      className="h-full w-full object-cover rounded-full"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        setGroupImage(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : tempImage ? (
                  <div className="relative w-full h-full flex flex-col gap-10">
                    <div className="w-full h-full">
                      <Cropper
                        image={tempImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="circle"
                        showGrid={false}
                        style={{
                          containerStyle: {
                            width: "100%",
                            height: "100%",
                            borderRadius: "9999px",
                            overflow: "hidden",
                            backgroundColor: "#f7fafc",
                          },
                          cropAreaStyle: {
                            border: "2px solid #10b981",
                          },
                        }}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    <div className="px-8 mt-60">
                      <Slider
                        value={[zoom]}
                        min={1}
                        max={3}
                        step={0.1}
                        onValueChange={([val]) => setZoom(val)}
                        className="w-full "
                      />
                    </div>
                    <div className="flex justify-center   gap-2 px-8">
                      <Button
                        size="sm"
                        onClick={handleCrop}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        disabled={isLoading}
                      >
                        Crop & Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTempImage(null)
                          setZoom(1)
                          setCrop({ x: 0, y: 0 })
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="w-12 h-12" />
                    <span className="text-sm text-center">
                      Click to upload or drag and drop an image
                    </span>
                    <span className="text-xs text-center">
                      (PNG, JPG, JPEG, up to 5MB)
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
              {groupImage && (
                <div className="flex justify-center mt-4">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium mb-2">Preview</p>
                    <img
                      src={groupImage}
                      alt="Group Preview"
                      className="h-20 w-20 object-cover rounded-full border"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 py-4">
            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Selected Members ({selectedMembers.length})</Label>
                <ScrollArea className="h-20 w-full border rounded-md p-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-md"
                      >
                        <img
                          src={member.profilePic}
                          alt={member.name}
                          className="w-6 h-6 rounded-full border"
                        />
                        <span className="text-sm truncate max-w-[100px]">{member.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => removeMember(member.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Search Members */}
            <div className="grid gap-2">
              <Label htmlFor="search" className="text-sm font-medium">
                Add Members
              </Label>
              <Input
                id="search"
                placeholder="Search by name or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-base"
              />
            </div>

            {/* Search Results */}
            <ScrollArea className="max-h-52 border rounded-md p-2">
              {searchResults.length ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md transition cursor-pointer",
                      selectedMembers.find((m) => m.id === user.id)
                        ? "bg-emerald-100 dark:bg-emerald-900/40"
                        : "hover:bg-muted"
                    )}
                    onClick={() => toggleMember(user)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border"
                      />
                      <div className="truncate">
                        <p className="font-medium truncate max-w-[200px]">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {selectedMembers.find((m) => m.id === user.id) && (
                      <Check className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">No users found.</p>
              )}
            </ScrollArea>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div>
            {step === 2 && (
              <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step === 1 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={!groupName || isLoading}
                      onClick={handleNext}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </TooltipTrigger>
                  {!groupName && (
                    <TooltipContent>Enter a group name to continue</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ) : (
            
                    <div className="flex items-center gap-2" >
                    <StatefulButton disabled={selectedMembers.length===0?true:false}  onClick={handleCreateGroup} className={"cursor-pointer  bg-gradient-to-r from-emerald-600 p-[6px] px-3 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:bg-gradient-to-r  duration-200 text-white hover:ring-0 rounded-lg "}>Create Group</StatefulButton>
                    </div>
                 
            )}
            <DialogClose asChild>
              <Button variant="outline" ref={CloseButtonRef} disabled={isLoading}>Cancel</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}