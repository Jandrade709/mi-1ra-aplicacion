<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
            
            <ion-title>Registro</ion-title>
            <ion-buttons slot="end">
                <ion-button fill="solid" @click="router.push({ name: 'Login'})">Login</ion-button>
            </ion-buttons>
        </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-item lines="none">                
                <ion-input 
                    label="Usuario" 
                    class="ion-margin-top"
                    label-placement="floating" 
                    fill="outline" 
                    v-model="userStore.registro.usuario"
                    placeholder="Ingrese el usuario">
                </ion-input>
            </ion-item>
            <ion-item v-if="$v.usuario.$errors.length">
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
                    placeholder="Ingrese un email">
                </ion-input>
            </ion-item>
            <ion-item v-if="$v.email.$errors.length">
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
                    placeholder="**********" 
                    v-model="userStore.registro.password"
                    type="password">
                </ion-input>
            </ion-item>
            <ion-item v-if="$v.password.$errors.length">
                <ion-label color="danger">
                    La contraseña es requerida y debe tener al menos 6 caracteres
                </ion-label>
            </ion-item>   
            <ion-item class="ion-margin-bottom" lines="none">
                <ion-button slot="end" size="default" @click="handleRegister"> Registrarse </ion-button>
            </ion-item>
        </ion-content>
    </ion-page>

</template>
<script lang="ts" setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, 
    IonInput, IonButton, IonLabel, IonButtons, alertController } from '@ionic/vue';
import { useUserStore } from '@/stores/user';
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

const $v = useVuelidate(rules, userStore.registro);

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
</script>