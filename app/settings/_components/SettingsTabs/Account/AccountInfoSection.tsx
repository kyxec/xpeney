import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/user-utils";
import { User, Mail, Calendar, Shield } from "lucide-react";

interface User {
    _id: string;
    name?: string;
    email?: string;
    _creationTime?: number;
}

interface AccountInfoSectionProps {
    user: User;
}

export default function AccountInfoSection({ user }: AccountInfoSectionProps) {
    return (
        <>
            <Separator />

            {/* Account Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">User ID</span>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">
                            {user._id.slice(-8)}
                        </Badge>
                    </div>

                    {user._creationTime && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Member since</span>
                            </div>
                            <span className="text-sm">
                                {formatDate(user._creationTime)}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Status</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Email</span>
                        </div>
                        <span className="text-sm truncate max-w-[150px]">
                            {user.email}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}