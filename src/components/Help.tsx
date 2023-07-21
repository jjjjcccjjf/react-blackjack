import '@fontsource/pt-serif';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { useRef, useEffect } from 'react';
import { setIsTutorialVisible } from '../redux/slices/blackjackSlice';
import Button from './Button';

export default function Help() {

    const isTutorialVisible = useSelector((state: RootState) => state.blackjack.isTutorialVisible)
    const bannerRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (bannerRef.current) {
            const currentBannerRef = bannerRef.current; // Capture the ref value
            if (isTutorialVisible) {
                currentBannerRef.classList.remove('hidden')
            } else {
                currentBannerRef.classList.add('hidden')
            }
        }
    }, [isTutorialVisible]);

    const handleGotItClick = () => {
        dispatch(setIsTutorialVisible(false))
        localStorage.setItem('dontShowOnStartup', 'true')
    }

    return (
        <>
            <div className="absolute top-0 h-full w-full flex justify-center items-center transition-opacity duration-300 backdrop-blur-3xl " ref={bannerRef}>
                <div className="w-5/6 h-5/6 tall:h-4/6 taller:h-3/5 flex flex-col items-center justify-center border-y border-y-white/50 backdrop-blur-3xl bg-[#12192c]/95 gap-2">
                    <p className="text-center  text-3xl font-[PT-Serif] tracking-widest border-b border-b-white/40 pb-2 text-white/70">
                        Don't exceed 21!
                    </p>
                    <p className="text-2xl ">
                        How to play
                    </p>
                    <ul className="px-8 flex flex-col gap-2 list-disc">
                        <li>
                            Defeat the dealer by having a hand value of exactly 21 or having a higher hand value than the dealer.
                        </li>
                        <li>
                            If a player exceeds the hand value of 21, their hand is considered BUSTED. A BUSTED hand always loses.
                        </li>
                        <li>
                            If all players are BUSTED, the one who has a hand value closest to 21 wins.
                        </li>
                    </ul>
                    <Button onClick={handleGotItClick}>GOT IT</Button>
                </div>
            </div>
        </>
    )
}