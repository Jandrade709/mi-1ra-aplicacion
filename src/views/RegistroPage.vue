<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
            
            <ion-title>Crear Cuenta</ion-title>
            <ion-buttons slot="end">
                <ion-button fill="solid" @click="router.push({ name: 'Login'})">Regresar</ion-button>
            </ion-buttons>
        </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding auth-content">
            <div class="app-page-center">
                <ion-card class="glass-card">
                    <ion-card-header>
                        <ion-card-title>Registro</ion-card-title>
                        <ion-card-subtitle>Crea tu cuenta para empezar</ion-card-subtitle>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-list class="form-list" lines="none">
                            <ion-item>                
                                <ion-input
                                    :disabled="loading"
                                    label="Usuario" 
                                    label-placement="floating" 
                                    fill="outline" 
                                    v-model="userStore.registro.usuario"
                                    placeholder="Elige un usuario"
                                    @blur="$v.usuario?.$touch()">
                                </ion-input>
                            </ion-item>

                            <ion-note v-if="$v.usuario?.$errors?.length && $v.usuario.$dirty" class="validation-note">
                                El usuario es requerido y debe tener al menos 4 caracteres
                            </ion-note>
                            
                            <ion-item>                
                                <ion-input 
                                    :disabled="loading"
                                    label="Email" 
                                    label-placement="floating" 
                                    fill="outline" 
                                    v-model="userStore.registro.email"
                                    placeholder="tu@email.com"
                                    @blur="$v.email?.$touch()">
                                </ion-input>
                            </ion-item>

                            <ion-note v-if="$v.email?.$errors?.length && $v.email.$dirty" class="validation-note">
                                El email es requerido y debe tener un formato válido
                            </ion-note>
                            
                            <ion-item>
                                <ion-input
                                    :disabled="loading"
                                    label="Contraseña" 
                                    label-placement="floating" 
                                    fill="outline" 
                                    placeholder="Mínimo 6 caracteres" 
                                    v-model="userStore.registro.password"
                                    type="password"
                                    @blur="$v.password?.$touch()">
                                </ion-input>
                            </ion-item>
                            <ion-note v-if="$v.password?.$errors?.length && $v.password.$dirty" class="validation-note">
                                La contraseña es requerida y debe tener al menos 6 caracteres
                            </ion-note>   
                            
                            <div class="form-actions">
                                <ion-button size="default" @click="handleRegister" :disabled="loading"> 
                                    <span v-if="!loading">Registrarse</span>
                                    <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                                </ion-button>
                            </div>

                            <ion-button color="tertiary" @click="loadRandomUser" expand="block"> Presiona para ver un ejemplo de usuario </ion-button>
                            <div v-if="userStore.userData" class="example-user ion-margin-top">
                                <img v-if="userStore.userData.picture" :src="userStore.userData.picture" alt="avatar" class="avatar" />
                                <div class="user-info">
                                    <strong>{{ userStore.userData.name }}</strong>
                                    <div>{{ userStore.userData.email }}</div>
                                </div>
                            </div>
                        </ion-list>
                    </ion-card-content>
                </ion-card>
            </div>
        </ion-content>
    </ion-page>

</template>
<script lang="ts" setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, 
    IonInput, IonButton, IonButtons, alertController, IonSpinner, IonNote,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonList } from '@ionic/vue';
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
    margin-top:12px;
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
