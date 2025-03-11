import { ThemeConfig } from '../types';

export const defaultTheme: ThemeConfig = {
    colors: {
        primary: '#3B82F6',   // blue-500
        secondary: '#6B7280', // gray-500
        accent: '#10B981',    // emerald-500
        background: '#F9FAFB', // gray-50
        text: '#1F2937',      // gray-800
    },
    typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: {
            base: '1rem',
            sm: '0.875rem',
            lg: '1.125rem',
            xl: '1.25rem',
        },
    },
    spacing: {
        base: '1rem',
        sm: '0.5rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
    },
}; 