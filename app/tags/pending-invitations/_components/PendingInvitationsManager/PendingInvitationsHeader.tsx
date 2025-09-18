import { Button } from '@/components/ui/button';
import { ArrowLeft, Inbox } from 'lucide-react';
import Link from 'next/link';

interface PendingInvitationsHeaderProps {
    invitationsCount: number;
}

export default function PendingInvitationsHeader({ invitationsCount }: PendingInvitationsHeaderProps) {
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/tags">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Tags
                        </Link>
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    <div className="flex items-center gap-2">
                        <Inbox className="h-5 w-5 text-muted-foreground" />
                        <h1 className="text-lg font-semibold">Pending Invitations</h1>
                        {invitationsCount > 0 && (
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {invitationsCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}