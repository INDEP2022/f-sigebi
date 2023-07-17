import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
//XLSX
import { sub } from 'date-fns';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { catchError, tap, throwError } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { ComerEventForm } from '../utils/forms/comer-event-form';
import { EventStadisticsForm } from '../utils/forms/event-stadistics-form';
import { EventPreparationMain } from './event-preparation-main.component';

const LOTES_TAB = 2;
const OPEN_TAB = 1;

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
export class EventPreparationComponent
  extends EventPreparationMain
  implements OnInit
{
  eventForm = this.fb.group(new ComerEventForm());
  stadisticsForm = this.fb.group(new EventStadisticsForm());
  onlyBase = false;
  @ViewChild('tasksTabs', { static: true }) tasksTabs?: TabsetComponent;
  get eventControls() {
    return this.eventForm.controls;
  }
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

  selectTab(num: number) {
    const tab = this.tasksTabs.tabs[num];
    if (tab) {
      tab.active = true;
    }
  }

  newEvent() {
    this.eventForm.reset();
    this.canvas.main = false;
  }

  taskOpenEvent() {
    this.hideCanvas();
    // TODO: Limpiar estadisticas
    const params = new FilterParams();
    this.comerEventsListParams.next(params);
  }

  /**
   * ABRIR_EVENTO
   */
  onOpenEvent() {
    this.parameters.pValids = 1;
    const user = this.loggedUser.preferred_username;
    const { statusVtaId, eventTpId, id } = this.eventControls;
    // TODO: IMPLEMENTAR METODO DE VALIDACION DE USUARIO
    const pass = this.validUser(id.value, user, this.parameters.pDirection);
    if (['NDIS', 'CONC'].includes(statusVtaId.value)) {
      if (pass == 0) {
        this.validPermissions(false);
      } else {
        this.validPermissions(true);
      }
    } else if ([7, 8].includes(Number(eventTpId.value))) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const { subYear, subMonth } = this.getSubDates(currentDate);
      if (year !== subYear || month !== subMonth) {
        this.validPermissions(false);
      }
      if (pass == 0) {
        this.validPermissions(false);
      } else if (pass == 1) {
        this.validPermissions(true);
      }
    } else if (pass == 0) {
      this.validPermissions(false);
    } else {
      this.validPermissions(true);
    }
    this.openEvent();
    this.fillStadistics();
  }

  lotesTab() {
    const { id } = this.eventControls;
    if (!id.value) {
      setTimeout(() => {
        this.selectTab(OPEN_TAB);
        this.alert(
          'error',
          'Error',
          'Para trabajar los lotes requiere tener un evento abierto'
        );
      }, 500);
      return;
    }
    this.defaultMenu();
    this.canvas.main = true;
    const params = new FilterParams();
    this.comerLotsListParams.next(params);
  }

  /**
   * PUP_ABRIR_EVENTO
   */
  openEvent() {
    const { id } = this.eventControls;
    if (!id.value) {
      const params = new FilterParams();
      this.comerEventsListParams.next(params);
      return;
    }
    this.hideCanvas();
    this.canvas.main = true;
    this.openExistingEvent();
  }

  openExistingEvent() {
    this.onlyBase = false;
    const { eventTpId, id } = this.eventControls;
    if (eventTpId.value == 11) {
      this.eventFormVisual.eventDate = false;
      this.eventFormVisual.failureDate = false;
      this.eventFormVisual.thirdId = false;
      this.onlyBase = true;
    } else if (eventTpId.value == 6) {
      this.eventFormVisual.eventDate = false;
      this.eventFormVisual.failureDate = false;
    } else {
      this.eventFormVisual.eventDate = true;
      this.eventFormVisual.failureDate = true;
    }
    this.resetTableFilters();
    this.selectTab(LOTES_TAB);
    const params = new FilterParams();
    this.comerLotsListParams.next(params);
  }

  resetTableFilters() {
    const filtersData = this.events.getFilter();
    const filters = filtersData.filters.map((filter: any) => {
      return { ...filter, search: '' };
    });
    this.events.setFilter(filters, true, false);
  }

  /**
   * LLENA_DATOS_ESTADISTICOS
   */
  fillStadistics() {}

  getSubDates(currentDate: Date) {
    const subDate = sub(currentDate, {
      days: this.parameters.pDays,
    });
    const subYear = subDate.getFullYear();
    const subMonth = subDate.getMonth() + 1;
    return { subYear, subMonth };
  }

  viewCustomers() {
    this.canvas.main = true;
  }

  validUser(eventId: string | number, user: string, direction: 'I' | 'M') {
    return 1;
  }

  validPermissions(grant: boolean) {
    this.blkProperties = {
      eventBlk: {
        update: grant,
      },
      lotComerBlk: {
        update: grant,
        insert: grant,
      },
      goodsLotsBlk: {
        update: grant,
        insert: grant,
        delete: grant,
      },
      comerAdjBlk: {
        update: grant,
      },
    };
    this.parameters.pValids = grant ? 1 : 0;
  }
}
