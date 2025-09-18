"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Share2, X, Users, Eye, Edit3, Info } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
            <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Share2 className="h-4 w-4 text-primary" />
                        Share “{currentTag.name}”
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Share Form (compact) */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div className="flex gap-2">
                            <div className="flex-1 min-w-0">
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Enter a valid email'
                                        }
                                    })}
                                    placeholder="user@example.com"
                                    className={`h-10 text-sm ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                />
                            </div>
                            <div className="shrink-0 flex items-center gap-1">
                                <TooltipProvider>
                                    <div className="inline-flex rounded-lg border bg-background p-0.5">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={watch('permission') === 'viewer' ? 'default' : 'ghost'}
                                                    aria-pressed={watch('permission') === 'viewer'}
                                                    className="h-9 px-2"
                                                    onClick={() => setValue('permission', 'viewer')}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="text-xs">Viewer: can view and use the tag</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={watch('permission') === 'editor' ? 'default' : 'ghost'}
                                                    aria-pressed={watch('permission') === 'editor'}
                                                    className="h-9 px-2"
                                                    onClick={() => setValue('permission', 'editor')}
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="text-xs">Editor: can view, use, and modify</TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-muted-foreground"
                                                aria-label="Permissions help"
                                            >
                                                <Info className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[220px] text-xs">
                                            Viewer: can view and use the tag.
                                            Editor: can view, use, and modify the tag.
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}

                        <Button type="submit" disabled={isSubmitting} className="w-full h-9 text-sm">
                            {isSubmitting ? 'Sharing…' : 'Share'}
                        </Button>
                    </form>

                    {/* Current Shares (compact list) */}
                    {shares && shares.length > 0 && (
                        <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">Shared with {shares.length}</div>
                            <div className="space-y-1">
                                {shares.map((share) => (
                                    <div key={share._id} className="flex items-center gap-2 p-2 border rounded-md">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-[10px]">
                                                {share.user?.name?.[0]?.toUpperCase() || share.user?.email?.[0]?.toUpperCase() || '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm truncate">{share.user?.name || 'Unknown User'}</div>
                                            <div className="text-xs text-muted-foreground truncate">{share.user?.email}</div>
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Badge variant={share.permission === 'editor' ? 'default' : 'secondary'} className="text-[10px] px-2 py-0 cursor-help">
                                                        {share.permission}
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent className="text-xs">
                                                    {share.permission === 'editor' ? 'Editor: can view, use, and modify' : 'Viewer: can view and use the tag'}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleUnshare(share.sharedWithUserId)}
                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No shares message (compact) */}
                    {shares && shares.length === 0 && (
                        <div className="text-center py-6">
                            <Users className="h-6 w-6 text-muted-foreground/60 mx-auto mb-2" />
                            <div className="text-sm font-medium">Not shared yet</div>
                            <div className="text-xs text-muted-foreground">Add people above to share.</div>
                        </div>
                    )}

                    <div className="pt-1">
                        <Button variant="outline" onClick={onClose} className="w-full h-9 text-sm">Done</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}