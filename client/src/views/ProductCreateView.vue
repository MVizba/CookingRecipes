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
  product: '',
  instructions: '',
  recipeId: recipeId,
})

const [saveProduct, errorMessage] = useErrorMessage(async () => {
  const payload = {
    id: productId || 0,
    cookingTime: Number(productForm.value.cookingTime),
    product: productForm.value.product,
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
      product: productData.product,
      instructions: productData.instructions,
      recipeId: recipeId,
    }
  }
}

onMounted(fetchProduct)
</script>

<template>
  <div>
    <form @submit.prevent="saveProduct">
      <FwbInput v-model="productForm.cookingTime" label="Cooking Time" type="number" required />
      <FwbInput v-model="productForm.product" label="Product Ingredient" required />
      <FwbInput v-model="productForm.instructions" label="Instructions" required />
      <AlertError :message="errorMessage" />
      <FwbButton type="submit">Save</FwbButton>
    </form>
  </div>
</template>
