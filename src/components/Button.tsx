type ButtonProps = {
    children: string;
    onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
    return (
        <>
            <button onClick={onClick} className="h-10 w-14 rounded-md bg-green-50">{children}</button>
        </>
    )
}   