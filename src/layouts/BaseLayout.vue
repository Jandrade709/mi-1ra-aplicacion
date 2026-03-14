<template>
    <ion-page>
        <ion-menu content-id="main-content">
            <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Menu</ion-title>
            </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item>
                        <ion-avatar aria-hidden="true" slot="start">
                            <img alt="Avatar de perfil" :src="userStore.userData?.picture || defaultAvatar" />
                        </ion-avatar>
                        <ion-label>{{ userStore.userData?.usuario || 'Usuario' }}</ion-label>
                        <ion-button slot="end" fill="solid" size="small" @click="handleLogout">Salir</ion-button>
                    </ion-item>
                    <ion-accordion-group>
                        <template v-for="(menu, key) in contentStore.menu" :key="key">
                            <ion-accordion :value="'menu-'+key">
                                <ion-item slot="header" color="secondary">
                                    <ion-label><i :class="menu.icon"></i> {{ menu.name }}</ion-label>
                                </ion-item>
                                <div slot="content">
                                    <ion-list>
                                        <template v-for="(item, itemKey) in menu.sub" :key="itemKey">
                                            <ion-menu-toggle v-if="item.active === 'yes'">
                                                <ion-item 
                                                :router-link="'/'+item.url"
                                                @click="handleMenuNavigation(item.internal_name)"
                                                >
                                                    <ion-label>{{ item.name }}</ion-label>
                                                </ion-item>
                                            </ion-menu-toggle>
                                        </template>
                                    </ion-list>
                                </div>
                            </ion-accordion>
                        </template>
                    </ion-accordion-group>                        
                </ion-list>
            </ion-content>
        </ion-menu>
        <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>{{ contentStore.content.contenido.name || 'Contenido' }}</ion-title>
            <ion-progress-bar v-if="contentStore.loading" type="indeterminate"></ion-progress-bar>
        </ion-toolbar>
        </ion-header>
        <ion-content id="main-content" class="ion-padding">
            <ion-router-outlet></ion-router-outlet>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
  import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList, IonAvatar, IonButton, IonRouterOutlet,
    IonMenuToggle, IonProgressBar } from '@ionic/vue';
  import { useUserStore } from '@/stores/user';
  import {useContentStore} from '@/stores/content';
  import { useRouter , useRoute} from 'vue-router';
  
  const contentStore = useContentStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const defaultAvatar = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  const currentContentName = computed(() => {
    const name = route.params.name;
    return typeof name === 'string' ? name : '';
  });

  async function handleLogout(){
    await userStore.$setLogin(null);
    await router.replace('/login');
  }

  async function handleMenuNavigation(name: string) {
    if (name) {
      await contentStore.$getContent(name);
    }
  }

  watch(currentContentName, (name) => {
    if (name) {
      contentStore.$getContent(name);
    } else {
      contentStore.setContent(null);
    }
  }, { immediate: true });
</script>

<style scoped>
</style>
