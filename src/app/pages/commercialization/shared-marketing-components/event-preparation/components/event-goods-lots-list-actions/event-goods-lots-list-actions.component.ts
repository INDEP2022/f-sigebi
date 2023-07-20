import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  of,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import Swal from 'sweetalert2';
import { EventPreparationService } from '../../event-preparation.service';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';

const ALLOWED_EXTENSIONS = ['xls', 'xlsx', 'csv'];
@Component({
  selector: 'event-goods-lots-list-actions',
  templateUrl: './event-goods-lots-list-actions.component.html',
  styles: [],
})
export class EventGoodsLotsListActionsComponent
  extends BasePage
  implements OnInit
{
  @Input() lotSelected: IComerLot;
  @Input() eventForm: FormGroup<ComerEventForm>;
  @Input() parameters: IEventPreparationParameters;
  @ViewChild('goodsLotifyInput', { static: true })
  goodsLotifyInput: ElementRef<HTMLInputElement>;
  @ViewChild('customersImportInput', { static: true })
  customersImportInput: ElementRef<HTMLInputElement>;
  @Input() params: BehaviorSubject<FilterParams>;
  goodsLotifyControl = new FormControl(null);
  get controls() {
    return this.eventForm.controls;
  }
  constructor(
    private router: Router,
    private eventPreparationService: EventPreparationService,
    private globalVarsService: GlobalVarsService,
    private comerEventService: ComerEventService,
    private lotService: LotService
  ) {
    super();
  }

  ngOnInit(): void {}

  isSomeItemSelected() {
    if (!this.lotSelected) {
      this.alert('error', 'Error', 'Primero Selecciona un Registro');
      return false;
    }
    return true;
  }

  isValidFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files.length) {
      return false;
    }
    if (target.files.length > 1) {
      this.alert('error', 'Error', 'Solo puede seleccionar un Archivo');
      return false;
    }
    const file = target.files[0];
    const filename = file.name;
    const extension = filename.split('.').at(-1);
    if (!extension) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    if (!ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    return true;
  }

  // ? -------------------- INCORPORAR BIENES DEL RASTREADOR
  async onLoadFromTracker() {
    if (!this.isSomeItemSelected()) {
      return;
    }
    const { eventTpId, statusVtaId } = this.controls;
    if (eventTpId.value == 9) {
      this.alert(
        'error',
        'Error',
        'Opción no disponible para este tipo de evento, lotifique desde archivo'
      );
      return;
    }

    if (this.lotSelected.publicLot == 0) {
      this.alert(
        'error',
        'Error',
        'El lote cero es exclusivo para el costo de bases del evento'
      );
      return;
    }
    if (
      this.parameters.pValids == 1 &&
      ['PREP', 'APRO', 'PUB', 'ACT'].includes(statusVtaId.value)
    ) {
      await this.loadFromGoodsTracker();
      return;
    }
    this.alert(
      'error',
      'Error',
      'Funcion no valida, no tiene permisos, o el evento ya esta vendido o conciliado'
    );
  }

  /**
   * PUP_INC_BIE_RASTREADOR
   */
  async loadFromGoodsTracker() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    const selfState = await this.eventPreparationService.getState();
    this.eventPreparationService.updateState({
      ...selfState,
      eventForm: this.eventForm,
      lastLot: Number(this.lotSelected.id) ?? -1,
      lastPublicLot: this.lotSelected.publicLot ?? 1,
    });

    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FCOMEREVENTOS',
      },
    });
  }

  // ? ------------------------ EXPORTAR A EXCEL

  async onExportExcel() {
    const forThirdQuestion = await this.alertQuestion(
      'question',
      '¿Archivo para Tercero?',
      '',
      'Si',
      'No'
    );
    if (forThirdQuestion.isConfirmed) {
      this.thirdFile();
      return;
    }
    const { statusVtaId } = this.controls;
    if (['PREP', 'APRO', 'PUB', 'ACT'].includes(statusVtaId.value)) {
      this.exportExcelLotGoods(this.parameters.pDirection).subscribe();
    } else {
      this.exportExcelCustomers(this.parameters.pDirection).subscribe();
    }
  }

  /**
   * ARCHIVO_TERCERO
   */
  thirdFile() {
    // TODO: IMPLEMENTAR CUANDO SE TENGA
    console.log('ARCHIVO_TERCERO');
  }

  /**
   * PUP_EXP_EXCEL_BIE_LOTE
   */
  exportExcelLotGoods(direction: 'M' | 'I') {
    const { id } = this.controls;
    return this.lotService.getGoodsExcel(id.value).pipe(
      catchError(error => {
        this.alert('error', 'Error', 'Ocurrió un Error al Generar el Archivo');
        return throwError(() => error);
      }),
      tap(res =>
        this._downloadExcelFromBase64(res.base64File, `Evento-${id.value}`)
      )
    );
  }

  /**
   * PUP_EXP_EXCEL_CLIENTES
   */
  exportExcelCustomers(direction: 'M' | 'I') {
    const { id } = this.controls;
    return this.lotService.getCustomersExcel(id.value).pipe(
      catchError(error => {
        this.alert('error', 'Error', 'Ocurrió un Error al Generar el Archivo');
        return throwError(() => error);
      }),
      tap(res =>
        this._downloadExcelFromBase64(res.base64File, `Evento-${id.value}`)
      )
    );
  }

  // ? ----------------------------- LOTIFICAR BIENES DESDE ARCHIVO EXCEL

  async onLotifyGoodsFromExcel() {
    const { eventTpId, statusVtaId } = this.controls;
    if ([6, 7].includes(Number(eventTpId.value))) {
      if (!(await this.validLotify())) {
        this.alert(
          'error',
          'Error',
          'Esta Remesa ya no se puede Lotificar, ya tiene Bienes Vendidos'
        );
        return;
      }
    }
    if (
      this.parameters.pValids == 1 &&
      ['PREP', 'APRO', 'PUB', 'ACT'].includes(statusVtaId.value)
    ) {
      this.goodsLotifyInput.nativeElement.click();
      return;
    }
    this.alert(
      'error',
      'Error',
      'Funcion no Válida, no tiene Permisos, o el Evento ya esta Vendido o Conciliado'
    );
  }

  async validLotify() {
    // TODO: IMPLEMENTAR CUANDO SE TENGA
    const { id } = this.controls;
    this.lotService
      .validLotifying(id.value)
      .pipe(
        catchError(error => {
          if (error?.status >= 500) {
            this.alert('error', 'Error', 'Ocurrió un Error Inesperado');
            return throwError(() => error);
          }
          return of(false);
        }),
        tap(res => {
          console.log(res);
        })
      )
      .subscribe();
    return await firstValueFrom(of(true));
  }

  lotifyGoodsChange(event: Event) {
    if (!this.isValidFile(event)) {
      this.goodsLotifyControl.reset();
      return;
    }
    this.lotifyGoods();
  }

  /**PUP_IMP_EXCEL_LOTES */
  lotifyGoods() {
    // TODO: IMPLEMENTAR CUANDO SE TENGA
    console.warn('PUP_IMP_EXCEL_LOTES');
  }

  // ? ------------------------------ CREAR ACTA, EVENTO PÚBLICO
  async onCreateCertificate() {
    const { id, eventTpId, statusVtaId, failureDate } = this.controls;
    if (!['PREP', 'APRO', 'PUB', 'ACT'].includes(statusVtaId.value)) {
      this.alert('error', 'Error', 'El Evento ya no puede Publicarse');
      return;
    }

    if (!failureDate.value) {
      this.alert(
        'error',
        'Error',
        'Debe especificar la Fecha Fallo del Evento'
      );
      return;
    }

    if (![1, 4].includes(Number(eventTpId.value))) {
      this.alert('error', 'Error', 'Tipo de Evento no Apto para Publicarse');
      return;
    }

    if (['PREP', 'APRO'].includes(statusVtaId.value)) {
      this.fillComerTmp().subscribe();
    } else if (['PUB', 'ACT'].includes(statusVtaId.value)) {
      this.updateComerTmp().subscribe();
    }
  }

  /**LLENA_TMP_COMER */
  fillComerTmp() {
    const { id, address } = this.controls;
    // TODO: ARROJA ERROR 500
    console.log('LLENA_TMP_COMER');
    return this.lotService
      .fillTmpComer({
        pdirec: address.value,
        pEvent: id.value,
      })
      .pipe(
        catchError(error => {
          if (error.status >= 500) {
            this.alert('error', 'Error', 'Ocurrió un Error Inesperado');
          }
          return throwError(() => error);
        }),
        tap(res => {
          const params = new FilterParams();
          this.params.next(params);
          this.alert('success', 'Proceso Terminado', '');
        })
      );
  }

  /**ACT_TMP_COMER */
  updateComerTmp() {
    const { id, address } = this.controls;
    // TODO: IMPLEMENTAR CUANDO SE TENGA
    console.log('ACT_TMP_COMER');
    return this.lotService
      .updateTmpComer({
        pdirec: address.value,
        pEvent: id.value,
      })
      .pipe(
        catchError(error => {
          if (error.status >= 500) {
            this.alert('error', 'Error', 'Ocurrió un Error Inesperado');
          }
          return throwError(() => error);
        }),
        tap(res => {
          const params = new FilterParams();
          this.params.next(params);
          this.alert('success', 'Proceso Terminado', '');
        })
      );
  }

  // ? --------------------------- LOTIFICAR CLIENTES DESDE ARCHIVO EXCEL

  async onLotifyCustomers() {
    const { statusVtaId, eventTpId } = this.controls;
    const valid = this.consignment();
    const canContinue =
      (valid && this.parameters.pValids == 1) || statusVtaId.value != 'CONC';
    if (!canContinue) {
      this.alert(
        'error',
        'Error',
        'Este tipo de evento no permite esta funcionalidad o Usted no tiene permisos'
      );
      return;
    }
    if (eventTpId.value == 2) {
      const checkLoadAsk = await this.alertQuestion(
        'question',
        '¿Se realizó previamente la carga de Cheques?',
        ''
      );
      if (checkLoadAsk.dismiss == Swal.DismissReason.cancel) {
        this.alert('warning', 'Advertencia', 'Favor de realizar la carga');
        return;
      }
    }

    this.customersImportInput.nativeElement.click();
  }

  /** REMESA */
  consignment() {
    const { eventTpId } = this.controls;
    return !(eventTpId.value == 6);
  }

  onCustomersImport(event: Event) {
    if (!this.isValidFile(event)) {
      return;
    }
    this.importCustomersLots();
  }

  /**PUP_IMP_EXCEL_LOTES_CLIENTE */
  importCustomersLots() {
    console.warn('PUP_IMP_EXCEL_LOTES_CLIENTE');
  }

  // ? ---------------------------------------
}
