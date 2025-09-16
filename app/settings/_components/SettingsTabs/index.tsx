"use client";

import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Palette } from "lucide-react";
import { SETTINGS_TABS } from "../../settings-config";

interface SettingsTabsProps {
    currentTab: string;
    onTabChange: (value: string) => void;
    accountContent: ReactNode;
    appearanceContent: ReactNode;
}

export default function SettingsTabs({
    currentTab,
    onTabChange,
    accountContent,
    appearanceContent
}: SettingsTabsProps) {
    return (
        <Tabs value={currentTab} onValueChange={onTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value={SETTINGS_TABS.ACCOUNT} className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Account</span>
                </TabsTrigger>
                <TabsTrigger value={SETTINGS_TABS.APPEARANCE} className="flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span>Appearance</span>
                </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value={SETTINGS_TABS.ACCOUNT} className="space-y-6">
                {accountContent}
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value={SETTINGS_TABS.APPEARANCE} className="space-y-6">
                {appearanceContent}
            </TabsContent>
        </Tabs>
    );
}