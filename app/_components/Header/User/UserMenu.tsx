"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { getUserInitials, getUserDisplayName, getUserImage } from "@/lib/user-utils";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

interface UserMenuProps {
    user: NonNullable<FunctionReturnType<typeof api.auth.getMe>>
}

export default function UserMenu({ user }: UserMenuProps) {
    const { signOut } = useAuthActions();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 flex-shrink-0 touch-manipulation">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                        <AvatarImage
                            src={getUserImage(user.image, user.avatarUrl)}
                            alt={getUserDisplayName(user.name, user.email)}
                        />
                        <AvatarFallback className="text-xs sm:text-sm">
                            {getUserInitials(user.name, user.email)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 sm:w-60" align="end" forceMount sideOffset={8}>
                <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {getUserDisplayName(user.name, user.email)}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer h-12 px-3 text-sm touch-manipulation">
                    <Link href="/profile">
                        <User className="mr-3 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer h-12 px-3 text-sm touch-manipulation">
                    <Link href="/settings">
                        <Settings className="mr-3 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer h-12 px-3 text-sm text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 touch-manipulation"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}