import "./PrimaryButton.css";

type PrimaryButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit";
};

export function PrimaryButton({ children, type = "button" }: PrimaryButtonProps) {
    return (
    <button className="primary-button" type={type}>
        {children}
    </button>
    );
}