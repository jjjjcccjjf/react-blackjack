import { PileType, CardType, BustedType } from "../types";


const getRawHandValue = async (pile: CardType[]): Promise<string[]> => {
    const rawHandValues = pile.map(item => item.value);
    rawHandValues.sort((a, b) => {
        if (a === 'ACE') return 1; // Move 'ACE' to the end
        if (b === 'ACE') return -1; // Keep 'ACE' at the end
        return 0; // Maintain original order for other values
    });

    return rawHandValues;
};

const getCalculatedHandValue = async (cards: string[]): Promise<number> => {
    const value = cards.reduce((acc, curr) => {
        let numericalValue = 0;

        if (["JACK", "QUEEN", "KING"].includes(curr)) {
            numericalValue = 10;
        } else if (curr === "ACE") {
            if (acc + 11 > 21) {
                numericalValue = 1
            } else {
                numericalValue = 11;
            }
        } else {
            numericalValue = Number.parseInt(curr)
        }

        return acc += numericalValue
    }, 0)

    return value;
}

const checkBlackJack = async (value: number): Promise<BustedType> => {
    if (value === 21) {
        return "BLACKJACK"
    } else if (value > 21) {
        return "BUSTED"
    } else {
        return "SAFE"
    }
}


// const getHandValue = (cards: Array<CardType>): number => {
//     const handHasAce = haveAce(cards)
// }

// const countNormally = (cards: Array<CardType>): number => {
//     return cards.reduce((acc, current) => acc + Number.parseInt(current.value), 0)
// }

// const haveAce = (cards: Array<CardType>): boolean => {
//     return cards.some((card) => card.value === 'ACE');
// }

// const convertFaceCardsValue = (face: string, isAceBust: boolean = false): number => {
//     let value = 0;
//     switch (face) {
//         case "JACK":
//         case "KING":
//         case "QUEEN":
//             value = 10;
//             break;
//         case "ACE":
//             value = isAceBust ? 1 : 11;
//             break;
//         default:
//             throw new Error("Invalid face card");
//     }

//     return value;
// }


export { getRawHandValue, getCalculatedHandValue, checkBlackJack }