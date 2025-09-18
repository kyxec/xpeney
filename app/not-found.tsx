import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/lib/constants";
import { Ghost } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
            <div className="mx-auto w-full max-w-xl text-center">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                    <Ghost className="size-8" aria-hidden />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Error 404</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    Page not found
                </h1>
                <p className="mt-3 text-muted-foreground">
                    Sorry, we couldn’t find the page you’re looking for. Explore
                    {" "}
                    <span className="font-medium text-foreground">{APP_CONFIG.name}</span>
                    {" "}
                    using the options below.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button asChild>
                        <Link href="/">Go to Home</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Open Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
