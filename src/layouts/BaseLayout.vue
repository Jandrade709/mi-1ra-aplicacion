<template>
    <ion-page>
        <ion-menu content-id="main-content">
            <ion-header>
            <ion-toolbar color="tertiary">
                <ion-title>Menu Content</ion-title>
            </ion-toolbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item>
                        <ion-avatar aria-hidden="true" slot="start">
                            <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                        </ion-avatar>
                        <ion-label>{{ userStore.userData.usuario }}</ion-label>
                        <ion-button slot="end" fill="solid" size="small" @click="handleLogout">Salir</ion-button>
                    </ion-item>
                    
                        <ion-accordion-group>
                            <ion-accordion value="first">
                            <ion-item slot="header" color="light">
                                <ion-label>First Accordion</ion-label>
                            </ion-item>
                                <div slot="content">
                                    <ion-list>
                                        <ion-item>
                                            <ion-label>Pokémon Yellow</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>Mega Man X</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>The Legend of Zelda</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>Pac-Man</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>Super Mario World</ion-label>
                                        </ion-item>
                                    </ion-list>
                                </div>
                            </ion-accordion>
                            <ion-accordion value="second">
                            <ion-item slot="header" color="light">
                                <ion-label>Second Accordion</ion-label>
                            </ion-item>
                                <div slot="content">
                                    <ion-list>
                                        <ion-item>
                                            <ion-label>Pokémon Yellow</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>Mega Man X</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>The Legend of Zelda</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>Pac-Man</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>Super Mario World</ion-label>
                                        </ion-item>
                                    </ion-list>
                                </div>
                            </ion-accordion>
                            <ion-accordion value="third">
                            <ion-item slot="header" color="light">
                                <ion-label>Third Accordion</ion-label>
                            </ion-item>
                                <div slot="content">
                                    <ion-list>
                                        <ion-item>
                                            <ion-label>Pokémon Yellow</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>Mega Man X</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>The Legend of Zelda</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>Pac-Man</ion-label>
                                        </ion-item>
                                        <ion-item>
                                            <ion-label>Super Mario World</ion-label>
                                        </ion-item>
                                    </ion-list></div>
                            </ion-accordion>
                        </ion-accordion-group>
                    
                </ion-list>
            </ion-content>
        </ion-menu>
        <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>Menu</ion-title>
        </ion-toolbar>
        </ion-header>
        <ion-content id="main-content" class="ion-padding">
            
             Tap the button in the toolbar to open the menu. </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
  import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
  import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList, IonAvatar } from '@ionic/vue';
  import { useUserStore } from '@/stores/user';
  import { useRouter } from 'vue-router';
  
  const userStore = useUserStore();
  const router = useRouter();
  async function handleLogout(){
    await userStore.$setLogin(null);
    router.push('/login');
  }
</script>

<style scoped>
  ion-menu::part(backdrop) {
    background-color: rgba(255, 0, 255, 0.5);
  }

  ion-menu::part(container) {
    border-radius: 0 20px 20px 0;

    box-shadow: 4px 0px 16px rgba(255, 0, 255, 0.18);
  }
</style>