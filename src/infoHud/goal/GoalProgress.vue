<script setup lang="ts">
import { computed } from 'vue';

const { value1, value2, value3, colors } = defineProps<{
  value1: number
  value2: number
  value3: number
  colors: string[]
}>();

const visibleSegments = computed(() => {
  const values = [value1, value2, value3];
  const result = [];
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    const available = Math.min(100 - total, values[i]);
    if (available > 0) {
      result.push({
        width: available,
        color: colors[i]
      });
      total += available;
    }
    if (total >= 100) {
      break;
    }
  }
  return result;
})

const remaining = computed(() => {
  const used = visibleSegments.value.reduce((sum, s) => sum + s.width, 0);
  return Math.max(0, 100 - used);
});
console.log(visibleSegments.value);
</script>

<template>
  <div class="bar">
    <div
        class="progress"
        v-for="(segment, index) in visibleSegments"
        :key="index"
        :style="{ width: segment.width + '%', backgroundColor: segment.color }"
    />
    <div
        class="progress"
        v-if="remaining > 0"
        :style="{ width: remaining + '%', backgroundColor: '#00000033' }"
    />
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  height: calc(var(--unit) * 0.8);
}
.progress {
  transition: width 0.3s ease;
}
</style>
