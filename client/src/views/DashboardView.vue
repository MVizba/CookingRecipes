<script lang="ts" setup>
import { trpc } from '@/trpc'
import { ref, onMounted } from 'vue'
import { FwbAlert, FwbButton, FwbInput, FwbModal } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import AlertError from '@/components/AlertError.vue'
import Category from '@/components/Category.vue'
import { useRouter } from 'vue-router'
import type { CategoryBare } from '@mono/server/src/shared/entities'

const categories = ref<CategoryBare[]>([])
const router = useRouter()
const showModal = ref(false)
const categoryToDelete = ref<number | null>(null)

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

const confirmDeleteCategory = (categoryId: number) => {
  categoryToDelete.value = categoryId
  showModal.value = true
}

const deleteCategory = async () => {
  if (categoryToDelete.value !== null) {
    try {
      await trpc.category.delete.mutate(categoryToDelete.value)
      fetchCategories()
    } catch (error) {
      errorMessage.value = 'First you need to delete all the recipes!'
    } finally {
      showModal.value = false
      categoryToDelete.value = null
    }
  }
}

const viewCategory = (categoryId: number) => {
  router.push({ name: 'CategoryView', params: { id: categoryId } })
}

onMounted(fetchCategories)
</script>

<template>
  <div class="DashboardView">
    <div v-if="categories.length" data-testid="categoryList">
      <div v-for="category in categories" :key="category.id">
        <Category
          :category="category"
          @confirmDeleteCategory="confirmDeleteCategory"
          @viewCategory="viewCategory"
        />
      </div>
    </div>
    <FwbAlert v-else data-testid="categoryListEmpty">No categories yet!</FwbAlert>

    <div class="mt-4">
      <form @submit.prevent="createCategory">
        <div class="space-y-6">
          <FwbInput v-model="categoryForm.category_name" label="Category Name" required />
          <AlertError :message="errorMessage" />
          <FwbButton type="submit">Add a new category</FwbButton>
        </div>
      </form>
    </div>

    <FwbModal v-if="showModal" @close="showModal = false">
      <template #header>
        <h3 class="text-lg font-medium">Confirm Deletion</h3>
      </template>
      <template #body>
        <p>Are you sure you want to delete this category?</p>
      </template>
      <template #footer>
        <FwbButton @click="deleteCategory">Yes</FwbButton>
        <FwbButton @click="showModal = false" color="light">No</FwbButton>
      </template>
    </FwbModal>
  </div>
</template>
