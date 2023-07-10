type ButtonProps = {
    children: string;
    disabled?: boolean;
    onClick?: () => void;
};

export default function Button({ children, disabled, onClick }: ButtonProps) {
    return (
        <>
            <button onClick={onClick} disabled={disabled} className="glassButton h-10 w-28 rounded-lg">{children}</button>
        </>
    )
}   