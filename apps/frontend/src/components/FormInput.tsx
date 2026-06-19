import type { InputHTMLAttributes } from "react";
import "./FormInput.css";

type FormInputProps = {
    label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormInput({ label, id, name, ...inputProps }: FormInputProps) {
    const inputId = id ?? name;

    return (
    <label className="form-input">
        <span>{label}</span>
        <input id={inputId} name={name} {...inputProps} />
    </label>
    );
}