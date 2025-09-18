/**
 * Date utility functions for common date formatting and manipulation operations
 */

/**
 * Format a timestamp to a readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format a timestamp to a long-form readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatLongDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format a timestamp to include time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date and time string (e.g., "Jan 15, 2024 at 3:30 PM")
 */
export function formatDateTime(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Format expiry date relative to current time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Human-readable expiry string (e.g., "Expires in 3 days")
 */
export function formatExpiryDate(timestamp: number): string {
    const now = Date.now();
    const diffDays = Math.ceil((timestamp - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
        return 'Expires today';
    } else if (diffDays === 1) {
        return 'Expires tomorrow';
    } else if (diffDays > 0) {
        return `Expires in ${diffDays} days`;
    } else {
        return 'Expired';
    }
}

/**
 * Format a timestamp to a relative time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string (e.g., "2 days ago", "Just now")
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
 * Check if a timestamp has passed (is in the past)
 * @param timestamp - Unix timestamp in milliseconds
 * @returns True if the timestamp is in the past
 */
export function isExpired(timestamp: number): boolean {
    return timestamp < Date.now();
}

/**
 * Check if a timestamp is within a certain number of days
 * @param timestamp - Unix timestamp in milliseconds
 * @param days - Number of days to check
 * @returns True if the timestamp is within the specified days
 */
export function isWithinDays(timestamp: number, days: number): boolean {
    const now = Date.now();
    const diffDays = Math.abs(timestamp - now) / (1000 * 60 * 60 * 24);
    return diffDays <= days;
}

/**
 * Get the number of days between two timestamps
 * @param timestamp1 - First timestamp in milliseconds
 * @param timestamp2 - Second timestamp in milliseconds
 * @returns Number of days between the timestamps (can be negative)
 */
export function getDaysDifference(timestamp1: number, timestamp2: number): number {
    return Math.ceil((timestamp2 - timestamp1) / (1000 * 60 * 60 * 24));
}

/**
 * Get the start of day for a given timestamp
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Timestamp for the start of the day (00:00:00)
 */
export function getStartOfDay(timestamp: number): number {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
}

/**
 * Get the end of day for a given timestamp
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Timestamp for the end of the day (23:59:59.999)
 */
export function getEndOfDay(timestamp: number): number {
    const date = new Date(timestamp);
    date.setHours(23, 59, 59, 999);
    return date.getTime();
}