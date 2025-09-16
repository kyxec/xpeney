"use client";

import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, LogIn, Sparkles } from "lucide-react";

const enabledProviders = ["github"];

const providerConfig = {
    github: {
        name: "GitHub",
        icon: Github,
        description: "Continue with your GitHub account"
    }
};

interface AuthSectionProps {
    preloadedUser: Preloaded<typeof api.auth.getMe>;
}

export default function AuthSection({ preloadedUser }: AuthSectionProps) {
    const { signIn } = useAuthActions();
    const user = usePreloadedQuery(preloadedUser);

    if (user) {
        // User is logged in, show welcome message
        return (
            <Card className="w-full max-w-sm mx-auto">
                <CardHeader className="text-center pb-3">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <CardTitle className="text-lg sm:text-xl">Welcome back!</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                        You&apos;re signed in as <Badge variant="secondary" className="text-xs">{user.name || user.email}</Badge>
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // User is not logged in, show sign in options
    return (
        <Card className="w-full max-w-sm mx-auto">
            <CardHeader className="text-center pb-3">
                <div className="flex items-center justify-center space-x-2 mb-1">
                    <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <CardTitle className="text-lg sm:text-xl">Get Started</CardTitle>
                </div>
                <CardDescription className="text-sm">
                    Sign in to access your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
                {enabledProviders.map((provider) => {
                    const config = providerConfig[provider as keyof typeof providerConfig];
                    const IconComponent = config.icon;

                    return (
                        <Button
                            key={provider}
                            onClick={() => void signIn(provider)}
                            variant="outline"
                            size="lg"
                            className="w-full justify-start space-x-3 h-11 sm:h-12 text-sm sm:text-base"
                        >
                            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span>{config.description}</span>
                        </Button>
                    );
                })}

                <div className="text-center text-xs sm:text-sm text-muted-foreground mt-3">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </div>
            </CardContent>
        </Card>
    );
}