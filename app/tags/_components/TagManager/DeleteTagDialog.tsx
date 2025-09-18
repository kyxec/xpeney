"use client";

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';

interface Tag {
  _id: Id<"tags">;
  name: string;
  color?: string;
  shareCount?: number;
}

interface DeleteTagDialogProps {
  isOpen: boolean;
  tagId?: string | null;
  onClose: () => void;
  tags: Tag[];
}

export default function DeleteTagDialog({ isOpen, tagId, onClose, tags }: DeleteTagDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const deleteTag = useMutation(api.tags.remove);
  const currentTag = tags?.find(tag => tag._id === tagId);

  const handleDelete = async () => {
    if (!tagId) return;

    setIsLoading(true);
    try {
      await deleteTag({ id: tagId as Id<"tags"> });
      toast.success('Tag deleted successfully');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete tag');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentTag) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Tag
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete the tag{' '}
              <Badge
                style={{ backgroundColor: currentTag.color, color: 'white' }}
                className="border-0 mx-1"
              >
                {currentTag.name}
              </Badge>
              ? This action cannot be undone.
            </p>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">
                This will:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Remove the tag from all expenses</li>
                <li>Remove all sharing permissions</li>
                {currentTag.shareCount && currentTag.shareCount > 0 && (
                  <li className="text-amber-600">
                    Stop sharing with {currentTag.shareCount} user{currentTag.shareCount > 1 ? 's' : ''}
                  </li>
                )}
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Tag
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}