import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"

export default function DealButton() {
    const playerPile = useSelector((state: RootState) => state.blackjack.player.pile)

    return (
        <>
            <button>Deal Hand</button>
        </>
    )
}