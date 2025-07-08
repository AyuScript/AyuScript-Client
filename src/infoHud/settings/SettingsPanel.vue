<script setup lang="ts">

import GoalSettings from "@/infoHud/settings/GoalSettings.vue";
import BasicSettings from "@/infoHud/settings/BasicSettings.vue";
</script>
<template>
  <div class="card">
    <div class="info">
      <BasicSettings/>
      <GoalSettings/>
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
  width: calc(var(--unit) * 40);
  margin: calc(var(--unit) * 0.8);
  font-size: calc(var(--unit) * 1.5);
  pointer-events: auto;
}

.info {
  display: flex;
  width: 100%;
  flex-direction: column;
  text-align: center;
  flex: 1;
}
</style>
