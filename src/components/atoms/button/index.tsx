import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "default"
  | "outline"
  | "ghost"
  | "destructive"
  | "secondary"
  | "link"
  | "gradient";

type Size = "small" | "medium" | "large";

const variantClasses: Record<Variant, string> = {
  default: "bg-[#004AC6] text-white",
  outline: "border border-primary text-primary",
  ghost: "text-gray-500",
  secondary: "bg-cyan-500 text-white hover:bg-cyan-600 transition-colors",
  destructive: "bg-red-500 text-white",
  gradient: "bg-gradient-to-bl from-purple-500 to-sky-500 text-white",
  link: "underline text-blue-500",
};

const sizeClasses: Record<Size, string> = {
  small: "text-xs px-3 py-1",
  medium: "text-sm px-4 py-2",
  large: "text-lg px-5 py-3",
};

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const Button = ({
  children,
  className,
  size = "medium",
  variant = "default",
  ...restProps
}: IButtonProps) => {
  return (
    <button
      {...restProps}
      className={`
        rounded-md
        cursor-pointer
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className} 
        `}
    >
      {children}
    </button>
  );
};

export default Button;
