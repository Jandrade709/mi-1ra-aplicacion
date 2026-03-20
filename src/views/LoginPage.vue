<template>
    <ion-page>
        <ion-content class="ion-padding auth-content">
            <div class="app-page-center">
                <div class="login-shell">
                    <div class="brand-block">
                        <img class="logo-mark" src="/favicon.png" alt="MenuAccess" />
                        <h1 class="brand-title">MenuAccess</h1>
                    </div>

                    <div class="form-stack">
                        <div class="field-group">
                            <label class="field-label">Usuario o correo</label>
                            <ion-input
                                class="input-rounded"
                                :disabled="loading"
                                fill="outline"
                                v-model="userStore.login.username"
                                placeholder="Tu usuario o email">
                            </ion-input>
                        </div>

                        <div class="field-group">
                            <label class="field-label">Contraseña</label>
                            <ion-input
                                class="input-rounded"
                                :disabled="loading"
                                fill="outline"
                                placeholder="Tu contraseña"
                                v-model="userStore.login.password"
                                @keyup.enter="handleLogin"
                                type="password">
                            </ion-input>
                        </div>

                        <ion-button
                            class="login-button"
                            expand="block"
                            @click="handleLogin"
                            :disabled="loading">
                            <span v-if="!loading">Iniciar sesión</span>
                            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                        </ion-button>
                    </div>

                    <div class="register-block">
                        <ion-text class="register-text">¿No tienes cuenta?</ion-text>
                        <ion-button fill="clear" size="small" @click="router.push({ name: 'Registro'})">
                            Registrarse
                        </ion-button>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>

</template>
<script lang="ts" setup>
import { IonPage, IonContent, alertController, IonInput, IonButton, IonSpinner, IonText } from '@ionic/vue';
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

.login-shell {
    width: min(420px, 100%);
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: stretch;
}

.brand-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.logo-mark {
    width: 88px;
    height: 88px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.12);
    border: 2px solid #0f172a;
    padding: 6px;
    object-fit: contain;
    display: block;
}

.brand-title {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    text-align: center;
}

.form-stack {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.field-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--ion-color-step-650, #4f4f4f);
}

.input-rounded {
    --border-radius: 18px;
    --padding-start: 14px;
    --padding-end: 14px;
    --padding-top: 14px;
    --padding-bottom: 14px;
}

.login-button {
    --border-radius: 18px;
    height: 48px;
    margin-top: 6px;
    font-weight: 600;
}

.register-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.register-text {
    font-size: 14px;
    color: var(--ion-color-step-600, #5b5b5b);
}
</style>
