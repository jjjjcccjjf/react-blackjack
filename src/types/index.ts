export type PileType = {
    cards: Array<CardType>,
    remaining: string
}

export type CardType = {
    image: string,
    value: string,
    suit: string,
    code: string
}

export type BustedType = "BUSTED" | "SAFE" | "BLACKJACK"