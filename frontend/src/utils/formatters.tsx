// Utility functions for formatting data

/**
 * Format a date to Vietnamese locale string
 */
export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return 'N/A';

    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(d);
    } catch {
        return 'N/A';
    }
};

/**
 * Format a date to short format (DD/MM/YYYY)
 */
export const formatDateShort = (
    date: string | Date | null | undefined,
): string => {
    if (!date) return 'N/A';

    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(d);
    } catch {
        return 'N/A';
    }
};

/**
 * Format currency to VND
 */
export const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return 'N/A';

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return 'N/A';

    return new Intl.NumberFormat('vi-VN').format(num);
};
