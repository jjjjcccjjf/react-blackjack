type LoaderProp = {
    className?: string
}

export default function Loader({ className }: LoaderProp) {
    return (
        <>
            <div className={className}>
                <img src="https://deckofcardsapi.com/static/img/back.png" className="max-h-28" alt="Loader" />
            </div>
        </>
    )
}