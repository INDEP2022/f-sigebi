import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
//XLSX
import { ActivatedRoute } from '@angular/router';
import { sub } from 'date-fns';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import {
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  of,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { EventPreparationService } from '../event-preparation.service';
import { ComerEventForm } from '../utils/forms/comer-event-form';
import { EventStadisticsForm } from '../utils/forms/event-stadistics-form';
import { EventStadisticsDefaultValue } from '../utils/forms/stadistics-default-form';
import { EventPreparationMain } from './event-preparation-main.component';

enum TABS {
  NEW_EVENT_TAB = 0,
  OPEN_TAB = 1,
  LOTES_TAB = 2,
  CUSTOMERS_TAB = 3,
  AVAILABLE_GOODS_TAB = 4,
  BASE_TAB = 5,
}
const BANK_PARAMETER = 'GENREF';

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
  @ViewChild('tasksTabs', { static: true }) tasksTabs?: TabsetComponent;
  get eventControls() {
    return this.eventForm.controls;
  }
  constructor(
    private fb: FormBuilder,
    private parameterModService: ParametersModService,
    private authService: AuthService,
    private comerEventosService: ComerEventosService,
    private lotService: LotService,
    private eventPreparationService: EventPreparationService,
    private globalVarsService: GlobalVarsService,
    private eventAppService: EventAppService,
    private parametersModService: ParametersModService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    // TODO: Recibir los parametros
    this.parameters.pDirection = 'M';
    const screen = this.activatedRoute.snapshot.data['screen'];
    this.parameters.pDirection = screen == 'FCOMEREVENTOS' ? 'M' : 'I';
  }

  async checkState() {
    const selftState = await this.eventPreparationService.getState();
    const { eventForm } = selftState;
    if (eventForm) {
      this.eventForm.patchValue(eventForm.getRawValue());
    }
    const global = await this.globalVarsService.getVars();
    const { REL_BIENES } = global;
    if (REL_BIENES) {
      await this.onOpenEvent();
    }
  }

  async ngOnInit() {
    this.initForm();
    this.getUserInfo();
    this.newEventSelected().subscribe();
    await this.checkState();
  }

  newEventSelected() {
    return this.eventControls.id.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(async eventId => {
        if (!eventId) {
          this.parameters.pBank = null;
          return;
        }
        const bank = await this.getBankParameter();
        console.log(bank);
        this.parameters.pBank = bank;
        const { eventTpId } = this.eventControls;
        if (eventTpId.value == 6) {
          this.eventFormVisual.thirdId = false;
          this.eventFormVisual.baseCost = false;
          this.eventFormVisual.applyButton = false;
        } else {
          this.eventFormVisual.thirdId = true;
          this.eventFormVisual.baseCost = true;
          this.eventFormVisual.applyButton = true;
        }
      })
    );
  }

  async getBankParameter() {
    const { eventTpId } = this.eventControls;
    const params = new FilterParams();
    params.addFilter('parameter', BANK_PARAMETER);
    params.addFilter('address', this.parameters.pDirection);
    console.warn('TIPO DE EVENTO', eventTpId.value);
    const defaultBank = this.parameters.pDirection == 'M' ? 'BANAMEX' : 'HSBC';
    params.addFilter('tpEventId', eventTpId.value);
    return await firstValueFrom(
      this.parametersModService.getAllFilter(params.getParams()).pipe(
        catchError(() => of({ data: [{ value: defaultBank }] })),
        map(response => response.data[0]?.value ?? defaultBank)
      )
    );
  }

  getUserInfo() {
    this.loggedUser = this.authService.decodeToken();
  }

  /** PUP_INCIALIZA_FORMA */
  initForm() {
    this.defaultMenu();
    this.blkTasks.tDirection =
      this.parameters.pDirection == 'M' ? 'MUEBLES' : 'INMUEBLES';
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
    this.cleanStadistics();
    const params = new FilterParams();
    this.comerEventsListParams.next(params);
  }

  /**
   * LIMPIA_ESTADISTICAS
   */
  cleanStadistics() {
    this.stadisticsForm.patchValue(EventStadisticsDefaultValue);
  }

  /**
   * ABRIR_EVENTO
   */
  async onOpenEvent() {
    this.parameters.pValids = 1;
    const user = this.loggedUser.preferred_username;
    const { statusVtaId, eventTpId, id } = this.eventControls;
    const pass = await this.validUser(
      id.value,
      user,
      this.parameters.pDirection
    );
    console.log({ pass });

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
        this.selectTab(TABS.OPEN_TAB);
        this.alert(
          'error',
          'Error',
          'Para trabajar los lotes requiere tener un evento abierto'
        );
      });
      return;
    }
    this.defaultMenu();
    this.canvas.main = true;
    const params = new FilterParams();
    this.comerLotsListParams.next(params);
    this.fillStadistics();
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
    // this.onlyBase = false;
    let tab = TABS.LOTES_TAB;
    const { eventTpId, id } = this.eventControls;
    if (eventTpId.value == 11) {
      if (this.parameters.pDirection == 'M') {
        this.eventFormVisual.eventDate = false;
        this.eventFormVisual.failureDate = false;
        this.eventFormVisual.thirdId = false;
      } else {
        this.eventFormVisual.eventDate = false;
        this.eventFormVisual.failureDate = false;
      }
      tab = TABS.BASE_TAB;
      // this.onlyBase = true;
    } else if (eventTpId.value == 6) {
      if (this.parameters.pDirection == 'M') {
        this.eventFormVisual.eventDate = false;
        this.eventFormVisual.failureDate = false;
      } else {
        this.eventFormVisual.eventDate = false;
        this.eventFormVisual.failureDate = false;
      }
    } else {
      if (this.parameters.pDirection == 'M') {
        this.eventFormVisual.eventDate = true;
        this.eventFormVisual.failureDate = true;
      } else {
        this.eventFormVisual.eventDate = true;
        this.eventFormVisual.failureDate = true;
      }
    }
    this.resetTableFilters();
    this.selectTab(tab);
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
  fillStadistics() {
    const { id } = this.eventControls;
    this.lotService
      .fillEventStadistics(id.value)
      .pipe(
        tap(res => {
          this.stadisticsForm.patchValue(res);
        })
      )
      .subscribe();
  }

  getSubDates(currentDate: Date) {
    const subDate = sub(currentDate, {
      days: this.parameters.pDays,
    });
    const subYear = subDate.getFullYear();
    const subMonth = subDate.getMonth() + 1;
    return { subYear, subMonth };
  }

  viewCustomers() {
    const { id } = this.eventControls;
    if (!id.value) {
      this.alert(
        'error',
        'Error',
        'Para ver los Clientes requiere tener un Evento Abierto'
      );
      setTimeout(() => {
        this.selectTab(TABS.OPEN_TAB);
      });
      return;
    }
    this.comerCustomersListParams.next(new FilterParams());
    this.selectTab(TABS.CUSTOMERS_TAB);
    this.fillStadistics();
  }

  async validUser(event: string | number, user: string, address: 'I' | 'M') {
    return await firstValueFrom(
      this.comerEventosService.validUser({ event, user, address }).pipe(
        catchError(() => of(-1)),
        map(res => res.value)
      )
    );
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

  availableGoods() {
    const { eventTpId, statusVtaId, id } = this.eventControls;
    if (!id.value) {
      this.canNotSeeAvailableGoods('Debe tener Evento Abierto');
      return;
    }
    if (eventTpId.value == 9) {
      this.canNotSeeAvailableGoods(
        'Opción no disponible para este tipo de evento, lotifique desde archivo'
      );
      return;
    }

    if (!this.consignment()) {
      this.canNotSeeAvailableGoods(
        'Este tipo de Evento no permite esta funcionalidad'
      );
      return;
    }
    console.log(statusVtaId.value);

    if (statusVtaId.value != 'PREP') {
      this.canNotSeeAvailableGoods(
        'Este tipo de Evento ya no admite incorporación de bienes'
      );
      return;
    }

    if (!this.lotSelected) {
      this.canNotSeeAvailableGoods(
        'Debe tener un lote seleccionado',
        TABS.LOTES_TAB
      );
      return;
    }

    this.preparation = !(eventTpId.value == 10);
  }

  /** REMESA */
  consignment() {
    const { eventTpId } = this.eventControls;
    return !(eventTpId.value == 6);
  }

  canNotSeeAvailableGoods(reason: string, tab: TABS = TABS.OPEN_TAB) {
    this.alert('error', 'Error', reason);
    setTimeout(() => {
      this.selectTab(tab);
    });
  }

  async exitConsignment(resp: { refresh: boolean; preparation: boolean }) {
    const { refresh, preparation } = resp;
    const params = new FilterParams();
    if (!refresh) {
      this.selectTab(TABS.LOTES_TAB);
      return;
    }
    this.loader.load = true;
    try {
      if (!preparation) {
        console.log('ACTU_MANDATO');

        await this.updateMand();
      }
      console.log('VERIFICA_RECHAZADOS');

      await this.verifyRejectedGoods();
      this.loader.load = false;
      this.comerLotsListParams.next(params);
      this.selectTab(TABS.LOTES_TAB);
    } catch (error) {
      this.loader.load = false;
    }
  }

  async verifyRejectedGoods() {
    const { id } = this.eventControls;
    return firstValueFrom(
      this.eventAppService.verifyRejectedGoods(id.value).pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(response => {
          const c: any = response;
          if (response.data > 0 || c > 0) {
            this.alert(
              'warning',
              'Advertencia',
              'Hubo Bienes Rechazados pulse el botón de Bienes no Cargados'
            );
          }
        })
      )
    );
  }

  async updateMand() {
    return firstValueFrom(
      this.lotService
        .updateMandate({
          pGood: this.parameters.pDirection == 'M' ? 0 : 1,
          pLot: 1,
          lotId: this.lotSelected.id,
        })
        .pipe(
          catchError(error => {
            return throwError(() => error);
          }),
          tap(res => {})
        )
    );
  }

  viewBase() {
    const { id, eventTpId } = this.eventControls;
    if (!id.value) {
      this.alert(
        'error',
        ' Error',
        'Para trabajar las bases requiere tener un evento abierto'
      );
      setTimeout(() => {
        this.selectTab(TABS.OPEN_TAB);
      });
      return;
    }
    if (eventTpId.value != 11) {
      this.alert(
        'error',
        'Error',
        'Para trabajar las bases el tipo debe ser Venta de Bases'
      );
      setTimeout(() => {
        this.selectTab(TABS.OPEN_TAB);
      });
      return;
    }
    this.fillStadistics();
  }

  onApply() {
    const params = new FilterParams();
    this.comerLotsListParams.next(params);
    this.selectTab(TABS.LOTES_TAB);
  }
}
