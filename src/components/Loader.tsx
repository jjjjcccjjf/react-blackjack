type LoaderProp = {
    className?: string
}

export default function Loader({ className }: LoaderProp) {
    return (
        <>
            <div className={className}>
                <img src="https://deckofcardsapi.com/static/img/back.png" className="tall:max-h-28 max-h-20" alt="Loader" />
            </div>
        </>
    )
}