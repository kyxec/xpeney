import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import SettingsClient from "./SettingsClient";
import { validateTab } from "./settings-config";

interface SettingsPageProps {
    searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
    const params = await searchParams;
    const preloadedUser = await preloadQuery(api.auth.getMe);

    // Validate and sanitize the tab parameter
    const initialTab = validateTab(params.tab);

    return <SettingsClient preloadedUser={preloadedUser} initialTab={initialTab} />;
}

export const metadata = {
    title: "Settings",
    description: "Manage your account settings and preferences",
};