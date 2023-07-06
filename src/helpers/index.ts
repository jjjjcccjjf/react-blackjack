import { PileType, CardType, BustedType, WinnerState } from "../types";

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

const stringifyPile = (pile: CardType[]) => {
    const cardsString: string = pile.reduce((acc, curr: CardType) => {
        acc += curr.code + ","
        return acc
    }, "")

    const trimmedString = cardsString.replace(/,+$/, '');
    return trimmedString
}

const determineWinner = (playerHandValue: number, dealerHandValue: number): WinnerState => {
    if (playerHandValue > 21 && dealerHandValue > 21) { // if both busted
        return bustedCompare(playerHandValue, dealerHandValue)
    } else if (playerHandValue === 21 && dealerHandValue === 21) { // if both blackjack
        return "TIE"
    } else if (playerHandValue === 21 && dealerHandValue !== 21) { // if player only blackjack
        return "PLAYER_WIN"
    } else if (playerHandValue !== 21 && dealerHandValue === 21) { // if dealer blackjack
        return "DEALER_WIN"
    } else if (playerHandValue < 21 && dealerHandValue < 21) { // stand showdown
        return standCompare(playerHandValue, dealerHandValue)
    } else if (playerHandValue < 21 && dealerHandValue > 21) { // dealer bust
        return "PLAYER_WIN"
    } else if (playerHandValue > 21 && dealerHandValue < 21) { // player bust
        return "DEALER_WIN"
    } else {
        return "ERROR"
    }
}

const standCompare = (playerHandValue: number, dealerHandValue: number): WinnerState => {
    if (playerHandValue === dealerHandValue) {
        return "TIE"
    } else if (playerHandValue > dealerHandValue) {
        return "PLAYER_WIN"
    } else {
        return "DEALER_WIN"
    }
}

const bustedCompare = (playerHandValue: number, dealerHandValue: number): WinnerState => {
    const playerDiff = playerHandValue - 21
    const dealerDiff = dealerHandValue - 21

    if (playerDiff === dealerDiff) {
        return "TIE"
    } else if (playerDiff < dealerDiff) {
        return "PLAYER_WIN"
    } else {
        return "DEALER_WIN"
    }
}

const hasSoftHand = (pile: CardType[], handValue: number) => {
    return pile.some((card) => card.value === 'ACE') && handValue < 19
}

export { getRawHandValue, getCalculatedHandValue, checkBlackJack, stringifyPile, determineWinner, standCompare, bustedCompare, hasSoftHand }