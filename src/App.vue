<template>
  <ion-app>
    <ion-menu content-id="main-content">
        <ion-content id="menu-content">
            <div style="position: absolute; left: 15px; z-index: 1000000; top: 15px;">
                <ion-menu-toggle>
                    <ion-icon size="large" style="cursor: pointer; color: #fff; " :icon="closeOutline"></ion-icon>
                </ion-menu-toggle>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <img style="height: 72px; background-color: white; width: 72px; border-radius: 50%;" src="/assets/icon.png" />
            </div>
            <div style="margin-top:80px;">
                <ion-menu-toggle>
                    <router-link to="/home">
                        <div class="menu-item" style="height:80px; color:#fff; text-align: center;">
                            <ion-icon size="large" style="cursor: pointer; color: #fff; margin-top: 12px;" :icon="walletOutline"></ion-icon>
                            <br />
                            <span style="color: #fff; font-size: 16px;">Wallet</span>
                        </div>
                    </router-link>
                </ion-menu-toggle>
                <!-- <div class="menu-item" style="height:80px; color:#fff; text-align: center;">
                    <ion-icon size="large" style="cursor: pointer; color: #fff; margin-top: 12px;" :icon="appsOutline"></ion-icon>
                    <br />
                    <span style="color: #fff; font-size: 16px;">Channels</span>
                </div> -->
                <ion-menu-toggle>
                    <router-link to="/settings">
                        <div class="menu-item" style="height:80px; color:#fff; text-align: center;">
                            <ion-icon size="large" style="cursor: pointer; color: #fff; margin-top: 12px;" :icon="settingsOutline"></ion-icon>
                            <br />
                            <span style="color: #fff; font-size: 16px;">Settings</span>
                        </div>
                    </router-link>
                </ion-menu-toggle>

            </div>
        </ion-content>
    </ion-menu>
    <ion-page>
         <ion-content id="main-content" :fullscreen="true">
            <Suspense>
            <router-view ></router-view>
            </Suspense>
        </ion-content>
    </ion-page>
  </ion-app>
</template>
<script>
import { IonIcon, IonApp, IonPage, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuToggle, IonButton} from '@ionic/vue';
import { closeOutline, walletOutline, appsOutline, settingsOutline } from 'ionicons/icons';

export default {
    components: {
        IonPage,
        IonApp,
        IonMenu,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonMenuToggle,
        IonButton,
        IonIcon
    },
    setup() {
        return {
            closeOutline,
            walletOutline,
            appsOutline,
            settingsOutline
        }
    }
}
</script>
<style>
.router-link-active .menu-item {
    background: #1b004c !important;  
}

#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 5%;
  /* transform: translateY(-50%); */
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}

.area{
    background: #4e54c8;  
    background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);  
    width: 100%;
}

.circles{
    padding: 0px; margin: 0px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 283px;
    overflow: hidden;
}

.circles li{
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    animation: animate 25s linear infinite;
    bottom: -150px;
    
}

.circles li:nth-child(1){
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
}


.circles li:nth-child(2){
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
}

.circles li:nth-child(3){
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
}

.circles li:nth-child(4){
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
}

.circles li:nth-child(5){
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
}

.circles li:nth-child(6){
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
}

.circles li:nth-child(7){
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
}

.circles li:nth-child(8){
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
}

.circles li:nth-child(9){
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
}

.circles li:nth-child(10){
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
}



@keyframes animate {

    0%{
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
    }

    100%{
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
    }

}

#menu-content {
  --ion-background-color: #23025f; /* set your desired background color here */
}

#menu-content a {
    text-decoration: none;
}
</style>