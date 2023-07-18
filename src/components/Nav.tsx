import { Link } from "react-router-dom";
import { AiFillHome, AiFillQuestionCircle } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { RootState } from "../redux/store";
import Music from '../components/Music'

export default function Nav() {
    const currentStreak = useSelector((state: RootState) => state.blackjack.currentStreak)
    const bestStreak = useSelector((state: RootState) => state.blackjack.bestStreak)

    return (
        <>
            <div className="p-4 flex flex-row justify-between w-full glass backdrop-blur-lg text-lg tall:text-xl absolute top-0">
                <Link className="flex justify-center items-center text-white/70 text-2xl hover:text-white/50" to="/"> <AiFillHome /></Link>
                <p className="h-10 flex justify-center items-center">🏆 Best: {bestStreak}</p>
                <p className="h-10 flex justify-center items-center">🔥 Streak: {currentStreak}</p>

                <Music />
                <button className="flex justify-center items-center text-white/70 text-3xl hover:text-white/50"><AiFillQuestionCircle /></button>
            </div>
        </>
    )
}