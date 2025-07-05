<script setup lang="ts">
interface Notice {
  text: string
  slot: number
  duration: number
}

defineProps<{
  content: Notice
}>();
</script>
<template>
  <div class="card">
    <div class="info">
      <span class="infoText">
        {{ content.text }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  border-radius: calc(var(--unit) * 0.6);
  padding: calc(var(--unit) * 1);
  width: calc(var(--unit) * 25);
  margin: calc(var(--unit) * 0.8);
  font-size: calc(var(--unit) * 1.5);
}

.info {
  display: flex;
  width: 100%;
  flex-direction: column;
  text-align: center;
  flex: 1;
}
.infoText {
  width: 100%;
}
</style>
