import { reactive } from 'vue'

const globalState = reactive({
  endpoint: 'https://rpc.filefilego.com/rpc',
  address: "",
  privateKey: "",
  unlockedTime: null
})

export {
    globalState
}

export function unlockKey(key) {
  globalState.address = key.address;
  globalState.privateKey = key.privateKey;
  globalState.unlockedTime = key.unlockedTime;
}