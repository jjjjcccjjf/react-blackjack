import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";
import '@fontsource/roboto';

export default function Root() {

    const bestStreak = useSelector((state: RootState) => state.blackjack.bestStreak)
    const currentStreak = useSelector((state: RootState) => state.blackjack.currentStreak)
    return (
        <>
            <div className="container mx-auto max-w-sm h-screen  flex items-center justify-center flex-col font-[Roboto]">
                <div className="pb-4 flex flex-row justify-between w-full">
                    <Link className="h-10 w-10 flex justify-center items-center bg-gray-300" to="/">Home</Link>
                    <p className="h-10 flex justify-center items-center">🏆 Best : {bestStreak}</p>
                    <p className="h-10 flex justify-center items-center">🔥 Streak: {currentStreak}</p>

                    <button className="rounded-full h-10 w-10 bg-gray-600">?</button>
                </div>
                <div className="h-full glass w-full">
                    <Outlet />
                </div>
            </div>
        </>
    )
}