"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import Logo from "./Logo";
import UserSection from "./User/UserSection";
import MainNavigation from "./MainNavigation";
import MobileNavigation from "./MobileNavigation";

interface HeaderProps {
    preloadedUser: Preloaded<typeof api.auth.getMe>;
}

export default function Header({ preloadedUser }: HeaderProps) {
    const user = usePreloadedQuery(preloadedUser);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
                <div className="flex items-center space-x-4">
                    <MobileNavigation />
                    <Logo />
                    <MainNavigation />
                </div>
                <UserSection user={user} />
            </div>
        </header>
    );
}