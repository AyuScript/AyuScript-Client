<script setup lang="ts">
import {eventBus} from "@/eventBus.ts";
import {onUnmounted, ref} from "vue";
import {notice} from "@/infoHud/notice/notice.ts";
import {useI18n} from "vue-i18n";
import domtoimage from 'dom-to-image';

const { copyKey } = defineProps<{
  copyKey: string
}>();
const { t } = useI18n();

const element = ref<HTMLDivElement | null>(null);
eventBus.on('copy' + copyKey, async () => {
  if (!element.value) {
    return;
  }
  const scale = 2;
  const blob = await domtoimage.toBlob(element.value, {
    width: element.value.clientWidth * scale,
    height: element.value.clientHeight * scale,
    style: {
      transform: 'scale('+scale+')',
      transformOrigin: 'top left'
    }
  });
  const item = new ClipboardItem({'image/png': blob});
  await navigator.clipboard.write([item]);
  notice(t('notice.copy'));
});
onUnmounted(() => {
  eventBus.off('copy' + copyKey);
});
</script>

<template>
  <div class="copy">
    <div ref="element">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.copy {
  position: absolute;
  opacity: 0;
  overflow: auto;
  width: 10000px;
  height: 10000px;
}
.copy > div {
  position: absolute;
}
</style>