<template>
    <ion-page v-if="!contentStore.loading">
        <ion-content class="ion-padding" >
            <div v-html="contentStore.content.contenido.contenido"></div>
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
        </ion-content>
        <ion-footer :translucent="true">
            <ion-toolbar>
            <ion-button slot="end" fill="solid" size="small" @click="siguiente()" v-if="contentStore.next.url">Siguiente</ion-button>
             <ion-progress-bar v-if="contentStore.loading" type="indeterminate"></ion-progress-bar>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import { IonPage, IonToolbar, IonContent, IonFooter, IonButton, IonProgressBar } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
const route = useRoute(); 
const contentStore = useContentStore();
const router = useRouter();

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

watch([() => contentStore.menu, currentName], () => {
  updateNext();
}, { deep: true, immediate: true });
</script>
<style scoped>
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* Aspect ratio 16:9 */
  height: 0;
  overflow: hidden;
}
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
