<script lang="ts" setup>
import { FwbButton } from 'flowbite-vue'
</script>

<template>
  <!-- landing page with Tailwind -->
  <div class="bg-white dark:bg-gray-800">
    <div class="container mx-auto px-6 py-8">
      <div class="items-center lg:flex">
        <div class="lg:w-1/2">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Never forget your cooking skills!
          </h2>

          <p class="mt-4 text-gray-500 dark:text-gray-400 lg:max-w-md">
            Designed for Sheffs but suitable for you.
            <strong>RECIPES APP</strong> let you save all the best cooking practice and secrets in
            one place. You know your grandmother will apriciate this.
          </p>

          <div class="mt-6 flex items-center gap-2">
            <!-- prettier-ignore -->
            <FwbButton
              component="RouterLink"
              tag="router-link"
              class="bg-gray-800 text-white"
              :href="({ name: 'Signup' } as any)"
            >
              Register
            </FwbButton>
            <FwbButton
              component="RouterLink"
              tag="router-link"
              class="bg-gray-800 text-white"
              color="alternative"
              :href="{ name: 'Login' } as any"
            >
              Log in
            </FwbButton>
          </div>
        </div>

        <div class="mt-8 lg:mt-0 lg:w-1/2">
          <div class="flex items-center justify-center lg:justify-end">
            <div class="max-w-lg">
              <picture>
                <source srcset="../assets/landing-4.avif" type="image/avif" />
                <source srcset="../assets/landing-4.webp" type="image/webp" />
                <source srcset="../assets/landing-4.jpg" type="image/jpeg" />
                <img
                  class="h-64 w-full rounded-md object-cover object-center shadow"
                  src="../assets/landing-4.jpg"
                  alt=""
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
