<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import {useWindowResize} from "../util";
import {eventBus} from "../eventBus";
import {loadFeature, saveFeature, clearFeature} from "../feature/featureStorage";

interface Position {
  left: number;
  top: number;
}

const { storageKey, defaultPosition } = defineProps<{
  storageKey: string;
  defaultPosition: Position;
}>();

const target = ref<HTMLElement | null>(null);
const position = ref<Position>({ left: 0, top: 0 });
let savedPosition: Position | null = null;
let transition = '';

let offsetX = 0;
let offsetY = 0;
let isDragging = false;

const windowSize = useWindowResize();
const windowWidth = windowSize.width;
const windowHeight = windowSize.height;

const applyPosition = (pos: Position) => {
  position.value.left = pos.left;
  position.value.top = pos.top;
};

const resetPosition = () => {
  clearFeature('drag/' + storageKey);
  applyPosition(defaultPosition);
  savedPosition = defaultPosition;
};

eventBus.on('resetPosition', () => {
  resetPosition();
});

const onResize = () => {
  if (savedPosition) {
    applyPosition(savedPosition);
  }
};

const onMouseDown = (e: MouseEvent) => {
  if (!target.value) return;

  e.preventDefault();
  isDragging = true;
  transition = target.value.style.transition;
  target.value.style.transition = 'none';

  const rect = target.value.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging || !target.value) return;

  const left = e.clientX - offsetX;
  const top = e.clientY - offsetY;

  const leftRatio = left / windowWidth.value;
  const topRatio = top / windowHeight.value;

  position.value = { left: leftRatio, top: topRatio };
};

const onMouseUp = () => {
  if (!isDragging || !target.value) return;

  isDragging = false;
  target.value.style.transition = transition;

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);

  savedPosition = { 
    left: position.value.left,
    top: position.value.top
  };
  
  saveFeature('drag/' + storageKey, JSON.stringify(savedPosition));
};

const handleMouseDown = (e: MouseEvent) => {
  onMouseDown(e);
};

onMounted(() => {
  if (target.value) {
    transition = target.value.style.transition;

    const saved = loadFeature('drag/' + storageKey);
    if (saved) {
      try {
        savedPosition = JSON.parse(saved);
        applyPosition(savedPosition!);
      } catch (e) {
        console.warn('Failed to parse saved position:', e);
        resetPosition();
      }
    } else {
      applyPosition(defaultPosition);
    }
  }

  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div
      ref="target"
      class="draggable"
      :style="{ left: `${position.left * windowWidth}px`, top: `${position.top * windowHeight}px` }"
      @mousedown="handleMouseDown"
      role="none"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.draggable {
  position: absolute;
  cursor: move;
}
</style>
