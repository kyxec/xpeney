import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Calendar, MessageSquare } from 'lucide-react';
import type { FunctionReturnType } from 'convex/server';
import type { api } from '@/convex/_generated/api';
import { formatDate, formatExpiryDate } from '@/lib/date-utils';
import { getUserInitials } from '@/lib/user-utils';

type Invitation = FunctionReturnType<typeof api.invitations.listPendingInvitations>[0];

interface InvitationCardProps {
    invitation: Invitation;
    onAccept: () => void;
    onDecline: () => void;
}

export default function InvitationCard({ invitation, onAccept, onDecline }: InvitationCardProps) {
    return (
        <Card className="transition-colors hover:bg-muted/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: invitation.tag.color || '#6b7280' }}
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base truncate">{invitation.tag.name}</h3>
                            {invitation.tag.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {invitation.tag.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <Badge variant={invitation.permission === 'editor' ? 'default' : 'secondary'}>
                        {invitation.permission}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0 pb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={invitation.invitedBy.image} />
                            <AvatarFallback className="text-xs">
                                {getUserInitials(invitation.invitedBy.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span>Invited by {invitation.invitedBy.name || invitation.invitedBy.email}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(invitation.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>{formatExpiryDate(invitation.expiresAt)}</span>
                    </div>
                </div>

                {invitation.message && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-md">
                        <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{invitation.message}</p>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 gap-2">
                <Button onClick={onAccept} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                </Button>
                <Button onClick={onDecline} variant="outline" className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Decline
                </Button>
            </CardFooter>
        </Card>
    );
}