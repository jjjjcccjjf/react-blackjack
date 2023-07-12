import { useEffect, useState } from 'react';
import { BiSolidVolumeFull } from 'react-icons/bi';
import { BiSolidVolumeLow } from 'react-icons/bi';
import { BiSolidVolume } from 'react-icons/bi';
import bgmusic from '../assets/bgmusic.mp3';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setMusic } from '../redux/slices/blackjackSlice';

export default function Music() {
    const music = useSelector((slice: RootState) => slice.blackjack.music);
    const dispatch = useDispatch()

    const [bgmusicAudio] = useState(new Audio(bgmusic));

    useEffect(() => {
        bgmusicAudio.loop = true;
    }, []);

    useEffect(() => {
        if (music.isPlaying) {
            bgmusicAudio.play();
        }
    }, [music.isPlaying])

    useEffect(() => {
        bgmusicAudio.volume = music.volume
    }, [music.volume])

    const handleVolumeFullClick = () => {
        dispatch(setMusic({ isPlaying: true, volume: 1 }))
        console.log('trying to unmute');
    };

    const handleVolumeMuteClick = () => {
        dispatch(setMusic({ isPlaying: true, volume: 0 }))
        console.log('trying to mute');
    };

    return (
        <>
            {music.volume > 0 && <button onClick={handleVolumeMuteClick} className="flex justify-center items-center text-white/70 text-2xl hover:text-white/50"><BiSolidVolumeFull /></button>}
            {music.volume === 0 && <button onClick={handleVolumeFullClick} className="flex justify-center items-center text-white/70 text-2xl hover:text-white/50"><BiSolidVolume /></button>}
        </>
    );
}
