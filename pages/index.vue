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
      <div class="flex justify-center mt-6">
        <nuxt-link :to="{ name: 'game', params: { newGame: true } }">
          <button class="button rounded bg-green-600 text-white px-2 py-1">
            Start New Game
          </button>
        </nuxt-link>
        <nuxt-link to="/game" class="ml-6">
          <button class="button rounded bg-green-600 text-white px-2 py-1">
            Join Game In Progress
          </button>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue"

export default {
  components: {
    Logo
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
