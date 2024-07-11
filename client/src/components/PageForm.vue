<script lang="ts" setup>
import { FwbHeading } from 'flowbite-vue'

defineProps<{
  heading: string
  formLabel: string
}>()

defineEmits<{
  submit: []
}>()
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <FwbHeading tag="h2">{{ heading }}</FwbHeading>

      <div class="mt-10">
        <form class="space-y-6" :aria-label="formLabel" @submit.prevent="$emit('submit')">
          <slot />
        </form>

        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
