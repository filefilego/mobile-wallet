import { reactive } from 'vue'

const globalState = reactive({
  endpoint: 'http://validator.local:8090/rpc',
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