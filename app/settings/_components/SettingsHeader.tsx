interface SettingsHeaderProps {
    title?: string;
    description?: string;
}

export default function SettingsHeader({
    title = "Settings",
    description = "Manage your account settings and preferences"
}: SettingsHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}