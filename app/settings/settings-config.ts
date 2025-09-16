// Settings tab configuration and validation utilities

export const SETTINGS_TABS = {
    ACCOUNT: 'account',
    APPEARANCE: 'appearance',
} as const;

export type SettingsTab = typeof SETTINGS_TABS[keyof typeof SETTINGS_TABS];

export const VALID_TABS: SettingsTab[] = Object.values(SETTINGS_TABS);

export const DEFAULT_TAB: SettingsTab = SETTINGS_TABS.ACCOUNT;

/**
 * Validates and sanitizes a tab parameter
 * @param tab - The tab string to validate
 * @returns A valid tab or the default tab if invalid
 */
export function validateTab(tab?: string): SettingsTab {
    return VALID_TABS.includes(tab as SettingsTab) ? (tab as SettingsTab) : DEFAULT_TAB;
}
