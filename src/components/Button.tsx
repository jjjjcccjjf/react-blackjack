export default function Button({ children }: { children: JSX.Element }) {
    return (
        <>
            <button className="h-10 w-14 rounded-md bg-green-50">{children}</button>
        </>
    )
}