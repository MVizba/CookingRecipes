<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FwbButton, FwbInput } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import AlertError from '@/components/AlertError.vue'

const route = useRoute()
const router = useRouter()
const recipeId = Number(route.params.recipeId)
const productId = route.params.productId ? Number(route.params.productId) : null

const productForm = ref({
  cookingTime: '',
  ingredients: [''] as string[],
  instructions: '',
  recipeId: recipeId,
})

const [saveProduct, errorMessage] = useErrorMessage(async () => {
  const payload = {
    id: productId || 0,
    cookingTime: Number(productForm.value.cookingTime),
    product: productForm.value.ingredients.filter(Boolean).join(', '),
    instructions: productForm.value.instructions,
    recipeId: recipeId,
  }

  if (productId) {
    await trpc.product.edit.mutate(payload)
  } else {
    await trpc.product.create.mutate(payload)
  }
  router.push({ name: 'RecipeView', params: { id: recipeId } })
})

const fetchProduct = async () => {
  if (productId) {
    const productData = await trpc.product.get.query(productId)
    productForm.value = {
      cookingTime: productData.cookingTime.toString(),
      ingredients: productData.product.split(', ').concat(''),
      instructions: productData.instructions,
      recipeId: recipeId,
    }
  }
}

const handleIngredientKeyup = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addIngredient(index)
  }
}

const addIngredient = (index: number) => {
  if (productForm.value.ingredients[index].trim()) {
    productForm.value.ingredients.push('')
  }
}

const removeIngredient = (index: number) => {
  productForm.value.ingredients.splice(index, 1)
}

onMounted(fetchProduct)
</script>

<template>
  <div>
    <form @submit.prevent="saveProduct">
      <FwbInput v-model="productForm.cookingTime" label="Cooking Time" type="number" required />
      <div v-for="(ingredient, index) in productForm.ingredients" :key="index" class="ingredient">
        <FwbInput
          v-model="productForm.ingredients[index]"
          label="Ingredient"
          @keydown.enter.stop.prevent="handleIngredientKeyup($event, index)"
        />
        <img
          @click="() => removeIngredient(index)"
          src="https://img.icons8.com/ios-glyphs/30/000000/trash.png"
          alt="Delete"
          class="trash-icon cursor-pointer"
        />
      </div>
      <AlertError :message="errorMessage" />
      <label class="block text-sm font-medium text-gray-700">Instructions</label>
      <textarea
        v-model="productForm.instructions"
        rows="4"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      ></textarea>
      <FwbButton type="submit">Save</FwbButton>
    </form>
  </div>
</template>

<style scoped>
.ingredient {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.fwb-input {
  flex: 1;
}
.trash-icon {
  margin-top: 25px;
  margin-left: 10px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
