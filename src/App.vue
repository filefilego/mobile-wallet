<template>
  <ion-app>
    <Suspense>
      <router-view></router-view>
    </Suspense>
  </ion-app>
</template>
<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
