<script lang="ts" setup>
import { trpc } from '@/trpc'
import { ref, onMounted } from 'vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import AlertError from '@/components/AlertError.vue'
import Category from '@/components/Category.vue'
import type { CategoryBare } from '@mono/server/src/shared/entities'

const categories = ref<CategoryBare[]>([])

const fetchCategories = async () => {
  categories.value = await trpc.category.find.query()
}

const categoryForm = ref({
  category_name: '',
})

const [createCategory, errorMessage] = useErrorMessage(async () => {
  await trpc.category.create.mutate(categoryForm.value)
  await fetchCategories()
  categoryForm.value.category_name = ''
})

const deleteCategory = async (categoryId: number) => {
  try {
    await trpc.category.delete.mutate(categoryId)
    fetchCategories()
  } catch (error) {
    errorMessage.value = 'First you need to delete all the recepies!'
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="DashboardView">
    <div v-if="categories.length" data-testid="categoryList">
      <div v-for="category in categories" :key="category.id">
        <Category :category="category" :deleteCategory="deleteCategory" />
      </div>
    </div>
    <FwbAlert v-else data-testid="categoryListEmpty">No categories yet!</FwbAlert>

    <div class="mt-4">
      <form @submit.prevent="createCategory">
        <div class="space-y-6">
          <FwbInput v-model="categoryForm.category_name" label="Category Name" required />
          <AlertError :message="errorMessage" />
          <FwbButton type="submit" size="xl">Add a new category</FwbButton>
        </div>
      </form>
    </div>
  </div>
</template>
