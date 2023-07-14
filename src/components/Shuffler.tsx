import Loader from "./Loader";


export default function Shuffler() {
    return (
        <>
            <div className="relative h-28 w-20">
                <Loader className="absolute left-1/2 transform -translate-x-1/2 shuffler" />
                <Loader className="absolute" />
                <Loader className="absolute left-1/2 transform -translate-x-1/2 reverseShuffler" />
            </div>
        </>
    )
}