<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- modifikasi src/views/HomePage.vue pada bagian ion-content dalam template -->
    <ion-content :fullscreen="true">
      <!-- komponen paling atas dari ion-content -->
      <ion-refresher
        slot="fixed"
        :pull-factor="0.5"
        :pull-min="100"
        :pull-max="200"
        @ionRefresh="handleRefresh($event)"
      >
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- komponen utama di antara 2 komponen ini -->

      <!-- active todos -->
      <div class="scrollable-container">
        <ion-list>
          <ion-item-sliding
            v-for="todo in activeTodos"
            :key="todo.id"
            :ref="(el) => setItemRef(el, todo.id!)"
          >
            <ion-item-options side="start" @ionSwipe="handleDelete(todo)">
              <ion-item-option
                color="danger"
                expandable
                @click="handleDelete(todo)"
              >
                <ion-icon
                  slot="icon-only"
                  :icon="trash"
                  size="large"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>

            <ion-item>
              <ion-card>
                <ion-card-header>
                  <ion-card-title class="ion-text-wrap limited-text">{{
                    todo.title
                  }}</ion-card-title>
                  <ion-card-subtitle class="limited-text">{{
                    todo.description
                  }}</ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                  <ion-badge>{{ getRelativeTime(todo.updatedAt) }}</ion-badge>
                </ion-card-content>
              </ion-card>
            </ion-item>

            <ion-item-options side="end" @ionSwipe="handleStatus(todo)">
              <ion-item-option @click="handleEdit(todo)">
                <ion-icon
                  slot="icon-only"
                  :icon="create"
                  size="large"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
          <ion-item v-if="activeTodos.length === 0" class="ion-text-center">
            <ion-label></ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- completed todos -->
      <!-- komponen paling bawah dari ion-content -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="isOpen = true">
          <ion-icon :icon="add" size="large"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <InputModal
        v-model:isOpen="isOpen"
        v-model:editingId="editingId"
        :todo="todo"
        @submit="handleSubmit"
      />
    </ion-content>
  </ion-page>
</template>

<!-- modifikasi src/views/HomePage.vue import semua komponen yang diperlukan -->
<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonAccordion,
  IonAccordionGroup,
  IonLabel,
  IonList,
  loadingController,
  IonRefresher,
  IonRefresherContent,
  toastController,
} from "@ionic/vue";
import {
  add,
  checkmarkCircle,
  close,
  create,
  trash,
  closeCircle,
  warningOutline,
} from "ionicons/icons";
import InputModal from "@/components/InputModal.vue";
import { onMounted, ref, computed, onUnmounted } from "vue";
import { firestoreService, type Todo } from "@/utils/firestore";
import { formatDistanceToNow } from "date-fns";

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const todos = ref<Todo[]>([]);
const todo = ref<Omit<Todo, "id" | "createdAt" | "updatedAt" | "status">>({
  title: "",
  description: "",
  langkah: "",
});
const activeTodos = computed(() => todos.value.filter((todo) => !todo.status));
const completedTodos = computed(() =>
  todos.value.filter((todo) => todo.status)
);
const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());
let intervalId: any;
const timeUpdateTrigger = ref(0);

// mendapatkan value dari item
const setItemRef = (el: any, id: string) => {
  if (el) {
    itemRefs.value.set(id, el.$el);
  }
};

// toast notifikasi
const showToast = async (
  message: string,
  color: string = "success",
  icon: string = checkmarkCircle
) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: "top",
    icon,
  });
  await toast.present();
};

// mendapatkan perbedaan waktu
const getRelativeTime = (date: any) => {
  timeUpdateTrigger.value;
  try {
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(jsDate, { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

// load data
const loadTodos = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({
      message: "Loading...",
    });
    await loading.present();
  }

  try {
    todos.value = await firestoreService.getTodos();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) {
      await loading.dismiss();
    }
  }
};

// dijalankan setiap halaman diload, load data dan set interval update 1 menit
onMounted(() => {
  loadTodos();
  intervalId = setInterval(() => {
    timeUpdateTrigger.value++;
  }, 60000);
});

// reset interval update
onUnmounted(() => {
  clearInterval(intervalId);
});

// handle swipe refresher
const handleRefresh = async (event: any) => {
  try {
    await loadTodos(false);
  } catch (error) {
    console.error("Error refreshing:", error);
  } finally {
    event.target.complete();
  }
};

// handle submit add/edit pada modal
const handleSubmit = async (
  todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "status">
) => {
  if (!todo.title) {
    await showToast("Title is required", "warning", warningOutline);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateTodo(editingId.value, todo as Todo);
      await showToast("Masakan Berhasil Diedit", "success", checkmarkCircle);
    } else {
      await firestoreService.addTodo(todo as Todo);
      await showToast("Masakan Berhasil Ditambah", "success", checkmarkCircle);
    }
    loadTodos();
  } catch (error) {
    await showToast("An error occurred", "danger", closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

// handle edit click
const handleEdit = async (editTodo: Todo) => {
  const slidingItem = itemRefs.value.get(editTodo.id!);
  await slidingItem?.close();

  editingId.value = editTodo.id!;
  todo.value = {
    title: editTodo.title,
    description: editTodo.description,
    langkah: editTodo.langkah,
  };
  isOpen.value = true;
};

// handle delete click/swipe
const handleDelete = async (deleteTodo: Todo) => {
  try {
    await firestoreService.deleteTodo(deleteTodo.id!);
    await showToast("Masakan Berhasil Dihapus", "success", checkmarkCircle);
    loadTodos();
  } catch (error) {
    await showToast("Masakan Gagal di Hapus", "danger", closeCircle);
    console.error(error);
  }
};
</script>
