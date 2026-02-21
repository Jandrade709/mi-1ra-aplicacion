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
        <ion-content class="ion-padding register-container">
            <div class="form-wrapper">
                <h2 class="form-title">Registro</h2>
                <p class="form-subtitle">Crea tu cuenta para empezar</p>
                
                <ion-item lines="none">                
                    <ion-input 
                        label="Usuario" 
                        class="ion-margin-top"
                        label-placement="floating" 
                        fill="outline" 
                        v-model="userStore.registro.usuario"
                        placeholder="Elige un usuario"
                        @blur="$v.usuario?.$touch()">
                    </ion-input>
                </ion-item>
                <ion-item v-if="$v.usuario?.$errors?.length && $v.usuario.$dirty" lines="none">
                    <ion-label color="danger">
                        El usuario es requerido y debe tener al menos 4 caracteres
                    </ion-label>
                </ion-item>
                
                <ion-item lines="none">                
                    <ion-input 
                        label="Email" 
                        class="ion-margin-top"
                        label-placement="floating" 
                        fill="outline" 
                        v-model="userStore.registro.email"
                        placeholder="tu@email.com"
                        @blur="$v.email?.$touch()">
                    </ion-input>
                </ion-item>
                <ion-item v-if="$v.email?.$errors?.length && $v.email.$dirty" lines="none">
                    <ion-label color="danger">
                        El email es requerido y debe tener un formato válido
                    </ion-label>
                </ion-item>
                
                <ion-item lines="none">
                    <ion-input 
                        label="Contraseña" 
                        label-placement="floating" 
                        class="ion-margin-top"
                        fill="outline" 
                        placeholder="Mínimo 6 caracteres" 
                        v-model="userStore.registro.password"
                        type="password"
                        @blur="$v.password?.$touch()">
                    </ion-input>
                </ion-item>
                <ion-item v-if="$v.password?.$errors?.length && $v.password.$dirty" lines="none">
                    <ion-label color="danger">
                        La contraseña es requerida y debe tener al menos 6 caracteres
                    </ion-label>
                </ion-item>   
                
                <ion-item class="ion-margin-top" lines="none">
                    <ion-button @click="handleRegister" expand="block"> Registrarse </ion-button>
                </ion-item>
                <ion-item class="ion-margin-top" lines="none">
                    <ion-button color="tertiary" @click="loadRandomUser" expand="block"> Presiona para ver un ejemplo de usuario </ion-button>
                </ion-item>
                <div v-if="userStore.userData" class="example-user ion-margin-top">
                    <img v-if="userStore.userData.picture" :src="userStore.userData.picture" alt="avatar" class="avatar" />
                    <div class="user-info">
                        <strong>{{ userStore.userData.name }}</strong>
                        <div>{{ userStore.userData.email }}</div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>

</template>
<script lang="ts" setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, 
    IonInput, IonButton, IonLabel, IonButtons, alertController } from '@ionic/vue';
import { useUserStore } from '@/stores/user';
import { fetchRandomUsers } from '@/axios/axiosRandom';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'

const userStore = useUserStore();
const router = useRouter();

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

function handleRegister() {
    $v.value.$touch();
    if(!$v.value.$invalid) {
        userStore.$registro().then( () => {
            router.push({ name: 'Seccion' });       
        }).catch( error => {
            alertController.create({
                header: 'Error de registro',
                message: error.response.data.message,
                buttons: ['Continuar'],
                }).then(alert => alert.present());
        })
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
.register-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.form-wrapper {
    width: 100%;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-title {
    color: #ffffff;
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
}

.form-subtitle {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    text-align: center;
    margin: 0 0 30px 0;
}

ion-header {
    --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --border-color: transparent;
}

ion-title {
    color: #000000;
    font-weight: 700;
    font-size: 28px;
    text-align: center;
}

ion-content {
    --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

ion-item {
    --background: transparent;
    --border-color: transparent;
    margin-bottom: 16px;
}

ion-input {
    --padding-start: 12px;
    --padding-end: 12px;
    --padding-top: 12px;
    --padding-bottom: 12px;
    --background: rgba(255, 255, 255, 0.95);
    --color: #333;
    --placeholder-color: #999;
    border-radius: 8px;
    font-weight: 500;
}

ion-input::part(container) {
    background: rgba(255, 255, 255, 0.95);
}

ion-label {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    font-size: 14px;
    display: block;
    margin-bottom: 8px;
}

ion-label[color="danger"] {
    color: #ffcccc;
    font-size: 13px;
    margin-top: -12px;
    margin-bottom: 12px;
    font-weight: 500;
}

ion-button {
    --background: #ffffff;
    --color: #667eea;
    --border-radius: 8px;
    --padding-start: 32px;
    --padding-end: 32px;
    --padding-top: 12px;
    --padding-bottom: 12px;
    font-weight: 700;
    font-size: 16px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

ion-button:hover {
    --background: #000000;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
}

ion-button[expand="block"] {
    margin-top: 10px;
}

.example-user{
    display:flex;
    align-items:center;
    gap:12px;
    margin-top:12px;
    color: #fff;
}
.example-user .avatar{
    width:56px;
    height:56px;
    border-radius:50%;
    object-fit:cover;
    border:2px solid rgba(255,255,255,0.6);
}
</style>