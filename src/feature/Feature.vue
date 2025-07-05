<script setup lang="ts">
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {useFeatureGroups} from "./featureGroupRegistry.ts";
import FeatureGroup from "./FeatureGroup.vue";
import {menuKey} from "./features.ts";
import {useWindowResize} from "../util.ts";
import type {FeatureSetting} from "./featureTypes.ts";

const visible = ref(false);
const selectedGroupId = ref<string | null>(null);
const featureGroups = useFeatureGroups();
const {width, height} = useWindowResize();
const scale = computed(() => {
  const [baseWidth, baseHeight] = [800, 450];
  const safeWidth = width.value * 0.98;
  const safeHeight = height.value * 0.98;
  const widthRatio = safeWidth / baseWidth;
  const heightRatio = safeHeight / baseHeight;
  let scale = Math.min(widthRatio, heightRatio);
  scale = Math.max(scale, 0.5);
  scale *= 0.6;
  return scale;
});

function toggleModal() {
  visible.value = !visible.value;
  if (visible.value && featureGroups.value.length > 0) {
    selectedGroupId.value = featureGroups.value[0].id;
  }
}

const selectedGroup = computed(() =>
    featureGroups.value.find(group => group.id === selectedGroupId.value)
);

function handleKeydown(e: KeyboardEvent) {
  if (e.code === menuKey.value) {
    e.preventDefault();
    toggleModal();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div :class="['main-container', {closed: !visible}]" :style="{'--scale': scale}">
    <div class="header">
      更好的florr插件(使用{{ menuKey }}键来开关此界面)
      <button class="minimize-btn" @click="toggleModal">&minus;</button>
    </div>
    <div class="navigation">
      <button
          v-for="group in featureGroups"
          :key="group.position"
          :class="['nav-button', { active: selectedGroupId === group.id }]"
          @click="selectedGroupId = group.id"
      >
        {{ group.title || group.id }}
      </button>
    </div>
    <div class="scrolls">
      <template v-if="selectedGroup?.type == 'settings'">
        <FeatureGroup :key="selectedGroup.id" :settings="selectedGroup.settings as unknown as FeatureSetting[]" :save-key="selectedGroup.id"/>
      </template>
      <template v-if="selectedGroup?.type == 'component'">
        <component :is="selectedGroup.component" v-bind="selectedGroup.props"/>
      </template>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  --scale: ;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(var(--scale));
  transform-origin: center;
  width: 800px;
  height: 450px;
  background: var(--background);
  border: 2px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  display: grid;
  grid-template:
        "header header header" 80px
        "nav scrolls scrolls" minmax(0, 1fr)
        / 160px 1fr 140px;
  color: var(--text);
  z-index: 2147483647;
  opacity: 1;
  pointer-events: auto;
  transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.2s ease;
}

.main-container.closed {
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
}

@keyframes button-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.header {
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border);
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: 0.8px;
  user-select: none;
  cursor: default;
  position: relative;
}

.navigation {
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--primary) rgba(255,255,255,0.1);
  grid-area: nav;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 15px;
  border-right: 1px solid var(--border);
  outline: none;
  box-shadow: none;
}

.scrolls {
  overflow-y: auto;
  grid-area: scrolls;
  scrollbar-width: thin;
  scrollbar-color: var(--primary) rgba(255,255,255,0.1);
  display: flex;
  flex-direction: row;
  width: 100%;
}

.main-content {
  flex: 1;
  grid-area: main;
  padding: 25px 20px;
  overflow-y: scroll;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100% - 50px);
  scrollbar-width: none;
}

.main-content::-webkit-scrollbar {
  display: none;
}

.scrolls.credit-mode .main-content {
  scrollbar-width: thin;
  scrollbar-color: var(--primary) rgba(255,255,255,0.1);
}

.controls {
  overflow-y: scroll;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--primary) rgba(255,255,255,0.1);
  grid-area: aside;
  padding: 25px 20px;
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100% - 50px);
}

.nav-button {
  padding: 16px 20px;
  background: rgba(255,255,255,0.05);
  border: none;
  border-radius: 10px;
  color: var(--text);
  font-size: 1.1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: rgba(255,255,255,0.1);
}

.nav-button.active {
  outline: none;
  box-shadow: none;
  background: var(--primary);
  color: #fff;
}

.minimize-btn {
  position: absolute;
  right: 20px;
  background: none;
  border: none;
  color: var(--text);
  font-size: 2rem;
  cursor: pointer;
  padding: 0 10px;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  box-shadow: none;
}

.minimize-btn:hover {
  opacity: 0.8;
  outline: none;
  box-shadow: none;
}
</style>
