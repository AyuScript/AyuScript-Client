import {ref} from "vue";

export function getPlayerId() {
  return localStorage.cp6_player_id || 'unknown';
}

export function getPlayerName() {
  return atob(localStorage['cached_account_data']).split('\x00')[3];
}

export const currentServerInfo = ref({region: '', map: '', serverId: ''});