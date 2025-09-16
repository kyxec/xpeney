import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

export default function Logo() {
    return (
        <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity min-w-0 flex-shrink-0"
        >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm sm:text-base">
                {APP_CONFIG.logoLetter}
            </div>
            <span className="font-bold text-base sm:text-lg md:text-xl truncate max-w-[120px] sm:max-w-none">
                {APP_CONFIG.name}
            </span>
        </Link>
    );
}