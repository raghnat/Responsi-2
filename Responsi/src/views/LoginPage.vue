<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <!-- Title -->
        <ion-text style="margin-bottom: 20px; text-align: center">
          <ion-card>
            <img
              alt="Silhouette of mountains"
              src="../components/images/banner.png"
            />
            <ion-card-header>
              <ion-card-title>Resep Remy Untuk Dunia</ion-card-title>
            </ion-card-header>
          </ion-card>
        </ion-text>

        <!-- Button Sign In -->
        <ion-button @click="login" color="light">
          <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
          <ion-label>Sign In with Google</ion-label>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonText,
  IonLabel,
} from "@ionic/vue";
import { logoGoogle } from "ionicons/icons";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const login = async () => {
  await authStore.loginWithGoogle();
};
</script>

<style>
img {
  width: auto;
  height: 200px;
}
#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

ion-button {
  --border-radius: 8px;
}
</style>
