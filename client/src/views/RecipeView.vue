<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FwbButton, FwbHeading, FwbAlert } from 'flowbite-vue'
import type { RecipeBare, Product as ProductType } from '@mono/server/src/shared/entities'

interface RecipeWithProducts extends RecipeBare {
  product: ProductType | null
}

const route = useRoute()
const router = useRouter()
const recipe = ref<RecipeWithProducts | null>(null)
const errorMessage = ref<string | null>(null)
const showModal = ref(false)

const fetchRecipe = async () => {
  try {
    const recipeData = await trpc.recipe.get.query(Number(route.params.id))
    recipe.value = recipeData
  } catch (error) {
    errorMessage.value = 'Recipe not found'
    console.error('Error fetching recipe:', error)
  }
}

const editProduct = () => {
  if (recipe.value && recipe.value.product) {
    router.push({
      name: 'ProductEdit',
      params: { recipeId: recipe.value.id, productId: recipe.value.product.id },
    })
  } else {
    console.log('Product not found or recipe is null')
  }
}

const addProduct = () => {
  router.push({ name: 'ProductCreate', params: { recipeId: route.params.id } })
}

const returnToCategory = () => {
  if (recipe.value) {
    router.push({ name: 'CategoryView', params: { id: recipe.value.categoryId } })
  }
}

onMounted(fetchRecipe)
</script>

<template>
  <div v-if="recipe">
    <div class="mb-4 flex flex-row">
      <FwbHeading tag="h1" class="mb-0 !text-xl">
        {{ recipe.recipe_name }}
      </FwbHeading>
      <FwbButton @click="addProduct" class="ml-auto" v-if="!recipe.product">Add Product</FwbButton>
    </div>
    <div v-if="recipe.product">
      <div class="product">
        <h3>Cooking Time: {{ recipe.product.cookingTime }} minutes</h3>
        <p>Ingredient: {{ recipe.product.product }}</p>
        <p>Instructions: {{ recipe.product.instructions }}</p>
        <FwbButton @click="editProduct">Edit Product</FwbButton>
      </div>
    </div>
    <div v-else>
      <FwbAlert>No products yet!</FwbAlert>
    </div>
    <div><FwbButton @click="returnToCategory">Return to Category</FwbButton></div>
  </div>
  <div v-else>
    <div class="mb-4 flex flex-row">
      <FwbHeading tag="h1" class="mb-0 !text-xl"> Recipe not found </FwbHeading>
      <FwbButton @click="addProduct" class="ml-auto">Add Product</FwbButton>
    </div>
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
