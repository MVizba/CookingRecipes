<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FwbButton, FwbInput } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import AlertError from '@/components/AlertError.vue'

const route = useRoute()
const router = useRouter()

const recipeId = Number(route.params.recipeId)

const productForm = ref({
  cookingTime: '',
  product: '',
  instructions: '',
  recipeId: recipeId,
})

const [createProduct, errorMessage] = useErrorMessage(async () => {
  const formValue = {
    ...productForm.value,
    cookingTime: Number(productForm.value.cookingTime),
  }
  await trpc.product.create.mutate(formValue)
  router.push({ name: 'RecipeView', params: { id: productForm.value.recipeId } })
})
</script>

<template>
  <div>
    <form @submit.prevent="createProduct">
      <div class="space-y-6">
        <FwbInput
          v-model="productForm.cookingTime"
          label="Cooking Time (minutes)"
          type="number"
          required
        />
        <FwbInput v-model="productForm.product" label="Product Ingredient" required />
        <FwbInput v-model="productForm.instructions" label="Instructions" required />
        <AlertError :message="errorMessage" />
        <FwbButton type="submit">Save</FwbButton>
      </div>
    </form>
  </div>
</template>
