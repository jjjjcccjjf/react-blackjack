import { useEffect, useRef } from 'react'
import type { RootState } from '../redux/store'
import { useSelector } from 'react-redux'

export default function Logs() {


    const gameLogs = useSelector((state: RootState) => state.blackjack.gameLogs)
    const logs = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (logs.current) {
            logs.current.scrollTop = logs.current.scrollHeight;
        }
    }, [gameLogs])

    return (
        <>
            <div className="grid grid-flow-col backdrop-blur-lg absolute bottom-0 p-2 shadow-inner w-full grid-cols-6 items-center">
                <div className="flex flex-col gap-1 justify-center items-center p-2 col-span-2">
                    <img src="dealer.png" className="h-24 min-w-fit" />
                    <p className="text-white/50 flex justify-center items-center">Mr. Dealer</p>
                </div>
                <div className="overflow-y-scroll h-32 px-3 text-sm col-span-4 text-white/50 border-l-white/10 border-l" ref={logs}>
                    {gameLogs.map((item, index) => {
                        return <p key={index}>{item}</p>
                    })}
                </div>
            </div>
        </>
    )
}