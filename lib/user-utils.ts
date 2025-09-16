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
 * Format a timestamp to a readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format a timestamp to a relative time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string (e.g., "2 days ago")
 */
export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    if (diff < minute) {
        return 'Just now';
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diff < week) {
        const days = Math.floor(diff / day);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (diff < month) {
        const weeks = Math.floor(diff / week);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diff < year) {
        const months = Math.floor(diff / month);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.floor(diff / year);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
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