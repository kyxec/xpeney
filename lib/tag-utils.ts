/**
 * Validation utilities for tag management
 */

export interface TagValidationError {
    field: string;
    message: string;
}

export interface TagFormData {
    name: string;
    description?: string;
    color?: string;
    isPrivate: boolean;
}

/**
 * Validates tag form data
 */
export function validateTagForm(data: Partial<TagFormData>, existingTags: { name: string }[] = []): TagValidationError[] {
    const errors: TagValidationError[] = [];

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
        errors.push({ field: 'name', message: 'Tag name is required' });
    } else if (data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Tag name must be at least 2 characters' });
    } else if (data.name.trim().length > 50) {
        errors.push({ field: 'name', message: 'Tag name must be less than 50 characters' });
    } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(data.name.trim())) {
        errors.push({ field: 'name', message: 'Tag name can only contain letters, numbers, spaces, hyphens, and underscores' });
    }

    // Check for duplicate names
    if (data.name && existingTags.some(tag => tag.name.toLowerCase() === data.name!.toLowerCase())) {
        errors.push({ field: 'name', message: 'A tag with this name already exists' });
    }

    // Description validation
    if (data.description && data.description.length > 200) {
        errors.push({ field: 'description', message: 'Description must be less than 200 characters' });
    }

    // Color validation
    if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
        errors.push({ field: 'color', message: 'Color must be a valid hex color (e.g., #FF0000)' });
    }

    return errors;
}

/**
 * Sanitizes tag input data
 */
export function sanitizeTagData(data: Partial<TagFormData>): Partial<TagFormData> {
    return {
        ...data,
        name: data.name?.trim(),
        description: data.description?.trim() || undefined,
        color: data.color || '#6b7280', // Default gray
        isPrivate: Boolean(data.isPrivate),
    };
}

/**
 * Validates email for tag sharing
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Common tag colors for the color picker
 */
export const TAG_COLORS = [
    { name: 'Gray', value: '#6b7280' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Lime', value: '#84cc16' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Sky', value: '#0ea5e9' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Fuchsia', value: '#d946ef' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Rose', value: '#f43f5e' },
] as const;

/**
 * Gets a random color from the predefined set
 */
export function getRandomTagColor(): string {
    return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)].value;
}