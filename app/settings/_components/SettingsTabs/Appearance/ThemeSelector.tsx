"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Moon, Sun } from "lucide-react";

export default function ThemeSelector() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const themeOptions = [
        {
            value: "light",
            label: "Light",
            description: "Clean and bright interface",
            icon: Sun
        },
        {
            value: "dark",
            label: "Dark",
            description: "Easy on the eyes in low light",
            icon: Moon
        },
        {
            value: "system",
            label: "System",
            description: "Follow your device settings",
            icon: Monitor
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Theme Preferences</CardTitle>
                <CardDescription>
                    Choose how the interface looks and feels
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4">
                    {themeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = mounted && theme === option.value;

                        return (
                            <div
                                key={option.value}
                                onClick={() => setTheme(option.value)}
                                className={`relative cursor-pointer rounded-lg border p-4 hover:bg-accent transition-colors ${isSelected ? 'border-primary bg-accent' : 'border-border'
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-medium leading-none">
                                            {option.label}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {option.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="text-primary">
                                            <svg
                                                className="h-4 w-4"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}