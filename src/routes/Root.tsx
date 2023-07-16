import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";
import { AiFillHome, AiFillQuestionCircle } from 'react-icons/ai'

import '@fontsource/roboto';
// import '@fontsource/pt_serif'
import Music from "../components/Music";

export default function Root() {

    const bestStreak = useSelector((state: RootState) => state.blackjack.bestStreak)
    const currentStreak = useSelector((state: RootState) => state.blackjack.currentStreak)
    return (
        <>
            <div className="container mx-auto max-w-sm h-screen flex items-center justify-center flex-col font-[Roboto] text-white">
                <div className="h-full  w-full bg-[url('/assets/bg.png')] bg-no-repeat bg-cover bg-center relative">
                    <Outlet />
                </div>
            </div>
        </>
    )
}