import { useSelector } from 'react-redux'
import type { CardType } from "../types";
import { RootState } from '../redux/store';
import Loader from './Loader';

export default function PlayerPile({ cards, handValue, player }: { cards: CardType[], handValue: number, player: string }) {
    const drawLoading = useSelector((slice: RootState) => slice.blackjack.drawLoading)

    return (
        <>
            <div className="text-white flex flex-col gap-2">

                <div>
                    <p className="font-medium text-xl ">{player.charAt(0).toUpperCase() + player.slice(1)} hand value: {handValue}</p>
                </div>
                <div className="grid grid-flow-col justify-start h-36 backdrop-blur-lg shadow-inner border border-white/10 items-center p-4 rounded-xl">
                    {
                        cards.length > 0 && cards.map((card: CardType, index: number) => {
                            return <img className="max-h-28" key={index} src={card.image} />
                        })
                    }

                    {
                        player === drawLoading.player && drawLoading.cardCount > 0 &&
                        Array.from({ length: drawLoading.cardCount }, (_, index) => (
                            <Loader className="loader" key={index} />
                        ))
                    }

                </div>
            </div>
        </>
    )
}