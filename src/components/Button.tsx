import { ReactNode } from 'react'
import clsx from "clsx";

type ButtonProps = {
    children: ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
};

export default function Button({ children, disabled, className, onClick }: ButtonProps) {

    const classes = clsx("glassButton h-12 w-36 text-xl rounded-lg transition-transform hover:scale-[103%] flex flex-row justify-center items-center gap-2", className)
    return (
        <>
            <button onClick={onClick} disabled={disabled} className={classes}>{children}</button>
        </>
    )
}