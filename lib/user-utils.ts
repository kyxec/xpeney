/**
 * User utility functions for common user-related operations
 */

/**
 * Generate user initials from name or email
 * @param name - User's full name
 * @param email - User's email address
 * @returns Two-character initials string or "U" as fallback
 */
export function getUserInitials(name?: string, email?: string): string {
    if (name) {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    if (email) {
        return email.slice(0, 2).toUpperCase();
    }

    return "U";
}

/**
 * Get user's display name with fallback
 * @param name - User's full name
 * @param email - User's email address
 * @returns Display name or "User" as fallback
 */
export function getUserDisplayName(name?: string, email?: string): string {
    if (name && name.trim()) {
        return name.trim();
    }

    if (email) {
        // Extract name part from email (before @)
        const emailName = email.split('@')[0];
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }

    return "User";
}

/**
 * Truncate user ID to show only last 8 characters
 * @param userId - Full user ID
 * @returns Truncated user ID
 */
export function getTruncatedUserId(userId: string): string {
    return userId.slice(-8);
}

/**
 * Get user's profile image URL with fallback
 * @param image - User's image URL
 * @param avatarUrl - User's avatar URL from storage
 * @returns Image URL or undefined if no image available
 */
export function getUserImage(image?: string, avatarUrl?: string | null): string | undefined {
    // Prioritize avatarUrl (uploaded image) over image (OAuth image)
    if (avatarUrl) {
        return avatarUrl;
    }

    if (image) {
        return image;
    }

    return undefined;
}