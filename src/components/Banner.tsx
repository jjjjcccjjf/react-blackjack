import '@fontsource/pt-serif';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { useRef, useEffect } from 'react';
import { setBanner } from '../redux/slices/blackjackSlice';

export default function Banner() {

    const banner = useSelector((state: RootState) => state.blackjack.banner)
    const bannerRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (banner.isVisible && bannerRef.current) {
            const currentBannerRef = bannerRef.current; // Capture the ref value

            currentBannerRef.classList.toggle('opacity-0');

            const timeout = setTimeout(() => {
                currentBannerRef.classList.toggle('opacity-0');
                dispatch(setBanner({ isVisible: false, text: '' }))
            }, 1500);

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [banner.isVisible]);

    return (
        <>
            <div className="absolute top-0 h-full w-full flex justify-center items-center pointer-events-none transition-opacity duration-300 opacity-0" ref={bannerRef}>
                <div className="w-3/4 h-20  flex items-center justify-center border-y border-y-white/50 backdrop-blur-3xl">
                    <p className="text-center font-[PT-Serif] text-2xl tracking-widest">
                        {banner.text}
                    </p>
                </div>
            </div>
        </>
    )
}