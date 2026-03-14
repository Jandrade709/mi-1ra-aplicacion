<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Inicio de Sesión</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="solid" @click="router.push({ name: 'Registro'})">Registrarse</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding auth-content">
            <div class="app-page-center">
                <ion-card class="glass-card">
                    <ion-card-header>
                        <ion-card-title>Bienvenido</ion-card-title>
                        <ion-card-subtitle>Ingresa tus credenciales para continuar</ion-card-subtitle>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-list class="form-list" lines="none">
                            <ion-item>
                                <ion-input 
                                    label="Usuario" 
                                    :disabled="loading"
                                    label-placement="floating" 
                                    fill="outline" 
                                    v-model="userStore.login.username"
                                    placeholder="Tu usuario o email">
                                </ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-input 
                                    label="Contraseña" 
                                    :disabled="loading"
                                    label-placement="floating" 
                                    fill="outline" 
                                    placeholder="Tu contraseña" 
                                    v-model="userStore.login.password"
                                    @keyup.enter="handleLogin"
                                    type="password">
                                </ion-input>
                            </ion-item>
                            <div class="form-actions">
                                <ion-button 
                                    size="default" 
                                    @click="handleLogin"
                                    :disabled="loading"
                                    > 
                                    <span v-if="!loading">Ingresar</span>
                                    <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                                </ion-button>
                            </div>
                        </ion-list>
                    </ion-card-content>
                </ion-card>
            </div>
        </ion-content>
    </ion-page>

</template>
<script lang="ts" setup>
import { IonPage, IonHeader, IonToolbar, 
    IonTitle, IonContent, alertController, 
    IonItem, IonInput, IonButton, IonButtons, IonSpinner, 
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonList } from '@ionic/vue';
import { useUserStore } from '@/stores/user';
import { useContentStore } from '@/stores/content';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const userStore = useUserStore();
const contentStore = useContentStore();
const router = useRouter();
const loading = ref(false);

async function handleLogin() {
    loading.value = true;
    try {
        await userStore.$login();
        const fallbackPath = '/seccion';
        const targetPath = contentStore.home.url ? `/${contentStore.home.url}` : fallbackPath;

        if (contentStore.home.internal_name) {
            await contentStore.$getContent(contentStore.home.internal_name);
        }

        await router.push({ path: targetPath });
    } catch (error: any) {
        await alertController.create({
            header: 'Error de inicio de sesión',
            message: error?.response?.data?.message || 'No se pudo iniciar sesión. Intenta nuevamente.',
            buttons: ['Continuar'],
        }).then(alert => alert.present());
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.auth-content {
    --background: var(--app-background);
}
</style>
