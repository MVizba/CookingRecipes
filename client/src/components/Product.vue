<script setup lang="ts">
import { trpc } from '@/trpc'

const props = defineProps<{
  product: {
    id: number
    cookingTime: number
    product: string
    instructions: string
  }
}>()

const deleteProduct = async () => {
  await trpc.product.delete.mutate(props.product.id)
}
</script>

<template>
  <div class="product">
    <h3>Cooking Time: {{ props.product.cookingTime }} minutes</h3>
    <p>Ingredient: {{ props.product.product }}</p>
    <p>Instructions: {{ props.product.instructions }}</p>
    <button @click="deleteProduct">Delete</button>
  </div>
</template>

<style scoped>
.product {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}
</style>
