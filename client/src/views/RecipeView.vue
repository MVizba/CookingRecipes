<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FwbButton, FwbHeading, FwbAlert } from 'flowbite-vue'
import type { RecipeBare, Product as ProductType } from '@mono/server/src/shared/entities'

interface RecipeWithProducts extends RecipeBare {
  products: ProductType[]
}

const route = useRoute()
const router = useRouter()
const recipe = ref<RecipeWithProducts | null>(null)
const errorMessage = ref<string | null>(null)

const fetchRecipe = async () => {
  try {
    const recipeData = await trpc.recipe.get.query(Number(route.params.id))
    recipe.value = recipeData
  } catch (error) {
    errorMessage.value = 'Recipe not found'
    console.error('Error fetching recipe:', error)
  }
}

const deleteProduct = async (productId: number) => {
  try {
    await trpc.product.delete.mutate(productId)
    fetchRecipe()
  } catch (error) {
    console.error('Error deleting product:', error)
  }
}

const addProduct = () => {
  router.push({ name: 'ProductCreate', params: { recipeId: route.params.id } })
}

const returnToCategory = () => {
  router.push({ name: 'CategoryView', params: { id: recipe.value?.categoryId } })
}

onMounted(fetchRecipe)
</script>

<template>
  <div v-if="recipe">
    <div class="mb-4 flex flex-row">
      <FwbHeading tag="h1" class="mb-0 !text-xl">
        {{ recipe.recipe_name }}
      </FwbHeading>
      <FwbButton @click="addProduct" class="ml-auto">Add Product</FwbButton>
    </div>
    <div v-if="recipe.products.length">
      <div v-for="product in recipe.products" :key="product.id" class="product">
        <h3>{{ product.name }}</h3>
        <p>Ingredient: {{ product.product }}</p>
        <p>Instructions: {{ product.instructions }}</p>
        <FwbButton @click="() => deleteProduct(product.id)">Delete Product</FwbButton>
      </div>
    </div>
    <div v-else>
      <FwbAlert>No products yet!</FwbAlert>
    </div>
    <div><FwbButton @click="returnToCategory">Return to Category</FwbButton></div>
  </div>
  <div v-else>
    <FwbAlert>{{ errorMessage }}</FwbAlert>
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
