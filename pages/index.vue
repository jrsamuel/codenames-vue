<template>
  <div>
    <div class="flex flex-col h-full content-around align-around mt-56">
      <logo />
      <h1 class="text-5xl text-center mt-4">
        Codenames
      </h1>
      <h2 class="text-2xl text-center">
        Codenames with a digital gameboard
      </h2>

      <div class="flex flex-col w-1/3 mt-6 mx-auto justify-center">
        <button
          @click="startNew"
          class="button rounded bg-green-600 text-white px-2 py-1"
        >
          Create New Game Room
        </button>
        <p class="text-center text-lg my-4 italic">OR</p>
        <div class="flex flex-col align-middle justify-center">
          <input
            type="text"
            class="border-2 rounded-md px-1 text-center"
            v-model="room"
            placeholder="Enter Room Name"
          />
          <button
            @click="startExisting"
            class="button rounded bg-green-600 text-white px-2 py-1 mt-3"
          >
            Join Existing Game Room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue"

export default {
  data() {
    return {
      room: ""
    }
  },
  components: {
    Logo
  },
  computed: {
    roomLink() {
      return "/" + this.room.toLowerCase().trim()
    }
  },
  methods: {
    startNew() {
      let roomName = this.$gameMgr.createRoomName()
      this.$gameMgr.createGame(roomName).then(res => {
        this.$router.push("/" + roomName)
      })
    },
    startExisting() {
      if (!this.room.trim()) return
      let roomDoc = this.room.toLowerCase().trim()
      const roomRef = this.$fireStore.collection("gameData").doc(roomDoc)
      roomRef.get().then(res => {
        if (!res.exists) {
          this.$swal({
            title: "Sorry, " + roomDoc + " does not exist.  Try again",
            button: false,
            icon: "error",
            timer: 2000
          })
          this.room = " "
          return
        } else {
          this.$router.push("/" + roomDoc)
        }
      })
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
</style>
