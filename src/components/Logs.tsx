import { useState, useEffect, useRef } from 'react'
import type { RootState } from '../redux/store'
import { useSelector } from 'react-redux'
import { MdOutlineKeyboardDoubleArrowUp, MdOutlineKeyboardDoubleArrowDown } from 'react-icons/md'

export default function Logs() {


    const gameLogs = useSelector((state: RootState) => state.blackjack.gameLogs)
    const logs = useRef<HTMLDivElement>(null)
    const [expanded, setExpanded] = useState(false)

    const classesUnexpanded = "tall:block absolute bottom-0 shadow-inner w-full transition-transform tall:translate-y-0 translate-y-[156px]"
    const classesExpanded = "tall:block absolute bottom-0 shadow-inner w-full transition-transform tall:translate-y-0 translate-y-[0px]"

    const handleExpandClick = () => {
        setExpanded(prev => !prev)
    }

    useEffect(() => {
        if (logs.current) {
            logs.current.scrollTop = logs.current.scrollHeight;
        }
    }, [gameLogs])

    return (
        <>
            <div className={expanded ? classesExpanded : classesUnexpanded}>
                <div className="flex items-center justify-center w-full h-6 tall:hidden">
                    <div className="w-1/3 shadow-inner bg-[#12192c] text-center rounded-t-lg" onClick={handleExpandClick}>
                        <button className=" text-md text-white/75 animate-bounce select-none">
                            {expanded ? <MdOutlineKeyboardDoubleArrowDown className="translate-y-[0.4rem]" /> : <MdOutlineKeyboardDoubleArrowUp className="translate-y-[0.4rem]" />}
                        </button>
                    </div>
                </div>
                <div className="grid grid-flow-col bg-[#12192c]  p-2 grid-cols-6 items-center">
                    <div className="flex flex-col gap-1 justify-center items-center p-2 col-span-2">
                        <img src="dealer.png" className="h-24 w-24" />
                        <p className="text-white/50 flex justify-center items-center">Mr. Dealer</p>
                    </div>
                    <div className="overflow-y-scroll h-32 px-3 text-sm col-span-4 text-white/50 border-l-white/10 border-l" ref={logs}>
                        {gameLogs.map((item, index) => {
                            return <p key={index}>{item}</p>
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}