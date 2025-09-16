import { getUserDisplayName } from "@/lib/user-utils";

interface UserInfoProps {
    user: {
        name?: string;
        email?: string;
    };
}

export default function UserInfo({ user }: UserInfoProps) {
    return (
        <div className="hidden sm:flex flex-col items-end min-w-0 max-w-[80px] md:max-w-[120px] lg:max-w-[160px]">
            <span className="text-sm font-medium text-foreground truncate w-full text-right">
                {getUserDisplayName(user.name, user.email)}
            </span>
        </div>
    );
}