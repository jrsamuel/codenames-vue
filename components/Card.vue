<template>
  <div
    :class="classObj"
    class="border justify-center h-24 w-full flex items-center"
    @click="cardGuessed"
  >
    {{ cardData.word }}
  </div>
</template>

<script>
export default {
  props: {
    cardData: {
      type: Object
    },
    view: {
      type: String
    }
  },
  methods: {
    cardGuessed() {
      this.$emit("cardGuessed", this.cardData)
    }
  },
  computed: {
    classObj() {
      if (this.cardData.guessed) {
        return [
          "text-white",
          {
            "bg-blue-600": this.cardData.color == "blue",
            "bg-red-600": this.cardData.color == "red",
            "bg-gray-500": this.cardData.color == "neutral",
            "bg-black": this.cardData.color == "assassin"
          }
        ]
      } else if (this.view == "codeGiver") {
        return [
          "bg-white",
          {
            "text-blue-600": this.cardData.color == "blue",
            "text-red-600": this.cardData.color == "red",
            "text-gray-500": this.cardData.color == "neutral",
            "text-black": this.cardData.color == "assassin"
          }
        ]
      } else {
        return ["bg-gray-300", "text-gray-900"]
      }
    }
  }
}
</script>

<style scoped>
</style>