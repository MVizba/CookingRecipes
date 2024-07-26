<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FwbButton, FwbInput } from 'flowbite-vue'

const route = useRoute()
const router = useRouter()

const recipeForm = ref({
  recipe_name: '',
  categoryId: Number(route.params.id),
})

const createRecipe = async () => {
  try {
    const newRecipe = await trpc.recipe.create.mutate(recipeForm.value)
    console.log('Created new recipe:', newRecipe)
    router.push({ name: 'CategoryView', params: { id: recipeForm.value.categoryId } })
  } catch (error) {
    console.error('Error creating recipe:', error)
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="createRecipe">
      <FwbInput v-model="recipeForm.recipe_name" label="Recipe Name" required />
      <FwbButton type="submit">Save</FwbButton>
    </form>
  </div>
</template>
