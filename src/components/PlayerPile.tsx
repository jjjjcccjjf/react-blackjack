import type { CardType } from "../types";

export default function PlayerPile({ cards, handValue }: { cards: CardType[], handValue: number }) {


    return (
        <>
            <div className="text-white flex flex-col gap-2">

                <div>
                    <p className="font-medium text-xl ">Your hand value: {handValue}</p>
                </div>
                <div className="grid grid-flow-col justify-start h-36 backdrop-blur-lg shadow-inner items-center p-4 rounded-xl">
                    {
                        cards.length > 0 ? cards.map((card: CardType, index: number) => {
                            return <img className="max-h-28" key={index} src={card.image} />
                        }) : <p className="flex justify-center w-full text-[#9ca3af]">No cards yet</p>
                    }
                </div>
            </div>
        </>
    )
}