import Swal, { SweetAlertIcon, SweetAlertPosition, SweetAlertResult, SweetAlertOptions } from "sweetalert2";

class SweetalertModel implements SweetAlertOptions {
    title: string;
    text: string;
    icon: SweetAlertIcon;
    footer: string;
    background: string;
    showConfirmButton: boolean;
    toast: boolean;
    showCancelButton: boolean;
    buttonsStyling: boolean;
    focusConfirm: boolean;
    focusCancel: boolean;
    showCloseButton: boolean;
    confirmButtonText: string;
    cancelButtonText: string;
    confirmButtonClass: string;
    cancelButtonClass: string;
    timer: number;
    position: SweetAlertPosition;
    constructor() {
        this.icon = 'success';
        this.toast = false;
        this.background = '';
        this.showConfirmButton = false;
        this.showCancelButton = false;
        this.confirmButtonText = 'Aceptar';
        this.cancelButtonText = 'Cancelar';
        this.showCloseButton = false;
        this.confirmButtonClass = 'btn btn-primary active btn-sm';
        this.cancelButtonClass = 'btn btn-danger active btn-sm';
        this.buttonsStyling = false;
    }
}

export abstract class BasePage {
    constructor() { }

    protected onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
        let sweetalert = new SweetalertModel();
        sweetalert.toast = true;
        sweetalert.position = 'top-end';
        sweetalert.timer = 2000;
        sweetalert.title = title;
        sweetalert.text = text;
        sweetalert.icon = icon;
        Swal.fire(sweetalert);
    }

    protected alert(icon: SweetAlertIcon, title: string, text: string) {
        let sweetalert = new SweetalertModel();
        sweetalert.title = title;
        sweetalert.text = text;
        sweetalert.icon = icon;
        sweetalert.showConfirmButton = true;
        Swal.fire(sweetalert);
    }

    protected alertQuestion(icon: SweetAlertIcon, title: string, text: string): Promise<SweetAlertResult> {
        let sweetalert = new SweetalertModel();
        sweetalert.title = title;
        sweetalert.text = text;
        sweetalert.icon = icon;
        sweetalert.showConfirmButton = true;
        sweetalert.showCancelButton = true;
        return Swal.fire(sweetalert);;
    }
}