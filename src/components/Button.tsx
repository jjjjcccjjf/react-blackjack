type ButtonProps = {
    children: string;
    disabled?: boolean;
    onClick?: () => void;
};

export default function Button({ children, disabled, onClick }: ButtonProps) {
    return (
        <>
            <button onClick={onClick} disabled={disabled} className="h-10 w-14 rounded-md bg-green-50">{children}</button>
        </>
    )
}   