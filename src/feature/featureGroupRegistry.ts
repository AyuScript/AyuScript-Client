import {ref} from 'vue'
import type {FeatureSettingsGroup} from './featureTypes'
import {loadFeature} from "./featureStorage.ts";

const featureGroups = ref<FeatureSettingsGroup[]>([]);

export function registerFeatureGroup(group: FeatureSettingsGroup) {
  if (group.type == 'settings') {
    group.settings.forEach(setting => {
      if (!setting.value) {
        return;
      }
      setting.value.value = loadFeature(group.id + '/' + setting.id, setting.default);
    })
  }
  const index = featureGroups.value.findIndex(g => g.id === group.id);
  if (index !== -1) {
    featureGroups.value[index] = group as typeof featureGroups.value[number];
  } else {
    featureGroups.value.push(group as typeof featureGroups.value[number]);
  }
}

export function useFeatureGroups() {
  return featureGroups;
}
