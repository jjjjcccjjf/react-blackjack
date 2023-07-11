import clsx from "clsx";

type ButtonProps = {
    children: string;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
};

export default function Button({ children, disabled, className, onClick }: ButtonProps) {

    const classes = clsx("glassButton h-12 w-36 text-xl rounded-lg", className)
    return (
        <>
            <button onClick={onClick} disabled={disabled} className={classes}>{children}</button>
        </>
    )
}   