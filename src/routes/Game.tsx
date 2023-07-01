import { useState, useEffect } from 'react'
import Button from '../components/Button'

type NewDeckProp = {
    deck_id: string,
    remaining: number,
    shuffled: boolean,
    success: boolean
}

export default function Game() {

    // const [dealerPile, setDealerPile] = useState({})
    // const [playerPile, setPlayerPile] = useState({})

    const [deckId, setDeckId] = useState(() => {
        return localStorage.getItem('deckId') ?? ""
    })

    useEffect(() => {
        if (!deckId) {
            fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
                .then(res => res.json())
                .then((res: NewDeckProp) => {
                    console.log(res)
                    setDeckId(res.deck_id)
                    localStorage.setItem('deckId', res.deck_id)
                })
                .catch(e => console.error(e))
        }
    }, [])

    return (
        <>
            hello game

            <div>
                <Button>Draw</Button>
            </div>
        </>
    )
}