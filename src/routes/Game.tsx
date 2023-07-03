import { useEffect } from 'react'
import type { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setDeckId, setPlayerPile } from '../redux/slices/blackjackSlice'
import Button from '../components/Button'
import type { CardType } from '../types'

type NewDeckProp = {
    deck_id: string,
    remaining: number,
    shuffled: boolean,
    success: boolean
}

type DrawResponseType = {
    success: boolean,
    deck_id: string,
    cards: CardType[],
    remaining: number
}

type AddToPileResponseType = {
    success: boolean,
    deck_id: string,
    remaining: number,
    piles: {
        [key: string]: {
            "remaining": number
        }
    }
}

type ListPileResponseType = {
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

export default function Game() {
    const deckId = useSelector((state: RootState) => state.blackjack.deckId)
    const playerPile = useSelector((state: RootState) => state.blackjack.playerPile)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!deckId) {
            fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
                .then(res => res.json())
                .then((res: NewDeckProp) => {
                    dispatch(setDeckId(res.deck_id))
                    localStorage.setItem('deckId', res.deck_id)
                })
                .catch(e => console.error(e))
        }
    }, [])

    const handleDrawClick = async (drawCount: number) => {
        console.log('triggered')
        try {
            const drawRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${drawCount}`)
            const drawResJson: DrawResponseType = await drawRes.json()

            const cardsString: string = drawResJson.cards.reduce((acc, curr: CardType) => {
                acc += curr.code + ","
                return acc
            }, "")

            const trimmedString = cardsString.replace(/,+$/, '');

            const pileRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/player/add/?cards=${trimmedString}`)
            const pileResJson: AddToPileResponseType = await pileRes.json()

            const listPileRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/player/list/`)
            const listPileResJson: ListPileResponseType = await listPileRes.json() // TODO: add type

            dispatch(setPlayerPile(listPileResJson.piles.player.cards))

            return listPileResJson.success
        } catch (e) {
            console.error(e)
            throw e;
        }
    }


    return (
        <>
            hello game

            <div>
                <Button onClick={() => handleDrawClick(2)}>Draw 2</Button>
            </div>
        </>
    )
}