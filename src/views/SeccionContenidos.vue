<template>
    <ion-page v-if="!contentStore.loading">
        <ion-content class="ion-padding content-screen" >
            <div class="content-shell">
                <ion-card class="content-card">
                    <ion-card-header class="content-header">
                        <ion-card-title class="content-title">{{ contentStore.content.contenido.name || 'Contenido' }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content class="content-body">
                        <div class="content-html" v-html="contentStore.content.contenido.contenido"></div>
                        <div class="video-container" v-if="contentStore.content.contenido.youtube">
                            <iframe 
                                width="560" 
                                height="315" 
                                :src="'https://www.youtube.com/embed/'+contentStore.content.contenido.youtube.replace('https://youtu.be/','')" 
                                title="YouTube video player" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </ion-card-content>
                </ion-card>
            </div>

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button color="tertiary" @click="handleAvatarCapture" aria-label="Cambiar avatar">
                    <ion-icon :icon="cameraOutline"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
        <ion-footer :translucent="true">
            <ion-toolbar>
                <ion-button class="nav-button" slot="start" fill="solid" size="small" @click="anterior()" v-if="previousItem?.url">Anterior</ion-button>
                <ion-button class="nav-button" slot="end" fill="solid" size="small" @click="siguiente()" v-if="contentStore.next.url">Siguiente</ion-button>
            <ion-progress-bar v-if="contentStore.loading" type="indeterminate"></ion-progress-bar>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>
<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { IonPage, IonToolbar, IonContent, IonFooter, IonButton, IonProgressBar, IonButtons,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
import { useUserStore } from '@/stores/user';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { cameraOutline } from 'ionicons/icons';
const route = useRoute(); 
const contentStore = useContentStore();
const userStore = useUserStore();
const router = useRouter();
const previousItem = ref<MenuItem | null>(null);

type MenuItem = {
  id: number | null;
  url: string | null;
  internal_name: string;
  active?: string;
};

const currentName = computed(() => typeof route.params.name === 'string' ? route.params.name : '');

function updateNext() {
  const items = contentStore.menu.flatMap((group: { sub?: MenuItem[] }) => group.sub || []);
  const currentIndex = items.findIndex((item) => item.internal_name === currentName.value);
  const nextItem = currentIndex >= 0 ? items[currentIndex + 1] : null;
  contentStore.$setNext(nextItem || null);
  previousItem.value = currentIndex > 0 ? items[currentIndex - 1] : null;
}

function activateNextItem() {
  const updatedMenu = contentStore.menu.map((group: { sub?: MenuItem[] }) => ({
    ...group,
    sub: (group.sub || []).map((item) => ({
      ...item,
      active: item.id === contentStore.next.id ? 'yes' : item.active,
    })),
  }));

  contentStore.$setMenu(updatedMenu);
}

async function siguiente(){
    if(contentStore.next.url && contentStore.next.internal_name){
        activateNextItem();
        await contentStore.$getContent(contentStore.next.internal_name);
        await contentStore.$seteaSiguiente();
        await router.push('/' + contentStore.next.url);
    }
}

async function anterior(){
    if(previousItem.value?.url && previousItem.value?.internal_name){
        await contentStore.$getContent(previousItem.value.internal_name);
        await router.push('/' + previousItem.value.url);
    }
}

async function handleAvatarCapture() {
  try {
    const image = await Camera.getPhoto({
      quality: 85,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    const dataUrl = await photoToDataUrl(image);
    if (dataUrl) {
      userStore.setAvatar(dataUrl);
    }
  } catch (error) {
    console.warn('No se pudo actualizar el avatar', error);
  }
}

async function photoToDataUrl(image: { webPath?: string | null; dataUrl?: string | null; path?: string | null }) {
  if (image.dataUrl) return image.dataUrl;
  if (!image.webPath) return null;

  try {
    const response = await fetch(image.webPath);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('No se pudo convertir la imagen a base64', error);
    return null;
  }
}

watch([() => contentStore.menu, currentName], () => {
  updateNext();
}, { deep: true, immediate: true });
</script>
<style scoped>


.content-screen {
  --background: var(--app-background);
}

.content-shell {
  width: min(980px, 100%);
  margin: 0 auto;
}

.content-card {
  margin: 0;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.3);
}

.content-header {
  padding-bottom: 0;
}

.content-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: var(--app-text-strong);
}

.content-body {
  padding-top: 8px;
}

.nav-button {
  --border-radius: 18px;
  height: 40px;
  font-weight: 600;
}

.content-html :deep(h1),
.content-html :deep(h2),
.content-html :deep(h3) {
  color: var(--app-text-strong);
  letter-spacing: -0.3px;
}

.content-html :deep(p),
.content-html :deep(li) {
  color: var(--app-text-muted);
  line-height: 1.6;
}

.content-html :deep(a) {
  color: var(--ion-color-tertiary);
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* Aspect ratio 16:9 */
  height: 0;
  overflow: hidden;
  margin-top: 16px;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.35);
}
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
