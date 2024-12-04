<!-- src/components/InputModal.vue -->
<template>
  <ion-modal :is-open="isOpen" @did-dismiss="cancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editingId ? "Edit" : "Tambah" }} Masakan</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="cancel"
            ><ion-icon :icon="close"></ion-icon
          ></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input
          v-model="todo.title"
          label="Masakan"
          label-placement="floating"
          placeholder="Pizza"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea
          v-model="todo.description"
          label="Deskripsi Masakan"
          label-placement="floating"
          placeholder="Makanan yang berasal dari italia...."
          :autogrow="true"
          :rows="2"
        ></ion-textarea>
      </ion-item>
      <ion-item>
        <ion-textarea
          v-model="todo.langkah"
          label="Langkah-Langkah"
          label-placement="floating"
          placeholder="Langkah Memasak"
          :autogrow="true"
          :rows="4"
        ></ion-textarea>
      </ion-item>
      <ion-row>
        <ion-col>
          <ion-button
            type="button"
            @click="input"
            shape="round"
            color="primary"
            expand="block"
          >
            {{ editingId ? "Edit" : "Tambah" }} Masakan
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>
<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonRow,
  IonCol,
  IonItem,
  IonContent,
  IonTextarea,
} from "@ionic/vue";
import { close } from "ionicons/icons";
import { Todo } from "@/utils/firestore";

const props = defineProps<{
  isOpen: boolean;
  editingId: string | null;
  todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "status">;
}>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
  "update:editingId": [value: string | null];
  submit: [item: Omit<Todo, "id" | "createdAt" | "updatedAt" | "status">];
}>();

const cancel = () => {
  emit("update:isOpen", false);
  emit("update:editingId", null);
  props.todo.title = "";
  props.todo.description = "";
};
const input = () => {
  emit("submit", props.todo);
  cancel();
};
</script>
