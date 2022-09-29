import { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2';

export class SweetalertModel {
  public constants = SweetAlertConstants;
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
    this.icon = this.constants.SWEET_ALERT_SUCCES;
    this.toast = this.constants.SWEET_ALERT_SWEET;
    this.background = this.constants.SWEET_ALERT_BG_DEFAULT;
    this.showConfirmButton = this.constants.SWEET_ALERT_SHOW_CONFIRM_BUTTOM;
    this.showCancelButton = this.constants.SWEET_ALERT_SHOW_CANCEL_BUTTOM;
    this.confirmButtonText = this.constants.SWEET_ALERT_CONFIRM;
    this.cancelButtonText = this.constants.SWEET_ALERT_CANCEL;
    this.showCloseButton = this.constants.SWEET_ALERT_CLOSE;
    this.confirmButtonClass = this.constants.SWEET_ALERT_CONFIRM_CLASS;
    this.cancelButtonClass = this.constants.SWEET_ALERT_CANCEL_CLASS;
    this.buttonsStyling = this.constants.SWEET_ALERT_BUTTON_STYLIN;
  }
}
export class SweetAlertConstants {
  public static noConexion = ' Revise su conexion de Internet.';
  public static noAccess = ' Su cuenta no tiene acceso a este Sistema.';
  public static SWEET_ALERT_TITLE_OK = 'Correcto...!';
  public static SWEET_ALERT_TITLE_MSG_OK =
    'Operacion realizada correctamente...!';
  public static SWEET_ALERT_TITLE_DELETE = 'Eliminar';
  public static SWEET_ALERT_TITLE_MSG_DELETE =
    'Esta Seguro de eliminar el elemento seleccionado?';
  public static SWEET_ALERT_TITLE_FAIL = 'Cuidado...!';
  public static SWEET_ALERT_TITLE_OPS = 'Ops! Ocurrio algo inesperado...';
  public static SWEET_ALERT_TITLE_ERROR = 'Error!';
  public static SWEET_ALERT_TITLE_OK_SAVE = 'Enviado correctamente';
  public static SWEET_ALERT_SUCCES: SweetAlertIcon = 'success';
  public static SWEET_ALERT_ERROR: SweetAlertIcon = 'error';
  public static SWEET_ALERT_WARNING: SweetAlertIcon = 'warning';
  public static SWEET_ALERT_INFO: SweetAlertIcon = 'info';
  public static SWEET_ALERT_QUESTION: SweetAlertIcon = 'question';
  public static SWEET_ALERT_CONFIRM = 'Aceptar';
  public static SWEET_ALERT_CONFIRM_CLASS = 'mb-3 mr-5 btn btn-xs btn-primary';
  public static SWEET_ALERT_CANCEL = 'Cancelar';
  public static SWEET_ALERT_CANCEL_CLASS = 'mb-3 ml-5 btn btn-xs btn-danger';
  public static SWEET_ALERT_SHOW_CONFIRM_BUTTOM = false;
  public static SWEET_ALERT_SWEET = false;
  public static SWEET_ALERT_CLOSE = false;
  public static SWEET_ALERT_SHOW_CANCEL_BUTTOM = false;
  public static SWEET_ALERT_BUTTON_STYLIN = false;
  public static SWEET_ALERT_FOCUS_CONFIRM = false;
  public static SWEET_ALERT_FOCUS_CANCEL = true;
  public static SWEET_ALERT_POSITION_TOP = 'top';
  public static SWEET_ALERT_POSITION_TOP_START = 'top-start';
  public static SWEET_ALERT_POSITION_TOP_END = 'top-end';
  public static SWEET_ALERT_POSITION_CENTER = 'center';
  public static SWEET_ALERT_POSITION_CENTER_START = 'center-start';
  public static SWEET_ALERT_POSITION_CENTER_END = 'center-end';
  public static SWEET_ALERT_POSITION_BOTTOM = 'bottom';
  public static SWEET_ALERT_POSITION_BOTTOM_START = 'bottom-start';
  public static SWEET_ALERT_POSITION_BOTTOM_END = 'bottom-end';
  public static SWEET_ALERT_TIMER_1500 = 1500;
  public static SWEET_ALERT_TIMER_2000 = 2000;
  public static SWEET_ALERT_BG_DEFAULT = '';
  public static SWEET_ALERT_BG_DARK_OLIVE_GREEN = '#556B2F';
  public static SWEET_ALERT_BG_LAVNADER = '#E6E6FA';
  public static SWEET_ALERT_BG_GOLD = '#FFD700';
}
