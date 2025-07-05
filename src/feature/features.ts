import {ref} from "vue";
import {registerFeatureGroup} from "./featureGroupRegistry.ts";
import {eventBus} from "../eventBus.ts";
import {clearFeature} from "./featureStorage.ts";

export const superpingOpen = ref(false);
export const superpingSound = ref(false);
registerFeatureGroup({
  id: 'infoHud',
  title: 'InfoHud',
  type: 'settings',
  settings: [
    {
      id: 'open',
      name: '打开SuperPing窗口',
      value: superpingOpen,
      type: 'boolean',
      default: false
    },
    {
      id: 'sound',
      name: '声音提醒',
      value: superpingSound,
      type: 'boolean',
      default: false
    }
  ],
  position: 0
});

export const chatOpen = ref(false);
export const chatInputMethod = ref('inGame');
registerFeatureGroup({
  id: 'chat',
  title: '聊天',
  type: 'settings',
  settings: [
    {
      id: 'open',
      name: '打开聊天功能',
      value: chatOpen,
      type: 'boolean',
      default: false
    },
    /*
    {
      id: 'inputMethod',
      name: '允许在florr聊天内直接输入',
      value: chatInputMethod,
      type: 'enum',
      default: 'inGame',
      options: [
        {
          id: 'inGame',
          name: '游戏内输入'
        },
        {
          id: 'popup',
          name: '窗口输入'
        }
      ]
    }
    */
  ],
  position: 1
});

export const serverCodeOpen = ref(false);
export const switchServerKey = ref('`');
registerFeatureGroup({
  id: 'server',
  title: '服务器',
  type: 'settings',
  settings: [
    {
      id: 'codeOpen',
      name: '打开服号查询',
      value: serverCodeOpen,
      type: 'boolean',
      default: false
    },
    {
      id: 'switchKey',
      name: '换服按键',
      value: switchServerKey,
      type: 'keyBind',
      default: 'Backquote'
    }
  ],
  position: 2
});

export const healthAndShield = ref(false);
export const effectTime = ref(false);
export const petalCd = ref(false);
export const cdAnimationChange = ref(false);
export const peopleCount = ref(false);
export const dropProbability = ref(false);
export const compassOrigin = ref(false);
export const collectOpen = ref(false);
registerFeatureGroup({
  id: 'game',
  title: '游戏辅助',
  type: 'settings',
  settings: [
    {
      id: 'healthAndShield',
      name: '血量+护盾百分比显示',
      value: healthAndShield,
      type: 'boolean',
      default: false
    },
    {
      id: 'effectTime',
      name: '状态效果进度显示',
      value: effectTime,
      type: 'boolean',
      default: false
    },
    {
      id: 'petalCd',
      name: '花瓣cd百分比显示',
      value: petalCd,
      type: 'boolean',
      default: false
    },
    {
      id: 'cdAnimationChange',
      name: '花瓣冷却动画修改',
      value: cdAnimationChange,
      type: 'boolean',
      default: false
    },
    {
      id: 'peopleCount',
      name: '周围人数统计',
      value: peopleCount,
      type: 'boolean',
      default: false
    },
    {
      id: 'dropProbability',
      name: '掉落概率计算',
      value: dropProbability,
      type: 'boolean',
      default: false,
      enabled: peopleCount
    },
    {
      id: 'compassOrigin',
      name: '指南针溯源',
      value: compassOrigin,
      type: 'boolean',
      default: false
    },
    {
      id: 'collect',
      name: '收集物品展示',
      value: collectOpen,
      type: 'boolean',
      default: false
    }
  ],
  position: 3
});

export const menuKey = ref('AltLeft');
registerFeatureGroup({
  id: 'other',
  title: '其他',
  type: 'settings',
  settings: [
    {
      id: 'menuKey',
      name: '设置菜单按键',
      value: menuKey,
      type: 'keyBind',
      default: 'AltLeft'
    },
    {
      id: 'resetPositions',
      name: '重置窗口位置',
      type: 'button',
      buttonText: '重置',
      function: () => {
        clearFeature('drag/Superping');
        clearFeature('drag/Chat');
        clearFeature('drag/ServerCode');
        eventBus.emit('resetPosition');
      }
    }
  ],
  position: 10000
});