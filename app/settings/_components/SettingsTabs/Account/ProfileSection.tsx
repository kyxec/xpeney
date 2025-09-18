"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Check, Image, X, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { getUserInitials, getUserImage } from "@/lib/user-utils";

interface ProfileFormData {
    name: string;
    email: string;
}

interface ProfileSectionProps {
    user: NonNullable<FunctionReturnType<typeof api.auth.getMe>>;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const imageInput = useRef<HTMLInputElement>(null);
    const updateMyProfile = useMutation(api.auth.updateMyProfile);
    const generateUploadUrl = useMutation(api.auth.generateUploadUrl);

    const form = useForm<ProfileFormData>({
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
        },
        mode: "onChange",
    });

    const { register, handleSubmit, formState: { errors, isDirty }, reset } = form;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= MAX_SIZE;

        if (!isValidType) {
            toast.error("Please select a valid image file");
            return;
        }

        if (!isValidSize) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setSelectedImage(file);
    };

    const getAvatarSrc = () =>
        selectedImage ? URL.createObjectURL(selectedImage) : getUserImage(user.image, user.avatarUrl);

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        try {
            let avatarUrlId;

            // Only upload image if a file was selected
            if (selectedImage) {
                try {
                    const postUrl = await generateUploadUrl();
                    const result = await fetch(postUrl, {
                        method: "POST",
                        headers: { "Content-Type": selectedImage.type },
                        body: selectedImage,
                    });

                    if (!result.ok) {
                        throw new Error(`Upload failed: ${result.statusText}`);
                    }

                    const { storageId } = await result.json();
                    avatarUrlId = storageId;
                } catch (uploadError) {
                    console.error("Image upload failed:", uploadError);
                    toast.error("Failed to upload image. Please try again.");
                    return;
                }
            }

            await updateMyProfile({
                name: data.name || undefined,
                email: data.email || undefined,
                avatarUrlId: avatarUrlId || undefined,
            });

            // Clear the selected image after successful upload
            setSelectedImage(null);

            reset(data);

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }; const handleCancel = () => {
        reset({
            name: user.name || "",
            email: user.email || "",
        });
        setSelectedImage(null);
        if (imageInput.current) {
            imageInput.current.value = "";
        }
    };

    const hasChanges = isDirty || selectedImage !== null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your account details and profile information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="relative cursor-pointer group"
                                            onClick={() => imageInput.current?.click()}
                                        >
                                            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-muted transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
                                                <AvatarImage
                                                    src={getAvatarSrc()}
                                                    alt={user.name}
                                                    className="object-cover transition-all duration-200 group-hover:brightness-75"
                                                />
                                                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white transition-all duration-200 group-hover:from-blue-600 group-hover:to-purple-700">
                                                    {getUserInitials(user.name, user.email)}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Edit Overlay */}
                                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                <Edit className="h-6 w-6 text-white" />
                                            </div>

                                            {/* New Image Indicator */}
                                            {selectedImage && (
                                                <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Click to change profile picture</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Hidden File Input */}
                            <input
                                ref={imageInput}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                aria-label="Upload profile picture"
                            />
                        </div>
                        <div className="space-y-3 flex-1">
                            <div>
                                <h3 className="text-xl font-semibold">{user.name || "User"}</h3>
                                <p className="text-sm text-muted-foreground">{user.email || "No email set"}</p>
                            </div>
                            {selectedImage && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                                        <div className="flex items-center space-x-2">
                                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                            <Image className="h-4 w-4 text-green-600" />
                                            <div className="text-sm">
                                                <p className="font-medium text-foreground">{selectedImage.name}</p>
                                                <p className="text-muted-foreground">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedImage(null);
                                                if (imageInput.current) imageInput.current.value = "";
                                            }}
                                            className="h-8 w-8 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <Input
                                    id="name"
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Name must be at least 2 characters"
                                        }
                                    })}
                                    placeholder="Enter your full name"
                                    className="transition-colors focus:ring-2 focus:ring-primary/20"
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    placeholder="Enter your email"
                                    className="transition-colors focus:ring-2 focus:ring-primary/20"
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                        <div className="text-sm text-muted-foreground">
                            {hasChanges ? (
                                <span className="flex items-center text-amber-600">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    You have unsaved changes
                                </span>
                            ) : (
                                "All changes saved"
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={!hasChanges || isLoading}
                                className="transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!hasChanges || isLoading}
                                className="transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}