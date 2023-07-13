import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
//XLSX
import { catchError, tap, throwError } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { ComerEventForm } from '../utils/forms/comer-event-form';
import { EventStadisticsForm } from '../utils/forms/event-stadistics-form';
import { IEventPreparationParameters } from '../utils/interfaces/event-preparation-parameters';

@Component({
  selector: 'app-event-preparation',
  templateUrl: './event-preparation.component.html',
  styles: [
    `
      .bg-key {
        background-color: #e3e3e3;
        border-radius: 8px !important;
      }

      li.nav-item.active > a.nav-link.active {
        background-color: #9d2449 !important;
        color: #f0e4d1 !important;
      }
    `,
  ],
})
export class EventPreparationComponent extends BasePage implements OnInit {
  /**
   * BLK_TAREAS
   * @property {string} tDirection - T_DIRECCION
   */
  blkTasks = {
    tDirection: '',
  };
  /**
   * PARAMETERS.
   * @property {string} pValidTPEVEXUSU - PVALIDATPEVEXUSU.
   * @property {string} pBank - PBANCO.
   * @property {string} pRejected - PRECHAZADO.
   * @property {string} pDays - PDIAS.
   * @property {string} pValids - P_VALIDOS.
   * @property {string} pGoods - PASABIENES.
   * @property {string} pDirection - P_DIRECCION.
   */
  parameters: IEventPreparationParameters = {
    pValidTPEVEXUSU: '',
    pBank: '',
    pRejected: '',
    pDays: 0,
    pValids: 0,
    pGoods: '',
    pDirection: '',
  };

  /**
   * BLK_CTRL_PRINCIPAL
   * @property {boolean} chkProc - CHK_PROCEDENCIA, originalmente es S o N pasa a ser true o false
   * @property {boolean} chkLocation - CHK_UBICACION, originalmente es S o N pasa a ser true o false
   */
  blkCtrlMain = {
    chkProc: true,
    chkLocation: true,
  };

  /**
   * CANVAS
   * @property {boolean} main - CAN_PRINCIPAL
   */
  canvas = {
    main: true,
    events: true,
    stadistics: true,
  };

  globalEvent: IComerEvent = null;
  loggedUser: TokenInfoModel = null;
  eventForm = this.fb.group(new ComerEventForm());
  stadisticsForm = this.fb.group(new EventStadisticsForm());
  constructor(
    private fb: FormBuilder,
    private parameterModService: ParametersModService,
    private authService: AuthService
  ) {
    super();
    // TODO: Recibir los parametros
    this.parameters.pDirection = 'M';
  }

  ngOnInit(): void {
    this.initForm();
    this.getUserInfo();
  }

  getUserInfo() {
    this.loggedUser = this.authService.decodeToken();
  }

  /** PUP_INCIALIZA_FORMA */
  initForm() {
    this.defaultMenu();
    this.blkTasks.tDirection = 'MUEBLES';
    // TODO: SET_ITEM_PROPERTY('BLK_BIENES_LOTES.CAMPO1', PROMPT_TEXT, 'Nombre Prod');
    this.blkCtrlMain.chkLocation = true;
    this.blkCtrlMain.chkProc = true;
    this.getCommerParameterMod().subscribe();
    this.hideCanvas();
  }

  getCommerParameterMod() {
    const params = new FilterParams();
    params.addFilter('parameter', 'DIAREMAUTO');
    return this.parameterModService.getByParameter('DIAREMAUTO').pipe(
      catchError(error => {
        this.parameters.pDays = 0;
        return throwError(() => error);
      }),
      tap(res => {
        const parameter = res.data[0];
        if (!parameter) {
          return;
        }
        this.parameters.pDays = Number(parameter.value);
      })
    );
  }

  /** PUP_MENU_DEFAULT */
  defaultMenu() {
    if (this.parameters.pDirection == 'I') {
      // ? No hace nada
    }
  }

  hideCanvas() {
    this.canvas.main = false;
    // this.canvas.events = false;
    // HIDE_VIEW('CAN_PRINCIPAL');
    // HIDE_VIEW('CAN_EVENTOS');
    // HIDE_VIEW('CANVAS_RECHAZADO');
    // HIDE_VIEW('CAN_CLIENTES');
    // HIDE_VIEW('CAN_ADJUDIREC');
    // HIDE_VIEW('CAN_CONVOCATORIA');
    // HIDE_VIEW('CAN_LOTES_PAQUETES');
    // HIDE_VIEW('CAN_REMESAS');
    // HIDE_VIEW('CANV_EVELOTE');
  }

  selectTab(event: any) {
    console.log(event);
  }

  newEvent() {
    this.eventForm.reset();
    this.canvas.main = false;
  }

  openEvent() {
    let pass = -1;
    this.parameters.pValids = 1;
    const user = this.loggedUser.preferred_username;
  }

  viewCustomers() {
    this.canvas.main = true;
  }
}
