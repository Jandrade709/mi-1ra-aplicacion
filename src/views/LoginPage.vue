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
        <ion-content class="ion-padding login-container">
            <div class="form-wrapper">
                <h2 class="form-title">Bienvenido</h2>
                <p class="form-subtitle">Ingresa tus credenciales para continuar</p>
                
                <ion-item lines="none">                
                    <ion-input 
                        label="Usuario" 
                        class="ion-margin-top"
                        label-placement="floating" 
                        fill="outline" 
                        v-model="userStore.login.username"
                        placeholder="Tu usuario o email">
                    </ion-input>
                </ion-item>
                
                <ion-item lines="none">
                    <ion-input 
                        label="Contraseña" 
                        label-placement="floating" 
                        class="ion-margin-top"
                        fill="outline" 
                        placeholder="Tu contraseña" 
                        v-model="userStore.login.password"
                        type="password">
                    </ion-input>
                </ion-item>   
                
                <ion-item class="ion-margin-top" lines="none">
                    <ion-button @click="handleLogin" expand="block"> Ingresar </ion-button>
                </ion-item>
            </div>
        </ion-content>
    </ion-page>

</template>
<script lang="ts" setup>
import { IonPage, IonHeader, IonToolbar, 
    IonTitle, IonContent, alertController, 
    IonItem, IonInput, IonButton, IonButtons } from '@ionic/vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

function handleLogin() {
    userStore.$login().then( () => {
        router.push({ name: 'Seccion' });       
    }).catch( error => {
        alertController.create({
            header: 'Error de inicio de sesión',
            message: error.response.data.message,
            buttons: ['Continuar'],
            }).then(alert => alert.present());
    })
}
</script>

<style scoped>
.login-container {
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
</style>