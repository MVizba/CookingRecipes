<script setup lang="ts">
import { trpc } from '@/trpc'

const props = defineProps<{
  product: {
    id: number
    name: string
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
    <h3>{{ props.product.name }}</h3>
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
