import "./FormInput.css";

type FormInputProps = {
    label: string;
    type: string;
    name: string;
};

export function FormInput({ label, type, name }: FormInputProps) {
    return (
    <label className="form-input">
        <span>{label}</span>
        <input type={type} name={name} />
    </label>
    );
}