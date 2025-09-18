"use client";

import { usePreloadedQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Preloaded } from 'convex/react';
import { EmptyState } from '@/components/ui/empty-state';
import PendingInvitationsHeader from '@/app/tags/pending-invitations/_components/PendingInvitationsManager/PendingInvitationsHeader';
import InvitationCard from '@/app/tags/pending-invitations/_components/PendingInvitationsManager/InvitationCard';
import { toast } from 'sonner';

interface PendingInvitationsManagerProps {
    preloadedInvitations: Preloaded<typeof api.invitations.listPendingInvitations>;
}

export default function PendingInvitationsManager({ preloadedInvitations }: PendingInvitationsManagerProps) {
    const invitations = usePreloadedQuery(preloadedInvitations);
    const acceptInvitation = useMutation(api.invitations.acceptInvitation);
    const declineInvitation = useMutation(api.invitations.declineInvitation);

    const handleAcceptInvitation = async (invitationId: string) => {
        try {
            await acceptInvitation({ invitationId: invitationId as any });
            toast.success('Invitation accepted successfully!');
        } catch (error) {
            console.error('Failed to accept invitation:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to accept invitation');
        }
    };

    const handleDeclineInvitation = async (invitationId: string) => {
        try {
            await declineInvitation({ invitationId: invitationId as any });
            toast.success('Invitation declined');
        } catch (error) {
            console.error('Failed to decline invitation:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to decline invitation');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <PendingInvitationsHeader invitationsCount={invitations.length} />

            <div className="flex-1 p-4">
                {invitations.length > 0 ? (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {invitations.map((invitation) => (
                            <InvitationCard
                                key={invitation._id}
                                invitation={invitation}
                                onAccept={() => handleAcceptInvitation(invitation._id)}
                                onDecline={() => handleDeclineInvitation(invitation._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <EmptyState
                            title="No pending invitations"
                            description="You don't have any pending tag invitations at the moment. When someone shares a tag with you, it will appear here."
                        />
                    </div>
                )}
            </div>
        </div>
    );
}