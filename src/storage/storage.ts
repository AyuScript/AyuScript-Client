import {ref, type Ref, watch} from "vue";

const storageName = 'SilentWhisper';

function loadStorage(path: string) {
  const storage = JSON.parse(localStorage.getItem(storageName) ?? '{}');
  if (!storage || !storage[path]) {
    return null;
  }
  return storage[path];
}

function saveStorage(path: string, content: any) {
  const storage = JSON.parse(localStorage.getItem(storageName) ?? '{}');
  storage[path] = content;
  localStorage.setItem(storageName, JSON.stringify(storage));
}

export function useStorage<T>(path: string, defaultValue?: T): Ref<T> {
  const value = ref(loadStorage(path));
  if (value.value === null && defaultValue !== undefined) {
    saveStorage(path, defaultValue);
    value.value = defaultValue;
  }
  watch(value, newValue => {
    saveStorage(path, newValue);
  }, {deep: true});
  return value;
}