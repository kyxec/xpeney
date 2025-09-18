import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
    icon,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn("text-center py-12", className)}>
            {icon && (
                <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction} className="font-medium">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}