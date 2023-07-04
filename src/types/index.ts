export type PileType = {
    cards: Array<CardType>,
    remaining: string
}

export type CardType = {
    code: string;
    image: string;
    images: {
        svg: string;
        png: string;
    };
    value: string;
    suit: string;
}

export type NewDeckProp = {
    deck_id: string,
    remaining: number,
    shuffled: boolean,
    success: boolean
}

export type DrawResponseType = { //fix API responses to have separate file
    success: boolean,
    deck_id: string,
    cards: CardType[],
    remaining: number
}

export type ListPileResponseType = {
    success: boolean,
    deck_id: string,
    remaining: number,
    piles: {
        [key: string]: {
            remaining: number,
            cards: CardType[]
        }
    }
}

export type GameState = "INIT_GAME" | "PLAYER_TURN" | "DEALER_TURN" | "CHECK_WINNERS" | "END_GAME"

export type BustedType = "BUSTED" | "SAFE" | "BLACKJACK" | "STAND"