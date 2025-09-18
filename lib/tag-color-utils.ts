/**
 * Utility functions for handling colors and gradients in tag components
 */

/**
 * Checks if a color string is a gradient
 */
export function isGradient(color: string): boolean {
    return color.startsWith('linear-gradient') || color.startsWith('radial-gradient');
}

/**
 * Extracts the first color from a gradient for fallback purposes
 */
export function extractFirstColorFromGradient(gradient: string): string {
    const colorMatch = gradient.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/);
    return colorMatch ? colorMatch[0] : '#6b7280';
}

/**
 * Gets the appropriate style object for a tag color (solid color or gradient)
 */
export function getTagColorStyle(color?: string): React.CSSProperties {
    if (!color) {
        return { backgroundColor: 'hsl(var(--muted))' };
    }

    if (isGradient(color)) {
        return { background: color };
    }

    return { backgroundColor: color };
}

/**
 * Gets a contrasting text color for a given background color
 * For gradients, defaults to white for better readability
 */
export function getContrastTextColor(color?: string): string {
    if (!color || isGradient(color)) {
        return 'white';
    }

    // Simple contrast calculation for hex colors
    if (color.startsWith('#')) {
        const hex = color.substring(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? 'black' : 'white';
    }

    return 'white';
}

/**
 * Creates a more vibrant version of a color for hover effects
 */
export function getHoverColorStyle(color?: string): React.CSSProperties {
    if (!color) {
        return { backgroundColor: 'hsl(var(--muted-foreground))' };
    }

    if (isGradient(color)) {
        return {
            background: color,
            filter: 'brightness(1.1) saturate(1.1)'
        };
    }

    return {
        backgroundColor: color,
        filter: 'brightness(0.9)'
    };
}