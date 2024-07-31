<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FwbButton, FwbHeading, FwbAlert, FwbModal } from 'flowbite-vue'
import type {
  CategoryBare,
  Recipe as RecipeType,
  Product as ProductType,
} from '@mono/server/src/shared/entities'

type RecipeWithProduct = RecipeType & { product: ProductType | null }

const route = useRoute()
const router = useRouter()
const category = ref<(CategoryBare & { recipes: RecipeWithProduct[] }) | null>(null)
const errorMessage = ref<string | null>(null)
const showModal = ref(false)
const recipeToDelete = ref<number | null>(null)

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

const confirmDeleteRecipe = (recipeId: number) => {
  recipeToDelete.value = recipeId
  showModal.value = true
}

const deleteRecipe = async () => {
  if (recipeToDelete.value !== null) {
    try {
      await trpc.recipe.delete.mutate(recipeToDelete.value)
      fetchCategory()
      showModal.value = false
    } catch (error) {
      errorMessage.value = 'Error deleting recipe'
    }
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
        <FwbButton @click="createRecipe" class="ml-auto">New Recipe</FwbButton>
      </div>
      <div v-if="category.recipes.length" class="recipes-grid">
        <div
          v-for="recipe in category.recipes"
          :key="recipe.id"
          class="recipe flex flex-col items-center"
        >
          <h3 @click="viewRecipe(recipe.id)" class="recipe-name">{{ recipe.recipe_name }}</h3>
          <img
            :src="recipe.product?.url || 'https://img.icons8.com/ios-glyphs/30/000000/no-image.png'"
            alt="Product Image"
            class="product-image"
          />
          <img
            @click="() => confirmDeleteRecipe(recipe.id)"
            src="https://img.icons8.com/ios-glyphs/30/000000/trash.png"
            alt="Delete"
            class="trash-icon cursor-pointer"
          />
        </div>
      </div>
      <div v-else>
        <FwbAlert>No recipes yet!</FwbAlert>
      </div>
      <div><FwbButton @click="returnToDashboard">Return</FwbButton></div>
    </div>
    <div v-else>
      <FwbAlert>{{ errorMessage }}</FwbAlert>
    </div>

    <FwbModal v-if="showModal" @close="showModal = false">
      <template #header>
        <h3 class="text-lg font-medium">Confirm Deletion</h3>
      </template>
      <template #body>
        <p>Are you sure you want to delete this recipe?</p>
      </template>
      <template #footer>
        <FwbButton @click="deleteRecipe">Yes</FwbButton>
        <FwbButton @click="showModal = false" color="light">No</FwbButton>
      </template>
    </FwbModal>
  </div>
</template>

<style scoped>
.recipe {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  width: 200px;
  text-align: center;
}
.recipe-name {
  cursor: pointer;
  color: rgb(0, 0, 0);
  font-weight: bold;
  margin-bottom: 10px;
}
.recipe-name:hover {
  color: rgb(146, 147, 145);
}
.product-image {
  width: 150px;
  height: 100px;
  margin-bottom: 10px;
}
.trash-icon {
  width: 20px;
  height: 20px;
  margin-top: 10px;
}
.recipes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
