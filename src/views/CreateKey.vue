<template>
      <div>
        <!-- <div style="position: absolute; left: 15px; z-index: 1000000; top: 15px;">
                <ion-menu-toggle>
                    <ion-icon size="large" style="cursor: pointer; color: #fff; " :icon="menuOutline"></ion-icon>
                </ion-menu-toggle>
            </div> -->
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
                  <span style="color: #fff; font-size: 30px;">Create Your Wallet Key</span>
              </div>
              <div style="margin-top:2px;">
                  <span style="color: #fff; font-size: 25px; font-weight: bold;">FILEFILEGO</span>
              </div>
        </div>
        <div style="margin-top:20px; padding:20px;">
            <div style="border: 1px solid #dbdbdb; border-radius: 4px; padding:20px;">
              <ion-input v-model="password1" label="Password" label-placement="floating" fill="outline" placeholder="Enter your password" type="password"></ion-input>
              <br />
              <ion-input v-model="password2" label="Confirm Password" label-placement="floating" fill="outline" placeholder="Enter your password" type="password"></ion-input>
              <br />
              <ion-button @click="createKey" fill="outline" style="font-weight:bold; width:100%; height:50px; --border-color: #3e15ca; background-color: #3e15ca; color: white;"> 
                Create Key
                <ion-icon slot="end" :icon="keyOutline"></ion-icon>
              </ion-button>

              <br /> <br />
              <strong style="margin-top:0px;">Or import key:</strong>
              <br />
              <br />
            
              <ion-button @click="openFileSelector" fill="outline" style="font-weight: bold; width: 100%; height: 50px; --border-color: #dddddd; background-color: rgb(255 255 255); color: black;"> 
                Import Key
              </ion-button>
           

              <br /> <br />
              <strong style="margin-top:20px;">Important</strong>
              <p> <ion-text color="danger"><ion-icon :icon="warning"></ion-icon> Please don't forget your password! If you do, you won't be able to access your account and your coins will be lost.</ion-text></p>
            </div>
        </div>

        <ion-modal :is-open="isOpen" ref="modalSave" @willDismiss="onWillDismiss">
            <ion-header>
                <ion-toolbar style="--background: #3e15ca;">
                <ion-title style="color: white;">Save your key</ion-title>
                <!-- <ion-buttons style="color: white;" slot="end">
                    <ion-button @click="cancelSave()">Cancel</ion-button>
                </ion-buttons> -->
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <!-- <div class="area" style="padding-bottom: 12px; padding-top: 21px; background-color: rgb(62, 21, 202); text-align: center;">
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
                        <span style="color: #fff; font-size: 30px;">Wallet Address</span>
                    </div>
                    <div style="margin-top:2px;">
                    </div>
                </div> -->
               
                <div style="border: 1px solid #dbdbdb; border-radius: 4px; padding:20px;">
                <!-- <ion-input readonly v-model="receiveAddress" label="Your Address" label-placement="floating" fill="outline" type="text"></ion-input> -->
                <strong style="margin-top:20px;">Please backup your wallet key file NOW!</strong>
                <br /> <br />
                
                <ion-button @click="saveAsFile" fill="outline" style="font-weight:bold; width:100%; height:50px; --border-color: #3e15ca; background-color: #3e15ca; color: white;"> 
                  Save wallet key
                </ion-button>
                
                <br /> <br />
                <strong style="margin-top:20px;">Important</strong>
                <p> <ion-text color="danger"><ion-icon :icon="warning"></ion-icon> Please don't forget your password and backup your wallet key file! The data of this application could be wiped out which would make it impossible to recover your coins.</ion-text></p>

                <br /> <br />
                <ion-checkbox v-model="confirm1" labelPlacement="end">Confirm wallet key is saved.</ion-checkbox>
                <br />
                <ion-checkbox v-model="confirm2" labelPlacement="end">Confirm i remember the password.</ion-checkbox>

                <br /> <br />

                <ion-button @click="goToUnlock" :disabled="confirmed" fill="outline" style="font-weight:bold; width:100%; height:50px; --border-color: #000; background-color: #000; color: white;"> 
                  Confirm and continue
                </ion-button>
                
               
              </div>
            </ion-content>
        </ion-modal>

      </div>
</template>

<script>
import { IonCheckbox, IonModal, IonButtons, IonMenuToggle,IonGrid, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg, IonInput, IonButton, IonIcon, IonText, IonAlert, IonCol, IonRow, alertController, IonItem, IonLabel, IonList, IonListHeader} from '@ionic/vue';
import {GenerateKey, SaveKeyToStorage, GetKeyFromStorage, UnlockKey, SignTransaction} from "../key.js"
import { menuOutline, keyOutline, warning, arrowDownCircleOutline, paperPlaneOutline } from 'ionicons/icons';
import { Browser } from '@capacitor/browser';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export default {
  components: {
      IonCheckbox,
      IonModal,
      IonButtons,
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
      IonAlert,
      IonCol,
      IonRow,
      IonGrid,
      IonItem, 
      IonLabel, 
      IonList, 
      IonListHeader
  },
  data() {
      return {
        isOpen: false,
        confirm1: false,
        confirm2: false,
        confirmed: true
      };
  },
  watch: {
    confirm1(newVal) {
     this.confirm1 = newVal;
     if (this.confirm1 && this.confirm2) {
      this.confirmed = false;
     }else {
      this.confirmed = true;
     }
    },
    confirm2(newVal) {
      this.confirm2 = newVal;
      if (this.confirm1 && this.confirm2) {
      this.confirmed = false;
     }else {
      this.confirmed = true;
     }
    }
  },
  methods: {
    generateFilename(address) {
      const ts = new Date()
      return `UTC--${this.toISO8601(ts)}--${address}.json`;
    },

    toISO8601(ts) {
      const tzOffset = ts.getTimezoneOffset();
      const absTzOffset = Math.abs(tzOffset);
      const tzHours = Math.floor(absTzOffset / 60);
      const tzMinutes = absTzOffset % 60;
      const tzSign = tzOffset < 0 ? '-' : '+';
      return `${ts.getUTCFullYear()}-${this.padZero(ts.getUTCMonth() + 1)}-${this.padZero(ts.getUTCDate())}T${this.padZero(ts.getUTCHours())}-${this.padZero(ts.getUTCMinutes())}-${this.padZero(ts.getUTCSeconds())}.${this.padZero(ts.getUTCMilliseconds(), 3)}${tzSign}${this.padZero(tzHours)}:${this.padZero(tzMinutes)}`;
    },

    padZero(num, len = 2) {
      return num.toString().padStart(len, '0');
    },
    async saveAsFile() {
      try {
        let fileContents = await GetKeyFromStorage();
        if(!fileContents) {
          return;
        }
        let jsonKey = JSON.parse(fileContents);
        let fileName = this.generateFilename(jsonKey.address);
        const resultWrite = await Filesystem.writeFile({
          path:  "filefilegowalletkey.json",
          data: fileContents,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });

        this.presentAlert("Success", "Your wallet key was saved in: "+ resultWrite.uri);
      } catch (e) {
        this.presentAlert("Error", "There might be already a wallet key stored, please delete manually if you want to create a new wallet key. Error: "+ e.message);
      }
    },
    goToUnlock() {
      if(!this.confirmed) {
        this.isOpen = false;
        this.$router.push("/unlock")
      }
    },
    openFileSelector() {
      let that = this;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json'; // add any desired file types

      // For cross-browser compatibility
      const clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('click', true, true);
      input.dispatchEvent(clickEvent);

      input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        // handle the selected file here
        const reader = new FileReader();
        reader.onload = async function(event) {
          const fileContent = event.target.result;
          const jsonObject = JSON.parse(fileContent);
          await SaveKeyToStorage(JSON.stringify(jsonObject))
          that.$router.push("/unlock?import=true");
        };
        reader.readAsText(file);
      });
    },
    cancelSave() {
      this.$refs.modalSave.$el.dismiss(null, 'cancel');
    },
    onWillDismiss(ev) {
      if (ev.detail.role === 'confirm') {
      // this.message = `${ev.detail.data}!`;
      }
    },
    setOpen(isOpen) {
        this.isOpen = isOpen;
    },
    async createKey() {
      if (this.password1 != this.password2) {
        this.presentAlert("Passwords do not match", "Please make sure password confirmation is same as the password.");
        return;
      }

      if (this.password1 == "") {
        this.presentAlert("Password is empty", "Please make sure password is not empty.");
        return;
      }

      try {
        const keyfile = await GenerateKey(this.password1);
        let keyStr = JSON.stringify(keyfile.jsonKey)
        await SaveKeyToStorage(keyStr)
        this.setOpen(true);
      } catch (e) {
        this.presentAlert("Error", "Failed to create key: "+ e.message);
      }
    },
  },

  async setup() {
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
      keyOutline,
      menuOutline,
      warning,
      password1: "",
      password2: "",
      presentAlert
    }
  }
}




</script>

<style scoped>
  ion-checkbox {
    --size: 24px;
    --checkbox-background-checked: #3e15ca;
  }
  
  ion-checkbox::part(container) {
    border-radius: 6px;
    border: 2px solid #3e15ca;
  }
</style>
