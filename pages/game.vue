<template>
  <div class="w-4/5 mx-auto">
    <p class="text-3xl text-center my-8">CODENAMES</p>

    <div class="flex justify-between mb-8 text-lg">
      <div id="score" class="text-lg">
        <span>Cards Left: </span>
        <span class="text-red-500">{{ redLeft }}</span> -
        <span class="text-blue-500">{{ blueLeft }}</span>
      </div>
      <div id="turn">
        <span>{{ turn }}'s turn</span>
      </div>
      <button @click="endTurn" class="bg-gray-400 rounded-md py-1 px-2">
        End {{ turn }}'s Turn
      </button>
    </div>

    <div id="board" class="grid grid-cols-5 gap-2">
      <div v-for="card in board" :key="card.word">
        <card
          :cardData="card"
          :view="view"
          class="w-1/5"
          @cardGuessed="guess"
        ></card>
      </div>
    </div>

    <div class="flex justify-between mt-12">
      <div id="view" class="flex items-baseline">
        <input
          class="ml-3 mr-1"
          type="radio"
          id="one"
          value="guesser"
          v-model="view"
        />
        <label for="one">Guesser</label>

        <input
          class="ml-3 mr-1"
          type="radio"
          id="two"
          value="codeGiver"
          v-model="view"
        />
        <label for="two">Code Giver</label>
      </div>
      <button @click="startNew" class="text-sm border rounded py-1 px-2">
        New Game
      </button>
    </div>
  </div>
</template>

<script>
import Card from "@/components/Card.vue"
import { createBoard } from "~/plugins/createBoard.js"

export default {
  name: "game",
  data() {
    return {
      board: [],
      turn: "red",
      redLeft: 9,
      blueLeft: 8,
      winner: null,
      view: "guesser"
    }
  },
  components: {
    Card
  },
  watch: {
    // if winner gets set, pop alert
    winner: function(val, oldVal) {
      if (val) {
        this.$swal({
          title: "Congrats!",
          text: `${val} wins!`,
          button: false,
          icon: "success",
          timer: 5000
        })
      }
    }
  },

  created() {
    this.startWatchers() // starts the FS watchers for game data
    if (this.$route.params.newGame) {
      // see if new game was passed
      this.createGame()
    }
  },
  methods: {
    // when new game button is clicked, confirm and start new game
    startNew() {
      this.$swal({
        title: "Start A New Game?",
        buttons: true
      }).then(isConfirmed => {
        if (!isConfirmed) return
        this.createGame()
      })
    },
    // clears board and starts new game
    createGame() {
      this.view = "guesser"

      let ref = this.$fireStore.collection("gameData").doc("gameStats")
      ref.set({
        turn: "red",
        redLeft: 9,
        blueLeft: 8,
        winner: null
      })

      let newBoard = createBoard() // get new words
      let boardRef = ref.collection("board")
      let batch = this.$fireStore.batch()
      newBoard.forEach(card => {
        batch.set(boardRef.doc("" + card.cardNum), card)
      })
      batch.commit()
    },
    endTurn() {
      this.turn = this.turn == "red" ? "blue" : "red"
      this.$fireStore
        .collection("gameData")
        .doc("gameStats")
        .set({ turn: this.turn }, { merge: true })
    },

    guess(cardData) {
      cardData.guessed = true
      let ref = this.$fireStore.collection("gameData").doc("gameStats")
      // update guessed status on card picked
      let boardRef = ref.collection("board")
      boardRef
        .doc("" + cardData.cardNum)
        .set({ guessed: true }, { merge: true })

      // update score
      if (cardData.color == "red") {
        this.redLeft--
      }
      if (cardData.color == "blue") {
        this.blueLeft--
      }

      // is game over
      if (cardData.color == "assassin") {
        if (this.turn == "red") {
          this.winner = "Blue"
        }
        if (this.turn == "blue") {
          this.winner = "Red"
        }
      }
      if (this.redLeft == 0) {
        this.winner = "Red"
      }
      if (this.blueLeft == 0) {
        this.winner = "Blue"
      }

      // update whose turn it is
      if (this.turn != cardData.color) {
        this.turn = this.turn == "red" ? "blue" : "red"
      }

      // update game stats on FS
      ref.set(
        {
          blueLeft: this.blueLeft,
          redLeft: this.redLeft,
          turn: this.turn,
          winner: this.winner
        },
        { merge: true }
      )
    },
    startWatchers() {
      this.$fireStore
        .collection("gameData")
        .doc("gameStats")
        .onSnapshot(doc => {
          this.turn = doc.data().turn
          this.redLeft = doc.data().redLeft
          this.blueLeft = doc.data().blueLeft
          this.winner = doc.data().winner
        })

      this.$fireStore.collection("gameData/gameStats/board").onSnapshot(qs => {
        this.board = []
        qs.forEach(doc => {
          this.board.push(doc.data())
        })
      })
    }
  }
}
</script>

<style scoped>
</style>