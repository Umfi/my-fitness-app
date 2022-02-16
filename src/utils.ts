import { toastController } from "@ionic/vue";

export async function showToast(msg: string) {
    const toast = await toastController.create({
        message: msg,
        duration: 2000,
    });
    toast.present();
}