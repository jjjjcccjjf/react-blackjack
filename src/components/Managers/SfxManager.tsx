import { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import hitSfx from '../../assets/hit.mp3'
import standSfx from '../../assets/stand.mp3'
import tieSfx from '../../assets/tie.mp3'
import bustSfx from '../../assets/bust.mp3'
import blackjackSfx from '../../assets/blackjack.mp3'
import playerBlackjackSfx from '../../assets/playerblackjack.mp3'
import dealerBlackjackSfx from '../../assets/dealerblackjack.mp3'
import dealerWinSfx from '../../assets/dealerwin.mp3'
import playerWinSfx from '../../assets/playerwin.mp3'

export default function SfxManager() {
    const lastEventSfx = useSelector((state: RootState) => state.blackjack.lastEventSfx)
    const [hitAudio] = useState(new Audio(hitSfx))
    const [standAudio] = useState(new Audio(standSfx))
    const [tieAudio] = useState(new Audio(tieSfx))
    const [bustAudio] = useState(new Audio(bustSfx))
    const [blackjackAudio] = useState(new Audio(blackjackSfx))
    const [playerBlackjackAudio] = useState(new Audio(playerBlackjackSfx))
    const [dealerBlackjackAudio] = useState(new Audio(dealerBlackjackSfx))
    const [playerWinAudio] = useState(new Audio(playerWinSfx))
    const [dealerWinAudio] = useState(new Audio(dealerWinSfx))

    useEffect(() => {
        if (lastEventSfx !== null) {
            switch (lastEventSfx) {
                case 'HIT': {
                    hitAudio.play()
                    break;
                }
                case 'STAND': {
                    standAudio.play()
                    break;
                }
                case 'BLACKJACK': {
                    blackjackAudio.play()
                    break;
                }
                case 'PLAYER_BLACKJACK': {
                    playerBlackjackAudio.play()
                    break;
                }
                case 'DEALER_BLACKJACK': {
                    dealerBlackjackAudio.play()
                    break;
                }
                case 'BUST': {
                    bustAudio.play()
                    break;
                }
                case 'TIE': {
                    tieAudio.play()
                    break;
                }
                case 'PLAYER_WIN': {
                    playerWinAudio.play()
                    break;
                }
                case 'DEALER_WIN': {
                    dealerWinAudio.play()
                    break;
                }
                case 'GAME_START':
                case 'WELCOME':
            }
        }
    }, [lastEventSfx])

    return (<></>);
}