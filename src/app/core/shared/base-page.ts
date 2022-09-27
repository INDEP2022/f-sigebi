import Swal, { SweetAlertIcon, SweetAlertPosition, SweetAlertResult } from "sweetalert2";

class SweetalertModel {
    public title: string;
    public text: string;
    public icon: SweetAlertIcon;
    public footer: string;
    public background: string;
    public showConfirmButton: boolean;
    public toast: boolean;
    public showCancelButton: boolean;
    public buttonsStyling: boolean;
    public focusConfirm: boolean;
    public focusCancel: boolean;
    public showCloseButton: boolean;
    public confirmButtonText: string;
    public cancelButtonText: string;
    public confirmButtonClass: string;
    public cancelButtonClass: string;
    public timer: number;
    public position: SweetAlertPosition;
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