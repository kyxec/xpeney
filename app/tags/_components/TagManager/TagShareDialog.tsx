"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Share2, X, Users, Eye, Edit3 } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';

interface Tag {
    _id: Id<"tags">;
    name: string;
    color?: string;
}

interface TagShareDialogProps {
    isOpen: boolean;
    tagId?: string | null;
    onClose: () => void;
    tags: Tag[];
}

interface ShareFormData {
    email: string;
    permission: 'viewer' | 'editor';
}

export default function TagShareDialog({ isOpen, tagId, onClose, tags }: TagShareDialogProps) {
    const shareTag = useMutation(api.tags.share);
    const unshareTag = useMutation(api.tags.unshare);

    const shares = useQuery(
        api.tags.getShares,
        tagId ? { tagId: tagId as Id<"tags"> } : "skip"
    );

    const currentTag = tags?.find(tag => tag._id === tagId);

    const form = useForm<ShareFormData>({
        defaultValues: {
            email: '',
            permission: 'viewer',
        },
    });

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = form;

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (isOpen) {
            reset({
                email: '',
                permission: 'viewer',
            });
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: ShareFormData) => {
        if (!tagId) return;

        try {
            await shareTag({
                tagId: tagId as Id<"tags">,
                userEmail: data.email.trim(),
                permission: data.permission,
            });
            toast.success('Tag shared successfully');
            reset(); // Reset form after successful submission
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to share tag');
        }
    };

    const handleUnshare = async (userId: Id<"users">) => {
        if (!tagId) return;

        try {
            await unshareTag({
                tagId: tagId as Id<"tags">,
                userId,
            });
            toast.success('Tag unshared successfully');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to unshare tag');
        }
    };

    if (!currentTag) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Share2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <div className="truncate">Share Tag</div>
                            <div className="text-sm font-normal text-muted-foreground truncate">
                                &ldquo;{currentTag.name}&rdquo;
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    {/* Share Form */}
                    <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            Add new person
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Please enter a valid email address'
                                        }
                                    })}
                                    placeholder="user@example.com"
                                    className={`h-11 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-destructive"></div>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="permission" className="text-sm font-medium">Permission level</Label>
                                <RadioGroup
                                    value={watch('permission')}
                                    onValueChange={(value: 'viewer' | 'editor') => setValue('permission', value)}
                                    className="space-y-3"
                                >
                                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                                        <RadioGroupItem
                                            value="viewer"
                                            id="viewer"
                                            className="mt-1"
                                        />
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Label
                                                    htmlFor="viewer"
                                                    className="font-medium text-foreground cursor-pointer"
                                                >
                                                    Viewer
                                                </Label>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Can see and use the tag in their expenses
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                                        <RadioGroupItem
                                            value="editor"
                                            id="editor"
                                            className="mt-1"
                                        />
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                                <Edit3 className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Label
                                                    htmlFor="editor"
                                                    className="font-medium text-foreground cursor-pointer"
                                                >
                                                    Editor
                                                </Label>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Can see, use, and modify the tag
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 font-medium"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                        Sharing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Share2 className="h-4 w-4" />
                                        Share Tag
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Current Shares */}
                    {shares && shares.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Users className="h-4 w-4 text-primary" />
                                Shared with ({shares.length})
                            </div>

                            <div className="space-y-2">
                                {shares.map((share) => (
                                    <div key={share._id} className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors">
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                {share.user?.name?.[0]?.toUpperCase() || share.user?.email?.[0]?.toUpperCase() || '?'}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium text-foreground truncate">
                                                {share.user?.name || 'Unknown User'}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {share.user?.email}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={share.permission === 'editor' ? 'default' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {share.permission === 'editor' ? (
                                                    <div className="flex items-center gap-1">
                                                        <Edit3 className="h-3 w-3" />
                                                        Editor
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        Viewer
                                                    </div>
                                                )}
                                            </Badge>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleUnshare(share.sharedWithUserId)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remove access</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No shares message */}
                    {shares && shares.length === 0 && (
                        <div className="text-center py-8 px-4">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full">
                                <Users className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-sm font-medium text-foreground mb-2">Not shared yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                Share this tag with team members to collaborate on expense tracking.
                            </p>
                        </div>
                    )}

                    {/* Close button */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-11 font-medium"
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}