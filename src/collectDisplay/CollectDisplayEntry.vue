<script setup lang="ts">
import {ref} from "vue";
import CollectDisplayComponent from "./CollectDisplayComponent.vue";
import MouseNoEffect from "../components/MouseNoEffect.vue";

const showMouse = ref(false);
const showKeyboard = ref(false);
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'n') {
    showKeyboard.value = true;
  }
});
document.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() === 'n') {
    showKeyboard.value = false;
  }
});
</script>

<template>
  <button class="button"
          @mouseenter="showMouse = true"
          @mouseleave="showMouse = false">
    <img class="icon" src="/src/assets/magnet.svg"/>
    <span class="hotkey">[N]</span>
  </button>
  <MouseNoEffect>
    <transition name="fade">
      <CollectDisplayComponent v-show="showMouse || showKeyboard"/>
    </transition>
  </MouseNoEffect>
</template>

<style scoped>
.button {
  position: absolute;
  left: calc(var(--unit) * 0.8);
  bottom: calc(var(--unit) * 21.6);
  width: calc(var(--unit) * 6);
  height: calc(var(--unit) * 6);

  background-color: #3eecf2;
  border: #33bcc1 solid calc(var(--unit) * 0.4);
  color: white;
  font-size: calc(var(--unit) * 1.2);
  font-weight: bolder;
  padding: calc(var(--unit) * 0.5) calc(var(--unit) * 0.5);
  border-radius: calc(var(--unit) * 0.6);
  cursor: pointer;
  transition: filter 0.2s;
}

.button:hover {
  filter: brightness(1.05);
}

.icon {
  color: white;
  width: calc(var(--unit) * 4);
  height: calc(var(--unit) * 4);
}

.hotkey {
  position: absolute;
  left: 62%;
  top: 67%;
  font-size: calc(var(--unit) * 1.25);
  text-shadow:
      0.025em 0 black,
      -0.025em 0 black,
      0 0.025em black,
      0 -0.025em black,
      0.025em 0.025em black,
      -0.025em -0.025em black,
      0.025em -0.025em black,
      -0.025em 0.025em black;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

</style>