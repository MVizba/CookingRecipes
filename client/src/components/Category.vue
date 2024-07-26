<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { CategoryBare } from '@mono/server/src/shared/entities'

export default defineComponent({
  props: {
    category: {
      type: Object as PropType<CategoryBare>,
      required: true,
    },
  },
})
</script>

<template>
  <div class="category flex items-center justify-between">
    <h3 @click="$emit('viewCategory', category.id)" class="category-name">
      {{ category.category_name }}
    </h3>
    <img
      @click="$emit('confirmDeleteCategory', category.id)"
      src="https://img.icons8.com/ios-glyphs/30/000000/trash.png"
      alt="Delete"
      class="cursor-pointer"
      style="width: 20px; height: 20px"
    />
  </div>
</template>

<style scoped>
.category {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}
.category-name {
  cursor: pointer;
  color: rgb(0, 0, 0);
  font-weight: bold;
}
.category-name:hover {
  color: rgb(120, 120, 124);
}
</style>
