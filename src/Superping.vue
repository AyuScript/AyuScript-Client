<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {WebSocketService} from './websocket';
import {showWarnBanner} from './warnBanner';
import {superpingSound} from "./feature/features.ts";

interface SuperPacket {
  content: {
    first: string,
    second: string
  }[]
}
interface OnlinePeoplePacket {
  type: 'onlineppl',
  content: {
    us: number | string,
    eu: number | string,
    as: number | string,
    idk: number | string
  }
}

const { webSocketService } = defineProps<{
  webSocketService: WebSocketService
}>();

const userInfo = ref({
  us: '0',
  eu: '0',
  as: '0',
  unknown: '0'
});

const backgroundColor = ref('rgba(0, 0, 0, 0.5)');
const statusColor = computed(() => webSocketService.isConnected.value ? 'rgb(19, 240, 144)' : 'red');
const superpingContent = ref<Array<{ type: 'separator' } | { type: 'text'; text: string }>>([]);
const superpingList = ref<HTMLElement | null>(null);

webSocketService.subscribe('superpingMessage', (data: SuperPacket) => {
  flashSuperping();
  parseMessages(data.content);
  requestAnimationFrame(() => {
    if (superpingList.value) {
      superpingList.value.scrollTop = superpingList.value.scrollHeight;
    }
  });
});

webSocketService.subscribe('superpingModify', (data: SuperPacket) => {
  parseMessages(data.content);
  requestAnimationFrame(() => {
    if (superpingList.value) {
      superpingList.value.scrollTop = superpingList.value.scrollHeight;
    }
  });
});

webSocketService.subscribe('onlineppl', (data: OnlinePeoplePacket) => {
  const us = data.content.us || '0';
  const eu = data.content.eu || '0';
  const as = data.content.as || '0';
  const unknown = data.content.idk || '0';

  updateUserInfo({
    us: us + '人',
    eu: eu + '人',
    as: as + '人',
    unknown: unknown + '人'
  });
});

/*
webSocketService.subscribeClose((code, _reason) => {
  if (code === 1006) {
    parseMessages('[系统]:与服务器断开连接，可能是在更新或服务器崩溃', 3000);
  }
});
*/

function flashSuperping() {
  if (superpingSound.value) {
    addMessageSound();
  }
  const originalBg = 'rgba(0, 0, 0, 0.5)';
  backgroundColor.value = 'rgba(43,255,163,0.5)';
  setTimeout(() => {
    backgroundColor.value = originalBg;
  }, 500);
}

let audio = new Audio();
audio.preload = 'auto';
function addMessageSound() {
  audio.currentTime = 0.5;
  audio.play().catch(error => {
    console.error('音频播放失败:', error);
  });
}
webSocketService.subscribe('sound', (data) => {
  audio = new Audio(data.content.sound);
  console.log(`已设置音效${audio}`);
  showWarnBanner("superping音效加载完毕", 1000);
})

function parseMessages(messages: {first: string, second: string}[]) {
  superpingContent.value = [];
  messages.forEach(message => {
    superpingContent.value.push({ type: 'text', text: message.first });
    superpingContent.value.push({ type: 'text', text: message.second });
    superpingContent.value.push({ type: 'separator' });
  });
}

function updateUserInfo(data: { us: string; eu: string; as: string; unknown: string }) {
  userInfo.value.us = data.us || userInfo.value.us;
  userInfo.value.eu = data.eu || userInfo.value.eu;
  userInfo.value.as = data.as || userInfo.value.as;
  userInfo.value.unknown = data.unknown || userInfo.value.unknown;
}

onMounted(() => {
  updateUserInfo({
    us: 'idk',
    eu: 'idk',
    as: 'idk',
    unknown: 'idk'
  })
});
</script>

<template>
  <div class="superpingContainer">
    <div class="superping" :style="{ backgroundColor }">
      <div class="title">
        <span class="titleText">super ping</span>
      </div>
      <div ref="superpingList" class="superpingList">
        <div v-for="(item, index) in superpingContent" :key="index">
          <div v-if="item.type === 'separator'" class="separator"></div>
          <div v-else-if="item.type === 'text'" class="textContent">{{ item.text }}</div>
        </div>
      </div>
    </div>

    <div class="rightBox">
      <div>US</div>
      <div>{{ userInfo.us }}</div>
      <div>EU</div>
      <div>{{ userInfo.eu }}</div>
      <div>AS</div>
      <div>{{ userInfo.as }}</div>
      <div>未知</div>
      <div>{{ userInfo.unknown }}</div>
      <div class="statusDot" :style="{ backgroundColor: statusColor }"></div>
    </div>
  </div>
</template>

<style scoped>
.superpingContainer {
  position: fixed;
}
.superping {
  transition: background-color 0.3s ease;
  position: absolute;
  top: 10px;
  left: 10px;
  width: 200px;
  max-height: 180px;
  height: 180px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  line-height: 25px;
  color: white;
  font-family: 'Game', 'Microsoft YaHei', sans-serif;
  padding: 5px 10px 10px;
}
.superpingList {
  overflow-x: visible;
  overflow-y: auto;
  max-width: 200px;
  width: 200px;
  max-height: 160px;
  height: 160px;
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}

.superpingList::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}
.statusDot {
  position: absolute;
  top: 2px;
  right: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
}
.rightBox {
  position: absolute;
  top: 10px;
  left: 230px;
  width: 50px;
  height: 175px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  font-family: 'Game', 'Microsoft YaHei', sans-serif;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 15px;
  text-align: center;
}
.title {
  position: sticky;
  top: 0;
  height: 17px;
  font-size: 12px;
  margin-bottom: 10px;
}
.titleText {
  color: gold;
  font-size: 15px;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgb(0, 0, 0);
}
.textContent {
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  width: 180px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.separator {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin: 2px 0;
}
</style>
