"use client";

import { Button } from '@/components/ui/button';
import { Plus, Inbox } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUrlState } from '@/hooks/useUrlState';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

interface TagsHeaderProps {
    onCreateTag: () => void;
    tagsCount: number;
}

export default function TagsHeader({ onCreateTag, tagsCount }: TagsHeaderProps) {
    const { getBooleanParam, setParam } = useUrlState({ scroll: false });
    // Default includeShared to true when not present
    const includeShared = getBooleanParam('includeShared', true);

    // Get pending invitations count
    const pendingInvitations = useQuery(api.invitations.listPendingInvitations) || [];
    const pendingCount = pendingInvitations.length;

    return (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="p-4">
                {/* Mobile-first header */}
                <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl md:text-3xl font-bold text-foreground truncate">
                            Tags
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="include-shared" className="text-xs sm:text-sm text-muted-foreground">Include shared</Label>
                            <Switch
                                id="include-shared"
                                checked={includeShared}
                                onCheckedChange={(v) => setParam('includeShared', v ? 'true' : 'false')}
                                aria-label="Include shared tags"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 font-medium shrink-0"
                            asChild
                        >
                            <Link href="/tags/pending-invitations" className="relative">
                                <Inbox className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Invitations</span>
                                {pendingCount > 0 && (
                                    <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                        {pendingCount}
                                    </div>
                                )}
                            </Link>
                        </Button>
                        <Button
                            onClick={onCreateTag}
                            size="sm"
                            className="h-9 px-3 font-medium shrink-0"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Create</span>
                        </Button>
                    </div>
                </div>

                {/* Description and count */}
                <div className="space-y-1">
                    <p className="text-sm md:text-base text-muted-foreground">
                        {tagsCount === 0
                            ? 'Organize your expenses with tags and share them with others'
                            : `${tagsCount} tag${tagsCount === 1 ? '' : 's'} • Organize your expenses and share with others`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}