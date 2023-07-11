import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";
import { AiFillHome, AiFillQuestionCircle } from 'react-icons/ai'

import '@fontsource/roboto';

export default function Root() {

    const bestStreak = useSelector((state: RootState) => state.blackjack.bestStreak)
    const currentStreak = useSelector((state: RootState) => state.blackjack.currentStreak)
    return (
        <>
            <div className="container mx-auto max-w-sm  h-screen flex items-center justify-center flex-col font-[Roboto] text-white">
                <div className="p-4 flex flex-row justify-between w-full glass backdrop-blur-lg text-xl">
                    <Link className="flex justify-center items-center text-white/70 text-2xl hover:text-white/50" to="/"> <AiFillHome /></Link>
                    <p className="h-10 flex justify-center items-center">🏆 Best : {bestStreak}</p>
                    <p className="h-10 flex justify-center items-center">🔥 Streak: {currentStreak}</p>

                    <button className="flex justify-center items-center text-white/70 text-3xl hover:text-white/50"><AiFillQuestionCircle /></button>
                </div>
                <div className="h-full glass w-full ">
                    <Outlet />
                </div>
            </div>
        </>
    )
}