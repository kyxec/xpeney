import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

export default function Footer() {
    return (
        <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 py-6 sm:px-6 sm:py-8">
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs sm:text-sm">
                            {APP_CONFIG.logoLetter}
                        </div>
                        <span className="font-semibold text-sm sm:text-base">{APP_CONFIG.name}</span>
                    </div>

                    <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms
                        </Link>
                        <Link href="/support" className="hover:text-foreground transition-colors">
                            Support
                        </Link>
                    </div>

                    <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                        © {APP_CONFIG.year} {APP_CONFIG.name}
                    </div>
                </div>
            </div>
        </footer>
    );
}