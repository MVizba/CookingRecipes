<script lang="ts" setup>
import { FwbButton } from 'flowbite-vue'
import { useRouter } from 'vue-router'
import type { CategoryBare } from '@mono/server/src/shared/entities'

const props = defineProps<{
  category: CategoryBare
  deleteCategory: (categoryId: number) => void
}>()

const router = useRouter()

const handleDelete = () => {
  props.deleteCategory(props.category.id)
}

const viewCategoryDetails = () => {
  router.push({ name: 'CategoryView', params: { id: props.category.id } })
}
</script>

<template>
  <div
    class="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
  >
    <div>
      <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ category.category_name }}
      </h5>
    </div>
    <div>
      <FwbButton @click="viewCategoryDetails" class="mr-2" size="sm">View Details</FwbButton>
      <FwbButton @click="handleDelete" size="sm">Delete</FwbButton>
    </div>
  </div>
</template>
