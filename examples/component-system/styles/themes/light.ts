import { Theme } from '../utils/types';

export const lightTheme: Theme = {
    name: 'light',
    config: {
        colors: {
            primary: 'text-blue-600 bg-blue-600',
            secondary: 'text-gray-600 bg-gray-600',
            accent: 'text-purple-600 bg-purple-600',
            background: 'bg-white',
            text: 'text-gray-900',
            border: 'border-gray-200'
        },
        typography: {
            fontFamily: 'font-sans',
            fontSize: {
                base: 'text-base',
                sm: 'text-sm',
                lg: 'text-lg',
                xl: 'text-xl',
                '2xl': 'text-2xl',
                '3xl': 'text-3xl'
            },
            fontWeight: {
                normal: 'font-normal',
                medium: 'font-medium',
                bold: 'font-bold'
            }
        },
        spacing: {
            '0': '0',
            '1': '0.25rem',
            '2': '0.5rem',
            '3': '0.75rem',
            '4': '1rem',
            '6': '1.5rem',
            '8': '2rem',
            '12': '3rem',
            '16': '4rem'
        },
        borderRadius: {
            none: 'rounded-none',
            sm: 'rounded-sm',
            md: 'rounded-md',
            lg: 'rounded-lg',
            full: 'rounded-full'
        },
        shadows: {
            none: 'shadow-none',
            sm: 'shadow-sm',
            md: 'shadow',
            lg: 'shadow-lg'
        }
    },
    components: {
        // 布局组件
        section: {
            base: 'relative w-full',
            variants: {
                primary: 'bg-white',
                secondary: 'bg-gray-50',
                outline: 'border border-gray-200',
                ghost: 'bg-transparent'
            },
            sizes: {
                sm: 'py-8',
                md: 'py-12',
                lg: 'py-16',
                xl: 'py-24'
            },
            states: {
                default: '',
                hover: '',
                active: '',
                disabled: 'opacity-50',
                icon: '',
                title: '',
                content: '',
                quote: '',
                author: '',
                avatar: '',
                name: ''
            }
        },
        container: {
            base: 'mx-auto px-4',
            variants: {
                primary: 'max-w-7xl',
                secondary: 'max-w-6xl',
                outline: 'max-w-5xl',
                ghost: 'max-w-4xl'
            },
            sizes: {
                sm: 'max-w-3xl',
                md: 'max-w-4xl',
                lg: 'max-w-5xl',
                xl: 'max-w-6xl'
            },
            states: {
                default: '',
                hover: '',
                active: '',
                disabled: '',
                icon: '',
                title: '',
                content: '',
                quote: '',
                author: '',
                avatar: '',
                name: ''
            }
        },
        grid: {
            base: 'grid',
            variants: {
                primary: 'gap-6',
                secondary: 'gap-8',
                outline: 'gap-4',
                ghost: 'gap-2'
            },
            sizes: {
                sm: 'grid-cols-2',
                md: 'grid-cols-3',
                lg: 'grid-cols-4',
                xl: 'grid-cols-6'
            },
            states: {
                default: '',
                hover: '',
                active: '',
                disabled: '',
                icon: '',
                title: '',
                content: '',
                quote: '',
                author: '',
                avatar: '',
                name: ''
            }
        },
        flex: {
            base: 'flex',
            variants: {
                primary: 'gap-6',
                secondary: 'gap-8',
                outline: 'gap-4',
                ghost: 'gap-2'
            },
            sizes: {
                sm: 'space-x-2',
                md: 'space-x-4',
                lg: 'space-x-6',
                xl: 'space-x-8'
            },
            states: {
                default: '',
                hover: '',
                active: '',
                disabled: '',
                icon: '',
                title: '',
                content: '',
                quote: '',
                author: '',
                avatar: '',
                name: ''
            }
        },
        // 内容组件
        heading: {
            base: 'font-bold tracking-tight',
            variants: {
                primary: 'text-gray-900',
                secondary: 'text-gray-700',
                outline: 'text-gray-600',
                ghost: 'text-gray-500'
            },
            sizes: {
                sm: 'text-xl',
                md: 'text-2xl',
                lg: 'text-3xl',
                xl: 'text-4xl'
            },
            states: {
                default: '',
                hover: '',
                active: '',
                disabled: 'opacity-50',
                icon: '',
                title: '',
                content: '',
                quote: '',
                author: '',
                avatar: '',
                name: ''
            }
        },
        text: {
            base: 'leading-relaxed',
            variants: {
                primary: 'text-gray-900',
                secondary: 'text-gray-700',
                outline: 'text-gray-600',
                ghost: 'text-gray-500'
            },
            sizes: {
                sm: 'text-sm',
                md: 'text-base',
                lg: 'text-lg',
                xl: 'text-xl'
            },
            states: {
                default: '',
                hover: '',
                active: '',
                disabled: 'opacity-50',
                icon: '',
                title: '',
                content: '',
                quote: '',
                author: '',
                avatar: '',
                name: ''
            }
        },
        button: {
            base: 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
            variants: {
                primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
                secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
                outline: 'border-2 border-current hover:bg-gray-100 focus:ring-current',
                ghost: 'hover:bg-gray-100 focus:ring-gray-500'
            },
            sizes: {
                sm: 'px-3 py-1.5 text-sm',
                md: 'px-4 py-2 text-base',
                lg: 'px-6 py-3 text-lg',
                xl: 'px-8 py-4 text-xl'
            },
            states: {
                default: '',
                hover: '',
                active: 'transform scale-95',
                disabled: 'opacity-50 cursor-not-allowed',
                icon: '',
                title: '',
                content: '',
                quote: '',
                author: '',
                avatar: '',
                name: ''
            }
        },
        card: {
            base: 'bg-white rounded-lg overflow-hidden',
            variants: {
                primary: 'shadow-lg',
                secondary: 'shadow',
                outline: 'border border-gray-200',
                ghost: ''
            },
            sizes: {
                sm: 'p-4',
                md: 'p-6',
                lg: 'p-8',
                xl: 'p-10'
            },
            states: {
                default: '',
                hover: 'hover:shadow-lg transition-shadow duration-200',
                active: '',
                disabled: 'opacity-50',
                icon: '',
                title: '',
                content: '',
                quote: '',
                author: '',
                avatar: '',
                name: ''
            }
        },
        feature: {
            base: 'relative p-6 rounded-xl overflow-hidden',
            variants: {
                primary: 'bg-white shadow-lg',
                secondary: 'bg-gray-50 shadow',
                outline: 'border border-gray-200',
                ghost: 'bg-transparent'
            },
            sizes: {
                sm: 'p-4',
                md: 'p-6',
                lg: 'p-8',
                xl: 'p-10'
            },
            states: {
                default: '',
                hover: 'hover:shadow-lg transition-shadow duration-200',
                active: '',
                disabled: 'opacity-50',
                icon: 'h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4',
                title: 'text-xl font-semibold text-gray-900 mb-2',
                content: 'text-gray-600',
                quote: '',
                author: '',
                avatar: '',
                name: ''
            }
        },
        testimonial: {
            base: 'relative rounded-2xl overflow-hidden',
            variants: {
                primary: 'bg-white shadow-lg',
                secondary: 'bg-gray-50 shadow',
                outline: 'border border-gray-200',
                ghost: 'bg-transparent'
            },
            sizes: {
                sm: 'p-4',
                md: 'p-6',
                lg: 'p-8',
                xl: 'p-10'
            },
            states: {
                default: '',
                hover: 'hover:shadow-lg transition-shadow duration-200',
                active: '',
                disabled: 'opacity-50',
                icon: '',
                title: 'text-sm text-gray-600',
                content: '',
                quote: 'text-gray-600 italic mb-4',
                author: 'flex items-center space-x-4',
                avatar: 'h-12 w-12 rounded-full object-cover',
                name: 'text-lg font-semibold text-gray-900'
            }
        }
    }
}; 