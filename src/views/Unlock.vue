<template>
  <div>
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
              <span style="color: #fff; font-size: 30px;">Unlock your wallet:</span>
          </div>
          <div style="margin-top:2px;">
              <span style="color: #fff; font-size: 25px; font-weight: bold;">FILEFILEGO</span>
          </div>
    </div>
    <div style="margin-top:20px; padding:20px;">
      <div style="border: 1px solid #dbdbdb; border-radius: 4px; padding:20px;">
        <strong style="margin-top:20px;">Address</strong>
        <br />
          <span>{{ address }}</span>
          <br /><br />
          <ion-input v-model="password1" label="Password" label-placement="floating" fill="outline" placeholder="Enter your password" type="password"></ion-input>
          <br />
          <ion-button @click="unlock" fill="outline" style="font-weight:bold; width:100%; height:50px; --border-color: #3e15ca; background-color: #3e15ca; color: white;"> 
            Unlock
            <ion-icon slot="end" :icon="keyOutline"></ion-icon>
          </ion-button>
          <br /> <br />
          <strong style="margin-top:20px;">Important</strong>
          <p> <ion-text color="danger"><ion-icon :icon="warning"></ion-icon> Your wallet will be open for 24 hours, and then you will need to enter your password again to continue using it.</ion-text></p>
        </div>
    </div>
  </div>
  </template>
  
  <script>
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg, IonInput, IonButton, IonIcon, IonText, IonAlert, alertController} from '@ionic/vue';
  import { GetKeyFromStorage, UnlockKey, SaveUnlockedKeyToStorage } from "../key.js"
  import { keyOutline, warning } from 'ionicons/icons';
  import { unlockKey } from '../store';

  export default {
    components: {
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
    methods: {
      async unlock() {
        if (this.password1 == "") {
          this.presentAlert("Passwords is empty", "Please provide your password");
          return;
        }
        
        try {
            let keyStr = await GetKeyFromStorage();
            let keyJSON = JSON.parse(keyStr);
            const privateKey = await UnlockKey(keyJSON, this.password1)
            let unlockedKey = {
              address: keyJSON.address,
              privateKey: privateKey,
              unlockedTime: Math.floor(Date.now() / 1000)
            }
            unlockKey(unlockedKey);
            await SaveUnlockedKeyToStorage(JSON.stringify(unlockedKey))
            this.$router.replace("/home")
        } catch (e) {
          this.presentAlert("Error", "Failed to unlock key: "+ e.message);
        }
      },
    },
    mounted() {
      if("import" in this.$route.query){
        this.presentAlert("Success", "Your wallet key was successfully imported. Please unlock it using the password used when created.");
      }
    },
    async setup() {
      let keyStr = await GetKeyFromStorage();
      if (keyStr == "") {
        return
      }

      let jsonKey = JSON.parse(keyStr)
      const presentAlert = async (subHeader, message) => {
          const alert = await alertController.create({
            header: '',
            subHeader: subHeader,
            message: message,
            buttons: ['OK'],
          });
  
          await alert.present();
      };    

      return {
        address: jsonKey.address,
        keyOutline,
        warning,
        password1: "",
        presentAlert
      }
    }
  }
  </script>
  <style scoped>
  </style>
  