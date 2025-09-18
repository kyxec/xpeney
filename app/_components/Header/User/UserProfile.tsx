"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { getUserInitials, getTruncatedUserId, getUserImage } from "@/lib/user-utils";
import { formatDate } from "@/lib/date-utils";

export default function UserProfile({ preloadedUser }: { preloadedUser: Preloaded<typeof api.auth.getMe> }) {
    const user = usePreloadedQuery(preloadedUser);

    if (!user) {
        return null; // Don't show anything if not signed in
    }

    return (
        <Card className="w-full max-w-sm mx-auto">
            <CardHeader className="text-center pb-3">
                <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                        <AvatarImage src={getUserImage(user.image, user.avatarUrl)} alt={user.name || "User"} />
                        <AvatarFallback className="text-base sm:text-lg">
                            {getUserInitials(user.name, user.email)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg sm:text-xl">
                            {user.name || "User"}
                        </CardTitle>
                        <CardDescription className="flex items-center justify-center space-x-1 mt-1 text-xs sm:text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">{user.email}</span>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
                <Separator />

                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>User ID</span>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">
                            {getTruncatedUserId(user._id)}
                        </Badge>
                    </div>

                    {user._creationTime && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span>Member since</span>
                            </div>
                            <span className="text-xs sm:text-sm">
                                {formatDate(user._creationTime)}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>Status</span>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                            Active
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
