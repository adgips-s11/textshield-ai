import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return(
            <button ref={ref} className={clsx('inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all', 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-bg', 'disabled:opacity-50 disabled:cursor-not-allowed', {'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700': variant === 'primary', 'bg-dark-card text-white hover:bg-dark-border': variant === 'secondary', 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500/10': variant === 'outline', 'px-3 py-1.5 text-sm': size === 'sm', 'px-4 py-2 text-base': size === 'md', 'px-6 py-3 text-lg': size === 'lg'}, className)} disabled={disabled || isLoading} {... props}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
)

Button.displayName = 'Button';