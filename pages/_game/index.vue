<template>
  <div class="w-4/5 mx-auto">
    <p class="text-3xl text-center text-green-800 tracking-wider mt-8">
      CODENAMES
    </p>
    <p class="text-sm text-gray-600 text-center mt-1 mb-8">
      Game Room Link:
      <a :href="gameLink">{{ gameLink }}</a>
    </p>

    <div class="flex items-center justify-between mb-8 text-lg">
      <div class="w-1/5 text-gray-800 uppercase">{{ turn }}'s turn</div>
      <score class="w=1/5" :red="redLeft" :blue="blueLeft"></score>

      <button
        @click="endTurn"
        class="w-1/5 bg-gray-200 text-gray-800 border capitalize rounded py-1 px-2"
      >
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
      <button
        @click="startNew"
        class="text-sm text-gray-800 border rounded py-1 px-2"
      >
        New Game
      </button>
    </div>
    <div class="mt-20">
      <a
        class="text-xs text-gray-400 underline mt-20"
        href="https://www.buymeacoffee.com/coderVtwo"
        >Buy The Developer A Coffee</a
      >
    </div>
  </div>
</template>

<script>
import Card from "@/components/Card.vue"
import Score from "@/components/Score.vue"

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
    Card,
    Score
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
  computed: {
    roomName() {
      return this.$route.params.game
    },
    gameLink() {
      return process.env.baseUrl + this.$route.fullPath
    }
  },

  created() {
    let gameRef = this.$fireStore.collection("gameData").doc(this.roomName)
    gameRef.onSnapshot(doc => {
      this.turn = doc.data().turn
      this.redLeft = doc.data().redLeft
      this.blueLeft = doc.data().blueLeft
      this.winner = doc.data().winner
    })

    gameRef.collection("board").onSnapshot(qs => {
      this.board = []
      qs.forEach(doc => {
        this.board.push(doc.data())
      })
    })
  },
  methods: {
    // when new game button is clicked, confirm and start new game
    startNew() {
      this.$swal({
        title: "Start A New Game?",
        buttons: true
      }).then(isConfirmed => {
        if (!isConfirmed) return
        this.view = "guesser"
        this.$gameMgr.createGame(this.roomName)
      })
    },
    endTurn() {
      this.turn = this.turn == "red" ? "blue" : "red"
      this.$fireStore
        .collection("gameData")
        .doc(roomName)
        .set({ turn: this.turn }, { merge: true })
    },

    guess(cardData) {
      if (cardData.guessed == true) return
      cardData.guessed = true
      let gameRef = this.$fireStore.collection("gameData").doc(this.roomName)
      // update guessed status on card picked
      gameRef
        .collection("board")
        .doc("" + cardData.cardNum)
        .set({ guessed: true }, { merge: true })

      this.redLeft = this.board.filter(card => {
        return card.color == "red" && !card.guessed
      }).length

      this.blueLeft = this.board.filter(card => {
        return card.color == "blue" && !card.guessed
      }).length

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
      gameRef.set(
        {
          blueLeft: this.blueLeft,
          redLeft: this.redLeft,
          turn: this.turn,
          winner: this.winner
        },
        { merge: true }
      )
    }
  }
}
</script>

<style scoped>
</style>