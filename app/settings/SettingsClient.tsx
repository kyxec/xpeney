"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SettingsHeader from "./_components/SettingsHeader";
import SettingsTabs from "./_components/SettingsTabs";
import ProfileSection from "./_components/SettingsTabs/Account/ProfileSection";
import AccountInfoSection from "./_components/SettingsTabs/Account/AccountInfoSection";
import ThemeSelector from "./_components/SettingsTabs/Appearance/ThemeSelector";

interface SettingsClientProps {
    preloadedUser: Preloaded<typeof api.auth.getMe>;
    initialTab: string;
}

export default function SettingsClient({ preloadedUser, initialTab }: SettingsClientProps) {
    const user = usePreloadedQuery(preloadedUser);
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState(initialTab);

    const handleTabChange = (value: string) => {
        setCurrentTab(value);
        router.push(`/settings?tab=${value}`, { scroll: false });
    };

    if (!user) {
        redirect("/");
    }

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-4xl">
            <SettingsHeader />

            <SettingsTabs
                currentTab={currentTab}
                onTabChange={handleTabChange}
                accountContent={
                    <div className="space-y-6">
                        <ProfileSection user={user} />
                        <AccountInfoSection user={user} />
                    </div>
                }
                appearanceContent={<ThemeSelector />}
            />
        </div>
    );
}