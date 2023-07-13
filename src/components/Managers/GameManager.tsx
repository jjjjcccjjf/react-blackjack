import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../redux/store"
import { useEffect } from "react"
import { getRawHandValue, getCalculatedHandValue } from "../../helpers"

export default function GameManager() {
    const gameState = useSelector((state: RootState) => state.blackjack.gameState)
    const dealer = useSelector((state: RootState) => state.blackjack.players.dealer)
    const player = useSelector((state: RootState) => state.blackjack.players.player)

    const dispatch = useDispatch()
    // useEffect(() => {
    //     if (gameState === 'DEALER_TURN') {
    //         if (dealer.handValue < 17) { // || hasSoftHand(dealer.pile, dealer.handValue)
    //             setTimeout(() => handleDrawClick(1, "dealer"), 200) // check bug sa ALAS
    //         } else {
    //             dispatch(addToGameLogs('DEALER stands.'))
    //             dispatch(setGameState('CHECK_WINNERS'))

    //         }
    //     }
    // }, [dealer.handValue])

    return (<></>)
}