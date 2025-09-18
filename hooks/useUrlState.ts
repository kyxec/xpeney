"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export interface UseUrlStateOptions {
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
}

export function useUrlState(options: UseUrlStateOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace = false, scroll = false, shallow = false } = options;

    // Get a search parameter value
    const getParam = (key: string): string | null => {
        return searchParams.get(key);
    };

    // Get a search parameter as boolean
    const getBooleanParam = (key: string, defaultValue = false): boolean => {
        const value = searchParams.get(key);
        if (value === null) return defaultValue;
        return value === 'true';
    };

    // Get all current search parameters as an object
    const getAllParams = (): Record<string, string> => {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    };

    // Set a single search parameter
    const setParam = (key: string, value: string | number | boolean | null | undefined, shallowOverride?: boolean) => {
        const url = new URL(window.location.href);

        if (value === null || value === undefined || value === '' || value === false) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, String(value));
        }

        const newUrl = url.pathname + url.search;
        const useShallow = shallowOverride !== undefined ? shallowOverride : shallow;

        if (useShallow) {
            // Use native window.history for shallow routing (no data reloading)
            if (replace) {
                window.history.replaceState(null, '', newUrl);
            } else {
                window.history.pushState(null, '', newUrl);
            }
        } else {
            // Use Next.js router (triggers data reloading)
            if (replace) {
                router.replace(newUrl, { scroll });
            } else {
                router.push(newUrl, { scroll });
            }
        }
    };

    // Set multiple search parameters at once
    const setParams = (updates: Record<string, string | number | boolean | null | undefined>, shallowOverride?: boolean) => {
        const url = new URL(window.location.href);

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || value === false) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, String(value));
            }
        });

        const newUrl = url.pathname + url.search;
        const useShallow = shallowOverride !== undefined ? shallowOverride : shallow;

        if (useShallow) {
            // Use native window.history for shallow routing (no data reloading)
            if (replace) {
                window.history.replaceState(null, '', newUrl);
            } else {
                window.history.pushState(null, '', newUrl);
            }
        } else {
            // Use Next.js router (triggers data reloading)
            if (replace) {
                router.replace(newUrl, { scroll });
            } else {
                router.push(newUrl, { scroll });
            }
        }
    };

    // Clear specific parameters
    const clearParams = (keys: string[], shallowOverride?: boolean) => {
        const url = new URL(window.location.href);
        keys.forEach(key => url.searchParams.delete(key));

        const newUrl = url.pathname + url.search;
        const useShallow = shallowOverride !== undefined ? shallowOverride : shallow;

        if (useShallow) {
            // Use native window.history for shallow routing (no data reloading)
            if (replace) {
                window.history.replaceState(null, '', newUrl);
            } else {
                window.history.pushState(null, '', newUrl);
            }
        } else {
            // Use Next.js router (triggers data reloading)
            if (replace) {
                router.replace(newUrl, { scroll });
            } else {
                router.push(newUrl, { scroll });
            }
        }
    };

    // Clear all parameters
    const clearAllParams = (shallowOverride?: boolean) => {
        const useShallow = shallowOverride !== undefined ? shallowOverride : shallow;

        if (useShallow) {
            // Use native window.history for shallow routing (no data reloading)
            if (replace) {
                window.history.replaceState(null, '', pathname);
            } else {
                window.history.pushState(null, '', pathname);
            }
        } else {
            // Use Next.js router (triggers data reloading)
            if (replace) {
                router.replace(pathname, { scroll });
            } else {
                router.push(pathname, { scroll });
            }
        }
    };

    // Check if any of the specified parameters have values
    const hasParams = (keys: string[]): boolean => {
        return keys.some(key => {
            const value = searchParams.get(key);
            return value !== null && value !== '' && value !== 'false';
        });
    };

    return {
        getParam,
        getBooleanParam,
        getAllParams,
        setParam,
        setParams,
        clearParams,
        clearAllParams,
        hasParams,
        searchParams,
    };
}