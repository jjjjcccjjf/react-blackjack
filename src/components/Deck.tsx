import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import Shuffler from './Shuffler'

export default function Deck() {

    const isDeckShuffling = useSelector((state: RootState) => state.blackjack.isDeckShuffling)

    return (
        <>
            <div className="flex justify-center items-center">
                {isDeckShuffling ? <Shuffler /> : <img src="https://deckofcardsapi.com/static/img/back.png" className="max-h-28" />}
            </div>
        </>
    )
}