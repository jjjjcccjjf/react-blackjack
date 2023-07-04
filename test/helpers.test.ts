import { assert, describe, expect, it } from 'vitest'
import { getCalculatedHandValue, getRawHandValue, checkBlackJack } from '../src/helpers'

describe('Blackjack helper functions', () => {

    it('should return a string array of the cards', async () => {

        const sampleResponse = {
            "success": true,
            "deck_id": "nj33kv3rs104",
            "cards": [
                {
                    "code": "4C",
                    "image": "https://deckofcardsapi.com/static/img/4C.png",
                    "images": {
                        "svg": "https://deckofcardsapi.com/static/img/4C.svg",
                        "png": "https://deckofcardsapi.com/static/img/4C.png"
                    },
                    "value": "4",
                    "suit": "CLUBS"
                },
                {
                    "code": "6H",
                    "image": "https://deckofcardsapi.com/static/img/6H.png",
                    "images": {
                        "svg": "https://deckofcardsapi.com/static/img/6H.svg",
                        "png": "https://deckofcardsapi.com/static/img/6H.png"
                    },
                    "value": "6",
                    "suit": "HEARTS"
                }
            ],
            "remaining": 50
        }

        const handValue = await getRawHandValue(sampleResponse.cards)

        expect(handValue).toEqual(['4', '6'])

    })

    it('should return an empty array if there are no cards', async () => {

        const sampleResponse = {
            "success": true,
            "deck_id": "nj33kv3rs104",
            "cards": [],
            "remaining": 52
        }

        const handValue = await getRawHandValue(sampleResponse.cards)

        expect(handValue).toEqual([])

    })

    it('should always put ACE at the end of the array', async () => {
        const cards = [
            {
                "code": "AH",
                "image": "https://deckofcardsapi.com/static/img/AH.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/AH.svg",
                    "png": "https://deckofcardsapi.com/static/img/AH.png"
                },
                "value": "ACE",
                "suit": "HEARTS"
            },
            {
                "code": "4C",
                "image": "https://deckofcardsapi.com/static/img/4C.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/4C.svg",
                    "png": "https://deckofcardsapi.com/static/img/4C.png"
                },
                "value": "4",
                "suit": "CLUBS"
            },
            {
                "code": "JC",
                "image": "https://deckofcardsapi.com/static/img/JC.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/JC.svg",
                    "png": "https://deckofcardsapi.com/static/img/JC.png"
                },
                "value": "JACK",
                "suit": "CLUBS"
            },
        ]

        const handValue = await getRawHandValue(cards)
        expect(handValue[handValue.length - 1]).toBe('ACE')
    })

    it('should count numerical hand values properly', async () => {
        const result1 = await getCalculatedHandValue(['4', '6'])
        expect(result1).toBe(10)

        const result2 = await getCalculatedHandValue(['JACK', 'ACE'])
        expect(result2).toBe(21)

        const result3 = await getCalculatedHandValue(['JACK', 'ACE', '9'])
        expect(result3).toBe(30)

        const result4 = await getCalculatedHandValue([])
        expect(result4).toBe(0)
    })

    it('should count numerical hand values properly', async () => {
        const result1 = await checkBlackJack(21)
        expect(result1).toBe('BLACKJACK')

        const result2 = await checkBlackJack(20)
        expect(result2).toBe('SAFE')

        const result3 = await checkBlackJack(30)
        expect(result3).toBe('BUSTED')
    })

    it('should calculate an A1 properly', async () => {
        const cards = [
            {
                "code": "AH",
                "image": "https://deckofcardsapi.com/static/img/AH.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/AH.svg",
                    "png": "https://deckofcardsapi.com/static/img/AH.png"
                },
                "value": "ACE",
                "suit": "HEARTS"
            },
            {
                "code": "4C",
                "image": "https://deckofcardsapi.com/static/img/4C.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/4C.svg",
                    "png": "https://deckofcardsapi.com/static/img/4C.png"
                },
                "value": "4",
                "suit": "CLUBS"
            },
            {
                "code": "JC",
                "image": "https://deckofcardsapi.com/static/img/JC.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/JC.svg",
                    "png": "https://deckofcardsapi.com/static/img/JC.png"
                },
                "value": "JACK",
                "suit": "CLUBS"
            },
        ]

        const result = await getRawHandValue(cards)
            .then(res => getCalculatedHandValue(res))
            .then(res => checkBlackJack(res))
            .catch(e => {
                throw e
            })

        expect(result).toBe('SAFE')
    })

    it('should calculate a blackjack properly', async () => {
        const cards = [
            {
                "code": "AH",
                "image": "https://deckofcardsapi.com/static/img/AH.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/AH.svg",
                    "png": "https://deckofcardsapi.com/static/img/AH.png"
                },
                "value": "ACE",
                "suit": "HEARTS"
            },
            {
                "code": "KH",
                "image": "https://deckofcardsapi.com/static/img/KH.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/KH.svg",
                    "png": "https://deckofcardsapi.com/static/img/KH.png"
                },
                "value": "KING",
                "suit": "HEARTS"
            },
            {
                "code": "JC",
                "image": "https://deckofcardsapi.com/static/img/JC.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/JC.svg",
                    "png": "https://deckofcardsapi.com/static/img/JC.png"
                },
                "value": "JACK",
                "suit": "CLUBS"
            },
        ]

        const result = await getRawHandValue(cards)
            .then(res => getCalculatedHandValue(res))
            .then(res => checkBlackJack(res))
            .catch(e => {
                throw e
            })

        expect(result).toBe('BLACKJACK')
    })

    
    it('should calculate a blackjack properly', async () => {
        const cards = [
            {
                "code": "AH",
                "image": "https://deckofcardsapi.com/static/img/AH.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/AH.svg",
                    "png": "https://deckofcardsapi.com/static/img/AH.png"
                },
                "value": "ACE",
                "suit": "HEARTS"
            },
            {
                "code": "KH",
                "image": "https://deckofcardsapi.com/static/img/KH.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/KH.svg",
                    "png": "https://deckofcardsapi.com/static/img/KH.png"
                },
                "value": "KING",
                "suit": "HEARTS"
            },
            {
                "code": "JC",
                "image": "https://deckofcardsapi.com/static/img/JC.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/JC.svg",
                    "png": "https://deckofcardsapi.com/static/img/JC.png"
                },
                "value": "JACK",
                "suit": "CLUBS"
            },
            
            {
                "code": "9C",
                "image": "https://deckofcardsapi.com/static/img/9C.png",
                "images": {
                    "svg": "https://deckofcardsapi.com/static/img/9C.svg",
                    "png": "https://deckofcardsapi.com/static/img/9C.png"
                },
                "value": "9",
                "suit": "CLUBS"
            },
        ]

        const result = await getRawHandValue(cards)
            .then(res => getCalculatedHandValue(res))
            .then(res => checkBlackJack(res))
            .catch(e => {
                throw e
            })

        expect(result).toBe('BUSTED')
    })

})