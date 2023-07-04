import type { NewDeckProp } from "../types";

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


}

export default ApiHelper;