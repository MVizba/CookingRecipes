<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FwbButton } from 'flowbite-vue'
import type { Recipe } from '@mono/server/src/shared/entities'

const route = useRoute()
const router = useRouter()
const recipe = ref<Recipe | null>(null)
const recipeId = Number(route.params.id)
console.log(recipeId)
const errorMessage = ref<string | null>(null)

const fetchRecipe = async () => {
  try {
    const fetchedRecipe = await trpc.recipe.get.query(recipeId)
    console.log('Fetched recipe:', fetchedRecipe)
    recipe.value = fetchedRecipe
  } catch (error) {
    errorMessage.value = 'Recipe not foundddddd'
    console.error('Error fetching recipe:', error)
  }
}
const addProduct = () => {
  router.push({ name: 'ProductCreate', params: { recipeId } })
}

onMounted(fetchRecipe)
</script>

<template>
  <div v-if="recipe">
    <h3>{{ recipe.recipe_name }}</h3>
    <FwbButton @click="addProduct">Add Product</FwbButton>
  </div>
  <div v-else>
    <p>{{ errorMessage }}</p>
  </div>
</template>
