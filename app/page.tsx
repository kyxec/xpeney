import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import UserProfile from "./_components/Header/User/UserProfile";
import AuthSection from "./_components/Main/AuthSection";
import { APP_CONFIG } from "@/lib/constants";

export default async function Home() {

  const preloadedUser = await preloadQuery(
    api.auth.getMe,
    {},
    { token: await convexAuthNextjsToken() }
  );

  return (
    <div className="bg-gradient-to-br from-background to-muted/20 flex flex-col min-h-full">
      <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center space-y-3 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              {APP_CONFIG.description}
            </p>
          </div>

          {/* Auth and Profile Section */}
          <div className="flex flex-col gap-6 sm:gap-8 items-center">
            <AuthSection preloadedUser={preloadedUser} />
            <UserProfile preloadedUser={preloadedUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
