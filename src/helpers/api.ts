import type { DrawResponseType, NewDeckProp, ListPileResponseType } from "../types";

class ApiHelper {

    /**
     * create brand new deck using the API
     * @returns 
     */
    async getNewDeck(): Promise<string> {
        try {
            const res = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
            const data: NewDeckProp = await res.json();
            console.log('got new deck');
            return data.deck_id;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * shuffles an existing deck
     * @param deckId 
     * @returns 
     */
    async shuffleDeck(deckId: string): Promise<string> {
        try {
            const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
            const data: NewDeckProp = await res.json();
            console.log('shuffled old deck');
            return data.deck_id;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async draw(deckId: string, player: string, drawCount: number): Promise<DrawResponseType> {
        try {
            const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${drawCount}`)
            const data: DrawResponseType = await res.json()
            console.log(`${player} drew ${drawCount} card(s)`)
            return data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addToPile(deckId: string, player: string, cards: string) {
        try {
            // const res = 
            await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${player}/add/?cards=${cards}`)
            // const data: DrawResponseType = await res.json()
            console.log(`${cards} added to ${player.toLocaleUpperCase()}'s hand.`)
            const cardsText = cards.slice(0, 3) + ' ' + cards.slice(3);
            return `${cardsText} added to ${player.toLocaleUpperCase()}'S hand.`
            // return data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async listPile(deckId: string, player: string) {
        try {
            const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${player}/list/`)
            const data: ListPileResponseType = await res.json()
            console.log(`retreiving ${player}'s hand`)
            return data
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

export default ApiHelper;