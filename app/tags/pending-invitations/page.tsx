import PendingInvitationsManager from './_components/PendingInvitationsManager';
import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';

export default async function PendingInvitationsPage() {
    // Preload the pending invitations query
    const preloadedInvitations = await preloadQuery(
        api.invitations.listPendingInvitations,
        {},
        { token: await convexAuthNextjsToken() }
    );

    return (
        <div className="min-h-screen bg-background">
            <PendingInvitationsManager preloadedInvitations={preloadedInvitations} />
        </div>
    );
}