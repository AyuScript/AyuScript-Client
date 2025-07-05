

<script setup lang="ts">
import {onMounted, ref} from 'vue';

interface Banner {
  text: string
  slot: number
  duration: number
}

defineProps<{
  banner: Banner
}>();

const progressBar = ref<HTMLDivElement | null>(null);

const startProgress = () => {
  if (progressBar.value) {
    void progressBar.value.offsetWidth;
    requestAnimationFrame(() => {
      progressBar.value!.style.width = '100%';
    })
  }
};
onMounted(() => {
  startProgress();
});
</script>

<template>
  <div
      class="warnBanner"
      :style="{ top: `${banner.slot * 52}px` }"
  >
    {{ banner.text }}
    <transition name="progress">
      <div
          ref="progressBar"
          class="progressBar"
          :style="{ transition: `width ${banner.duration + 1000}ms linear` }"
      ></div>
    </transition>
  </div>
</template>

<style scoped>
.warnBanner {
  position: fixed;
  right: 0;
  width: 300px;
  height: 50px;
  background: rgba(20, 20, 20, 0.85);
  color: white;
  border-radius: 12px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: Ubuntu, sans-serif;
  overflow: hidden;
  justify-content: flex-start;
  box-sizing: border-box;
}

.progressBar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 100%;
  background-color: #2ecc7166;
  mix-blend-mode: lighten;
  z-index: -1;
}
</style>
