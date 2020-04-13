
import Vue from 'vue'
import wordsList from '~/static/original.txt'
import _ from 'lodash'

let words = wordsList.split('\n')

let gameMgr = {}


export default function (context) {


    gameMgr.createBoard = () => {
        let pickedList = []
        let cards = []

        do {
            let newWord = words[_.random(400)]
            pickedList = _.union(pickedList, [newWord])
        } while (pickedList.length < 25)

        pickedList.forEach((w, i) => {
            let newItem = {}
            newItem.word = w
            newItem.cardNum = i
            newItem.guessed = false
            cards.push(newItem)
        })

        let cardsLeft = _.clone(cards);
        // assign assassin
        let cardPicked = _.random(cardsLeft.length - 1)
        cards[cardPicked].color = 'assassin';
        cardsLeft.splice(cardPicked, 1);

        // assign reds

        [...Array(9)].forEach((v, i) => {
            cardPicked = _.random(cardsLeft.length - 1);
            let pickedNum = cardsLeft[cardPicked].cardNum
            cards.find(e => e.cardNum == pickedNum).color = 'red'
            cardsLeft.splice(cardPicked, 1);
        });

        // assign blues

        [...Array(8)].forEach((v, i) => {
            cardPicked = _.random(cardsLeft.length - 1);
            let pickedNum = cardsLeft[cardPicked].cardNum
            cards.find(e => e.cardNum == pickedNum).color = 'blue'
            cardsLeft.splice(cardPicked, 1);
        });

        // assign neutrals

        [...Array(7)].forEach((v, i) => {
            cardPicked = _.random(cardsLeft.length - 1);
            let pickedNum = cardsLeft[cardPicked].cardNum
            cards.find(e => e.cardNum == pickedNum).color = 'neutral'
            cardsLeft.splice(cardPicked, 1);
        });

        return cards

    }

    gameMgr.createRoomName = () => {
        let rand1 = words[_.random(400)].toLowerCase()
        let rand2 = words[_.random(400)].toLowerCase()
        return rand1 + "-" + rand2
    }

    gameMgr.createGame = async function (roomName) {

        let ref = context.app.$fireStore.collection('gameData').doc(roomName)

        await ref.set({
            turn: "red",
            redLeft: 9,
            blueLeft: 8,
            winner: null
        })


        let newBoard = this.createBoard() // get new words
        let boardRef = ref.collection("board")
        let batch = context.app.$fireStore.batch()
        newBoard.forEach(card => {
            batch.set(boardRef.doc("" + card.cardNum), card)
        })

        return batch.commit()


    }

    return gameMgr

}


Vue.prototype.$gameMgr = gameMgr
