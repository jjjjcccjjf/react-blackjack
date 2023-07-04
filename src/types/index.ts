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

export type GameState = "INIT_GAME" | "NEW_GAME" | "PLAYER_TURN" | "DEALER_TURN" | "CHECK_WINNERS" | "END_GAME"

export type BustedType = "BUSTED" | "SAFE" | "BLACKJACK" | "STAND"