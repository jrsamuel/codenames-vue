<template>
  <div id="score" class="text-lg">
    <div class="text-center italic -mb-2">Cards Left</div>
    <div class="bg-gray-200 rounded-full py-2 px-6 flex justify-between">
      <span class="bg-white rounded-full py-1 px-2 mr-3 text-xl text-red-500">{{
        red
      }}</span>
      <span class="bg-white rounded-full py-1 px-2 text-xl text-blue-500">{{
        blue
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    red: {
      type: Number
    },
    blue: {
      type: Number
    }
  }
}
</script>

<style scoped>
</style>