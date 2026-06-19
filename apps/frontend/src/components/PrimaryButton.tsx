import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./PrimaryButton.css";

type PrimaryButtonProps = {
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ children, type = "button", ...buttonProps }: PrimaryButtonProps) {
    return (
    <button className="primary-button" type={type} {...buttonProps}>
        {children}
    </button>
    );
}