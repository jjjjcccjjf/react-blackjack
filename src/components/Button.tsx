import { ReactNode } from 'react'
import clsx from "clsx";

type ButtonProps = {
    children: ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
};

export default function Button({ children, disabled, className, onClick }: ButtonProps) {
    // transition-transform hover:scale-[103%]
    const classes = clsx("glassButton h-12 w-36 text-xl rounded-lg  flex flex-row justify-center items-center gap-2", 
    disabled && 'cursor-not-allowed disabled', 
    className)


    return (
        <>
            <button onClick={onClick} disabled={disabled} className={classes}>{children}</button>
        </>
    )
}