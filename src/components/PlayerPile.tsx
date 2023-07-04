import type { CardType } from "../types";

export default function PlayerPile({ cards, handValue }: { cards: CardType[], handValue: number }) {


    return (
        <>
            <div>
                <p>Total value: {handValue}</p>
            </div>
            <div className="grid grid-flow-col justify-start">
                {
                    cards.length > 0 ? cards.map((card: CardType, index: number) => {
                        return <img className="max-h-28" key={index} src={card.image} />
                    }) : "No cards yet"
                }
            </div>
        </>
    )
}