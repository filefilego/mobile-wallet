<template>
    <div>
        <div style="position: absolute; left: 15px; z-index: 1000000; top: 15px;">
          <ion-menu-toggle>
              <ion-icon size="large" style="cursor: pointer; color: #fff; " :icon="menuOutline"></ion-icon>
          </ion-menu-toggle>
        </div>
        <div class="area" style="padding-bottom: 12px; padding-top: 21px; background-color: rgb(62, 21, 202); text-align: center;">
            <ul class="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <div>
              <img style="height: 72px; background-color: white; width: 72px; border-radius: 50%;" src="/assets/icon.png" />
            </div>
            <div style="margin-top:2px;">
                <span style="color: #fff; font-size: 30px;">Settings</span>
            </div>
            <div style="margin-top:2px;">
                <span style="color: #fff; font-size: 25px; font-weight: bold;">FILEFILEGO</span>
            </div>
      </div>
      <div style="margin-top:20px; padding:20px;">
        <div style="border: 1px solid #dbdbdb; border-radius: 4px; padding:20px;">
          <strong style="margin-top:20px;">Remote node address settings</strong>
            <br /><br />
            <ion-input v-model="endpoint" label="Endpoint" label-placement="floating" fill="outline" placeholder="Enter JSONRPC endpoint" type="text"></ion-input>
            <br />
            <ion-button fill="outline" style="font-weight:bold; width:100%; height:50px; --border-color: #3e15ca; background-color: #3e15ca; color: white;"> 
              Save
            </ion-button>
            <br /> <br />
            <strong style="margin-top:20px;">Important</strong>
            <p> <ion-text color="danger"><ion-icon :icon="warning"></ion-icon> If you edit the endpoint to a custom JSONRPC endpoint, please make sure its in a correct format and accessible.</ion-text></p>
          
          </div>
      </div>
    </div>
    </template>
    
    <script>
    import { IonMenuToggle, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg, IonInput, IonButton, IonIcon, IonText, IonAlert, alertController} from '@ionic/vue';
    import { GenerateKey, SaveKeyToStorage, GetKeyFromStorage, UnlockKey, SignTransaction } from "../key.js"
    import { menuOutline, keyOutline, warning } from 'ionicons/icons';
    import { ref } from 'vue';
    import { globalState, unlockKey } from '../store';

    export default {
      components: {
        IonMenuToggle,
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonImg,
        IonInput,
        IonButton,
        IonIcon,
        IonText,
        IonAlert
      },
      methods: {},
    
      async setup() {
        const endpoint = ref(globalState.endpoint);
        return {
          endpoint: endpoint,
          menuOutline,
          keyOutline,
          warning,
        }
      }
    }
    </script>
    <style scoped>
    </style>
    