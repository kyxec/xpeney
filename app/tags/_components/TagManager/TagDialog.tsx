"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ColorInput } from '@/components/ui/color-input';
import { getTagColorStyle, getContrastTextColor } from '@/lib/tag-color-utils';
import { toast } from 'sonner';
import type { Id } from '@/convex/_generated/dataModel';

interface Tag {
    _id: Id<"tags">;
    name: string;
    description?: string;
    color?: string;
}

interface TagDialogProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    tagId?: string | null;
    onClose: () => void;
    tags: Tag[];
}

interface TagFormData {
    name: string;
    description: string;
    color: string;
}

const PRESET_COLORS = [
    '#6b7280', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
    '#ec4899', '#f43f5e', '#84cc16', '#10b981',
    '#14b8a6', '#f59e0b', '#8b5a2b', '#6366f1'
];

export default function TagDialog({ isOpen, mode, tagId, onClose, tags }: TagDialogProps) {
    const createTag = useMutation(api.tags.create);
    const updateTag = useMutation(api.tags.update);

    const existingTag = tags?.find(tag => tag._id === tagId);

    const form = useForm<TagFormData>({
        defaultValues: {
            name: '',
            description: '',
            color: PRESET_COLORS[0],
        },
    });

    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;
    const watchedColor = watch('color');
    const watchedName = watch('name');

    // Reset form when dialog opens/closes or mode changes
    useEffect(() => {
        if (isOpen && mode === 'create') {
            reset({
                name: '',
                description: '',
                color: PRESET_COLORS[0],
            });
        } else if (isOpen && mode === 'edit' && existingTag) {
            reset({
                name: existingTag.name,
                description: existingTag.description || '',
                color: existingTag.color || PRESET_COLORS[0],
            });
        }
    }, [isOpen, mode, existingTag, reset]);

    const onSubmit = async (data: TagFormData) => {
        try {
            if (mode === 'create') {
                await createTag({
                    name: data.name.trim(),
                    description: data.description.trim() || undefined,
                    color: data.color,
                });
                toast.success('Tag created successfully');
            } else if (mode === 'edit' && tagId) {
                await updateTag({
                    id: tagId as Id<"tags">,
                    name: data.name.trim(),
                    description: data.description.trim() || undefined,
                    color: data.color,
                });
                toast.success('Tag updated successfully');
            }
            onClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                        {mode === 'create' ? 'Create New Tag' : 'Edit Tag'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    {/* Tag Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Tag Name</Label>
                        <Input
                            id="name"
                            {...register('name', {
                                required: 'Tag name is required',
                                minLength: {
                                    value: 1,
                                    message: 'Tag name must be at least 1 character'
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'Tag name must be less than 50 characters'
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9\s\-_]+$/,
                                    message: 'Tag name can only contain letters, numbers, spaces, hyphens, and underscores'
                                }
                            })}
                            placeholder="Enter tag name..."
                            className={`h-11 ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">Description (optional)</Label>
                        <Textarea
                            id="description"
                            {...register('description', {
                                maxLength: {
                                    value: 200,
                                    message: 'Description must be less than 200 characters'
                                }
                            })}
                            placeholder="Describe what this tag is for..."
                            rows={3}
                            className={`resize-none ${errors.description ? 'border-red-500' : ''}`}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Color & Style</Label>
                        <ColorInput
                            value={watchedColor}
                            onChange={(color) => setValue('color', color)}
                            presetColors={PRESET_COLORS}
                        />
                        {/* Preview */}
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                            <span className="text-sm text-muted-foreground">Preview:</span>
                            <Badge
                                style={{
                                    ...getTagColorStyle(watchedColor),
                                    color: getContrastTextColor(watchedColor),
                                    border: 'none'
                                }}
                                className="border-0 text-sm px-3 py-1 shadow-sm"
                            >
                                {watchedName || 'Tag Name'}
                            </Badge>
                        </div>
                    </div>

                    {/* Privacy removed */}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-11"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 h-11"
                        >
                            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Tag' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}