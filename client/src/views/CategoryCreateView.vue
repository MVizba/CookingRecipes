<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { FwbButton, FwbHeading, FwbInput } from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import AlertError from '@/components/AlertError.vue'
import { type CategoryBare } from '../../../server/src/entities/category'

const categoryForm = ref({
  category_name: '',
})

const createdCategory = ref<CategoryBare | null>(null)

const [createCategory, errorMessage] = useErrorMessage(async () => {
  const newCategory = await trpc.category.create.mutate(categoryForm.value)
  const fetchedCategory = await trpc.category.get.query(newCategory.id)
  createdCategory.value = fetchedCategory
})
</script>

<template>
  <div>
    <div v-if="createdCategory">
      <div class="mb-4 flex flex-row">
        <FwbHeading tag="h1" class="mb-0 !text-xl">
          {{ createdCategory.category_name }}
        </FwbHeading>
      </div>
    </div>
    <div v-else>
      <div class="flex items-center justify-between">
        <form aria-label="Project" @submit.prevent="createCategory">
          <div class="space-y-6">
            <FwbHeading tag="h4">Create a new category</FwbHeading>
            <div class="mt-6">
              <FwbInput
                aria-label="Category name"
                v-model="categoryForm.category_name"
                :minlength="2"
                label="Category title"
                placeholder="My category"
              />
            </div>
          </div>
          <AlertError :message="errorMessage" />
          <div class="mt-6 grid grid-cols-2 items-center gap-3">
            <FwbButton type="submit">Save</FwbButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
