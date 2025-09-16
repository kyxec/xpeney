"use client";

import { Button } from "@/components/ui/button";
import UserInfo from "./UserInfo";
import UserMenu from "./UserMenu";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

interface UserSectionProps {
    user: FunctionReturnType<typeof api.auth.getMe>
}

export default function UserSection({ user }: UserSectionProps) {
    if (!user) {
        return (
            <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 sm:px-4 text-sm font-medium"
            >
                Sign In
            </Button>
        );
    }

    return (
        <div className="flex items-center space-x-1 sm:space-x-3 min-w-0">
            <UserInfo user={user} />
            <UserMenu user={user} />
        </div>
    );
}