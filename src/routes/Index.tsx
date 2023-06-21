import Splash from "../components/Splash";
import { Link } from "react-router-dom";

export default function Index() {
    return (
        <>
            <div className="flex flex-col items-center justify-center gap-4 bg-slate-600 h-full ">
                <Splash></Splash>
                <Link className="text-4xl border-green-950 border-2 w-1/2 rounded-md text-center" to="game">Start</Link>
            </div>
        </>
    )
}