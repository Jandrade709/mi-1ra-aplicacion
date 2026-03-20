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
                            <label class="field-label">Usuario</label>
                            <ion-input
                                class="input-rounded"
                                :disabled="loading"
                                fill="outline"
                                v-model="userStore.registro.usuario"
                                placeholder="Elige un usuario"
                                @blur="$v.usuario?.$touch()">
                            </ion-input>
                            <ion-note v-if="$v.usuario?.$errors?.length && $v.usuario.$dirty" class="validation-note">
                                El usuario es requerido y debe tener al menos 4 caracteres
                            </ion-note>
                        </div>

                        <div class="field-group">
                            <label class="field-label">Email</label>
                            <ion-input
                                class="input-rounded"
                                :disabled="loading"
                                fill="outline"
                                v-model="userStore.registro.email"
                                placeholder="tu@email.com"
                                @blur="$v.email?.$touch()">
                            </ion-input>
                            <ion-note v-if="$v.email?.$errors?.length && $v.email.$dirty" class="validation-note">
                                El email es requerido y debe tener un formato válido
                            </ion-note>
                        </div>

                        <div class="field-group">
                            <label class="field-label">Contraseña</label>
                            <ion-input
                                class="input-rounded"
                                :disabled="loading"
                                fill="outline"
                                placeholder="Mínimo 6 caracteres"
                                v-model="userStore.registro.password"
                                type="password"
                                @blur="$v.password?.$touch()">
                            </ion-input>
                            <ion-note v-if="$v.password?.$errors?.length && $v.password.$dirty" class="validation-note">
                                La contraseña es requerida y debe tener al menos 6 caracteres
                            </ion-note>
                        </div>

                        <ion-button
                            class="login-button"
                            expand="block"
                            @click="handleRegister"
                            :disabled="loading">
                            <span v-if="!loading">Registrarse</span>
                            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                        </ion-button>

                        <ion-button class="example-button" fill="outline" expand="block" @click="loadRandomUser">
                            Presiona para ver un ejemplo de usuario
                        </ion-button>

                        <div v-if="userStore.userData" class="example-user">
                            <img v-if="userStore.userData.picture" :src="userStore.userData.picture" alt="avatar" class="avatar" />
                            <div class="user-info">
                                <strong>{{ userStore.userData.name }}</strong>
                                <div>{{ userStore.userData.email }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="register-block">
                        <ion-text class="register-text">¿Ya tienes cuenta?</ion-text>
                        <ion-button fill="clear" size="small" @click="router.push({ name: 'Login'})">
                            Iniciar sesión
                        </ion-button>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>

</template>
<script lang="ts" setup>
import { IonPage, IonContent, IonInput, IonButton, alertController, IonSpinner, IonNote, IonText } from '@ionic/vue';
import { useUserStore } from '@/stores/user';
import { fetchRandomUsers } from '@/axios/axiosRandom';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { ref } from 'vue';

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);

const rules = {
    usuario: {
        required,
        minLength: minLength(4)
    },
    email: {
        required,
        email
    },
    password: {
        required,
        minLength: minLength(6)
    }       
}

// Corrección: Pasar userStore.$state para acceso reactivo correcto
const $v = useVuelidate(rules, userStore.$state.registro, { $autoDirty: true });

async function handleRegister() {
    $v.value.$touch();
    if(!$v.value.$invalid) {
        loading.value = true;
        try {
            await userStore.$registro();
            await router.push(userStore.userData ? { path: '/seccion' } : { name: 'Login' });
        } catch (error: any) {
            await alertController.create({
                header: 'Error de registro',
                message: error?.response?.data?.message || 'No se pudo completar el registro.',
                buttons: ['Continuar'],
            }).then(alert => alert.present());
        } finally {
            loading.value = false;
        }
    }
}   
async function loadRandomUser(){
    try{
        await fetchRandomUsers(1);
    }catch(e){
        console.warn('Error cargando usuario ejemplo', e);
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

.example-button {
    --border-radius: 18px;
    margin-top: 4px;
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

.validation-note {
    display: block;
    margin: 4px 0 12px 8px;
    color: #fecaca;
    font-size: 13px;
    font-weight: 600;
}

.example-user{
    display:flex;
    align-items:center;
    gap:12px;
    margin-top:4px;
    color: var(--app-text-strong);
}

.example-user .avatar{
    width:56px;
    height:56px;
    border-radius:50%;
    object-fit:cover;
    border:2px solid rgba(255,255,255,0.6);
}
</style>
