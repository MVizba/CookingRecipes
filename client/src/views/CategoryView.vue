<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FwbButton, FwbHeading, FwbAlert } from 'flowbite-vue'
import type { CategoryBare, Recipe as RecipeType } from '@mono/server/src/shared/entities'

const route = useRoute()
const router = useRouter()
const category = ref<(CategoryBare & { recipes: RecipeType[] }) | null>(null)
const errorMessage = ref<string | null>(null)

const fetchCategory = async () => {
  try {
    const categoryData = await trpc.category.get.query(Number(route.params.id))
    console.log('Fetched category data:', categoryData)
    category.value = {
      ...categoryData,
      recipes: categoryData.recipes || [],
    }
  } catch (error) {
    errorMessage.value = 'Category or Recipes not found'
    console.error('Error fetching category:', error)
  }
}

const createRecipe = () => {
  router.push({ name: 'RecipeCreate', params: { id: route.params.id } })
}

const deleteRecipe = async (recipeId: number) => {
  try {
    await trpc.recipe.delete.mutate(recipeId)
    fetchCategory()
  } catch (error) {
    errorMessage.value = 'Error deleting recipe'
  }
}

const viewRecipe = (recipeId: number) => {
  router.push({ name: 'RecipeView', params: { id: recipeId } })
}

const returnToDashboard = () => {
  router.push({ name: 'Dashboard' })
}

onMounted(fetchCategory)
</script>

<template>
  <div>
    <div v-if="category">
      <div class="mb-4 flex flex-row">
        <FwbHeading tag="h1" class="mb-0 !text-xl">
          {{ category.category_name }}
        </FwbHeading>
        <FwbButton @click="createRecipe" class="ml-auto">Add Recipe</FwbButton>
      </div>
      <div v-if="category.recipes.length">
        <div v-for="recipe in category.recipes" :key="recipe.id" class="recipe">
          <h3>{{ recipe.recipe_name }}</h3>
          <FwbButton @click="() => viewRecipe(recipe.id)" class="ml-auto">Instructions</FwbButton>
          <FwbButton @click="() => deleteRecipe(recipe.id)" class="ml-2">Delete Recipe</FwbButton>
        </div>
      </div>
      <div v-else>
        <FwbAlert>No recipes yet!</FwbAlert>
      </div>
      <div><FwbButton @click="returnToDashboard">Return to Dashboard</FwbButton></div>
    </div>
    <div v-else>
      <FwbAlert>{{ errorMessage }}</FwbAlert>
    </div>
  </div>
</template>

<style scoped>
.recipe {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}
</style>
