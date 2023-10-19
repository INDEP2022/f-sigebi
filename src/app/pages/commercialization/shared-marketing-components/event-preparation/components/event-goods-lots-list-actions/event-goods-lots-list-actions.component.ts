import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  finalize,
  firstValueFrom,
  of,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IComerLot } from 'src/app/core/models/ms-prepareevent/comer-lot.model';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { UtilComerV1Service } from 'src/app/core/services/ms-prepareevent/util-comer-v1.service';
import { BasePage } from 'src/app/core/shared';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import Swal from 'sweetalert2';
import { EventPreparationService } from '../../event-preparation.service';
import { GroundsStatusModalComponent } from '../../grounds-status-modal/grounds-status-modal.component';
import { ComerEventForm } from '../../utils/forms/comer-event-form';
import { IEventPreparationParameters } from '../../utils/interfaces/event-preparation-parameters';
import { ComerEventTraspComponent } from '../comer-event-trasp/comer-event-trasp.component';

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
  @Input() loggedUser: TokenInfoModel;
  @ViewChild('goodsLotifyInput', { static: true })
  goodsLotifyInput: ElementRef<HTMLInputElement>;
  @ViewChild('customersImportInput', { static: true })
  customersImportInput: ElementRef<HTMLInputElement>;
  @ViewChild('invoiceInput', { static: true })
  invoiceInput: ElementRef<HTMLInputElement>;
  @ViewChild('invoiceDataInput', { static: true })
  invoiceDataInput: ElementRef<HTMLInputElement>;
  @ViewChild('saleBaseInput', { static: true })
  saleBaseInput: ElementRef<HTMLInputElement>;
  @ViewChild('customersBaseInput', { static: true })
  customersBaseInput: ElementRef<HTMLInputElement>;
  @ViewChild('customersTcInput', { static: true })
  customersTcInput: ElementRef<HTMLInputElement>;
  @Input() params: BehaviorSubject<FilterParams>;
  goodsLotifyControl = new FormControl(null);
  customersImportControl = new FormControl(null);
  invoiceControl = new FormControl(null);
  invoiceDataControl = new FormControl(null);
  saleBasesControl = new FormControl(null);
  customersBasecontrol = new FormControl(null);
  customersTccontrol = new FormControl(null);
  @Input() onlyBase = false;
  get controls() {
    return this.eventForm.controls;
  }
  @Input() viewRejectedGoods: boolean;
  @Output() viewRejectedGoodsChange = new EventEmitter<boolean>();
  @Output() fillStadistics = new EventEmitter<void>();
  @Input() totalItems = 0;
  constructor(
    private router: Router,
    private eventPreparationService: EventPreparationService,
    private globalVarsService: GlobalVarsService,
    private comerEventService: ComerEventService,
    private lotService: LotService,
    private modalService: BsModalService,
    private utilComerV1Service: UtilComerV1Service,
    private invoiceService: MsInvoiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.eventPreparationService.$lotifyGoods
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(event => {
          this.lotifyGoods(event);
        })
      )
      .subscribe();

    this.eventPreparationService.$lotifyCustomers
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(async event => {
          await this.onCustomersImport(event);
        })
      )
      .subscribe();
  }

  private getFileFromEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    const filename = file.name;
    return file;
  }

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
      executionType: this.onlyBase ? 'base' : 'normal',
    });

    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FCOMEREVENTOS',
      },
    });
  }

  // ? ------------------------ EXPORTAR A EXCEL

  async onExportExcel() {
    if (!this.totalItems) {
      this.alert('warning', 'No hay datos para exportar', '');
      return;
    }
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
    this.loader.load = true;
    const { id } = this.controls;
    return this.lotService.getGoodsExcel(id.value).pipe(
      catchError(error => {
        this.loader.load = false;
        this.alert('error', 'Error', 'Ocurrió un Error al Generar el Archivo');
        return throwError(() => error);
      }),
      tap(res => {
        this.loader.load = false;
        this._downloadExcelFromBase64(res.base64File, `Evento-${id.value}`);
      })
    );
  }

  /**
   * PUP_EXP_EXCEL_CLIENTES
   */
  exportExcelCustomers(direction: 'M' | 'I') {
    this.loader.load = true;
    const { id } = this.controls;
    return this.lotService.getCustomersExcel(id.value).pipe(
      catchError(error => {
        this.loader.load = false;
        this.alert('error', 'Error', 'Ocurrió un Error al Generar el Archivo');
        return throwError(() => error);
      }),
      tap(res => {
        this.loader.load = false;
        this._downloadExcelFromBase64(res.base64File, `Evento-${id.value}`);
      })
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
    const { id } = this.controls;
    return await firstValueFrom(
      this.lotService.validLotifying(id.value).pipe(
        catchError(error => {
          if (error?.status >= 500) {
            this.alert('error', 'Error', 'Ocurrió un Error Inesperado');
            return throwError(() => error);
          }
          return of({ aux: 0 });
        }),
        tap(res => res.aux == 1)
      )
    );
  }

  lotifyGoodsChange(event: Event) {
    if (!this.isValidFile(event)) {
      this.goodsLotifyControl.reset();
      return;
    }
    this.lotifyGoods(event);
  }

  /**PUP_IMP_EXCEL_LOTES */
  lotifyGoods(event: Event) {
    const file = this.getFileFromEvent(event);
    const { id, eventTpId, statusVtaId } = this.controls;
    const eventType = eventTpId.value;
    const validGood = 'S';
    const clean = 'S';
    const statusVta = statusVtaId.value;
    const address = this.parameters.pDirection;
    const user = this.loggedUser.preferred_username;
    this.loader.load = true;
    this.lotService
      .impLotExcel({
        file,
        event: `${id.value}`,
        eventType: eventType as string,
        validGood,
        clean,
        statusVta,
        address,
        user,
      })
      .subscribe({
        next: res => {
          this.loader.load = false;
          this.goodsLotifyControl.reset();
          console.log(res);
        },
        error: error => {
          this.loader.load = false;
          this.goodsLotifyControl.reset();
          console.log(error);
        },
      });
  }

  // ? ------------------------------ CREAR ACTA, EVENTO PÚBLICO
  async onCreateCertificate() {
    const { id, eventTpId, statusVtaId, failureDate } = this.controls;
    if (!['PREP', 'APRO', 'PUB', 'ACT'].includes(statusVtaId.value)) {
      this.alert('error', 'Error', 'El Evento ya no puede Publicarse');
      return;
    }

    if (![1, 4].includes(Number(eventTpId.value))) {
      this.alert('error', 'Error', 'Tipo de Evento no Apto para Publicarse');
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
    if (this.parameters.pDirection == 'I') {
      await this.onLotifyCustomersI();
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

  async onLotifyCustomersI() {
    const { statusVtaId, eventTpId } = this.controls;
    const valid = this.consignment();
    const alreadyPaid = true;
    if (!alreadyPaid) {
      this.alert(
        'error',
        'Error',
        'Este tipo de evento ya no admite carga de clientes'
      );
      return;
    }
    const repFailure = false;
    try {
      const { aprolot, catlot, totlot } = await this.lotifyCountLot();
      if (totlot != aprolot) {
        if (totlot != catlot) {
          this.alert(
            'error',
            'Error',
            'El Evento ya tiene un proceso adicional al fallo'
          );
          return;
        }
        await this.lotifyCountInvoice();
      }
    } catch (error) {
      this.alert('error', 'Error', UNEXPECTED_ERROR);
    }
  }

  async lotifyCountInvoice() {
    const { id } = this.controls;
    return await firstValueFrom(
      this.invoiceService.lotifyExcelCount(id.value).pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(response => {
          console.log(response);
        })
      )
    );
  }

  async lotifyCountLot() {
    const { id } = this.controls;
    return await firstValueFrom(
      this.lotService.lotifyExcelCount(id.value).pipe(
        catchError(error => {
          return throwError(() => error);
        }),
        tap(response => {
          console.log(response);
        })
      )
    );
  }

  /** REMESA */
  consignment() {
    const { eventTpId } = this.controls;
    return !(eventTpId.value == 6);
  }

  async onCustomersImport(event: Event) {
    if (!this.isValidFile(event)) {
      this.customersImportControl.reset();
      return;
    }
    const validFile = this.isValidFile(event);
    if (!validFile) {
      return;
    }
    const file = this.getFileFromEvent(event);
    const resp = await this.alertQuestion(
      'info',
      '¿El evento es desierto?',
      ''
    );
    let lifMessageYesNo: string = null;
    const { isConfirmed, dismiss } = resp;
    if (isConfirmed) {
      lifMessageYesNo = 'S';
    }
    if (dismiss == Swal.DismissReason.cancel) {
      lifMessageYesNo = 'N';
    }
    if (!lifMessageYesNo) {
      this.customersImportControl.reset();
      return;
    }
    this.importCustomersLots(file, lifMessageYesNo).subscribe();
  }

  /**PUP_IMP_EXCEL_LOTES_CLIENTE */
  importCustomersLots(file: File, lifMessageYesNo: string) {
    const { id, eventTpId } = this.eventForm.getRawValue();
    this.loader.load = true;
    return this.lotService
      .pupImpExcelBatchesCustomer({
        file,
        lifMessageYesNo,
        eventId: id,
        direction: this.parameters.pDirection,
        tpEventId: eventTpId,
        pClientId: '',
        pLotId: '',
      })
      .pipe(
        catchError(error => {
          this.alert('error', 'Error', UNEXPECTED_ERROR);
          return throwError(() => error);
        }),
        tap(response => {
          this.eventPreparationService.$refreshLots.next();
          this.eventPreparationService.$fillStadistics.next();
          this.alert('success', 'Proceso Terminado', '');
        }),
        finalize(() => {
          this.loader.load = false;
          this.customersImportControl.reset();
        })
      );
  }

  // ? ---------------------- Biens no Cargados

  onRejectedGoods() {
    this.viewRejectedGoodsChange.emit(true);
  }

  // ? ------------------- Cargar Facturas
  onLoadInvoices() {
    this.invoiceInput.nativeElement.click();
  }

  loadInvoiceChange(event: Event) {
    if (!this.isValidFile(event)) {
      this.invoiceControl.reset();
      return;
    }
    if (!this.onlyBase) {
      this.loadInvoice(event).subscribe();
    } else {
      this.loadBaseInvoice();
    }
  }

  /** C_FACTURA */
  loadInvoice(event: Event) {
    const { id } = this.controls;
    this.loader.load = true;
    const file = this.getFileFromEvent(event);
    return this.lotService.loadInvoice(id.value, file).pipe(
      catchError(error => {
        this.loader.load = false;
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        this.invoiceControl.reset();
        return throwError(() => error);
      }),
      tap(() => {
        this.loader.load = false;
        this.alert('success', 'Proceso Terminado', '');
        this.invoiceControl.reset();
        this.eventPreparationService.$refreshLotGoods.next();
      })
    );
  }

  // ? ---------------------- Revisa Trasf x Lote

  // ? ---------------------- Traspasar Bienes
  onTrasp() {
    this.modalService.show(ComerEventTraspComponent, {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
    });
  }

  // ? --------------------- Datos Para Facturación
  async onInvoiceData() {
    if (!this.lotSelected) {
      const askForAllEvent = await this.alertQuestion(
        'question',
        'Se Cargaran los Datos de Facturación para todo el Evento',
        '¿Desea Continuar?'
      );
      const { isConfirmed } = askForAllEvent;
      if (isConfirmed) {
        this.invoiceDataInput.nativeElement.click();
        return;
      }
    } else {
      const askForAllEvent = await this.alertQuestion(
        'question',
        `Se Cargaran los Datos de Facturación para el lote ${this.lotSelected.publicLot}`,
        '¿Desea Continuar?'
      );
      const { isConfirmed } = askForAllEvent;
      if (isConfirmed) {
        this.invoiceDataInput.nativeElement.click();
        return;
      }
    }
  }

  /**CARGA_DATOS_FACTURACION */
  loadInvoiceData(publicLot: string | number, file: File) {
    console.log(publicLot ? `Para el lote ${publicLot}` : 'Para todo el vento');
    const { id } = this.controls;
    this.loader.load = true;
    return this.lotService
      .loadInvoiceData({
        eventId: id.value,
        lot: publicLot,
        file: file,
        pDirection: this.parameters.pDirection,
      })
      .pipe(
        catchError(error => {
          this.loader.load = false;
          this.alert('error', 'Error', UNEXPECTED_ERROR);
          return throwError(() => error);
        }),
        tap(response => {
          this.loader.load = false;
          this.alert('success', 'Proceso Terminado', '');
          // this.refre
          const params = new FilterParams();
          this.params.next(params);
        })
      );
  }

  loadInvoiceDataChange(event: Event) {
    if (!this.isValidFile(event)) {
      this.invoiceDataControl.reset();
      return;
    }

    this.loadInvoiceData(
      this.lotSelected?.publicLot ?? null,
      this.getFileFromEvent(event)
    ).subscribe();
  }

  // ? Clientes desde Tabla Tercero

  async onLoadCustomersFromThird() {
    const ask = await this.alertQuestion(
      'question',
      'Eliga una opción',
      '',
      'Lotificación',
      'Cliente'
    );
    const { isConfirmed, dismiss } = ask;
    if (isConfirmed) {
      this.lotifyThirdTable().subscribe();
      return;
    }

    if (dismiss == Swal.DismissReason.cancel) {
      this.customersTcInput.nativeElement.click();
      return;
    }
  }

  /**LOTIFICA_TABLATC */
  lotifyThirdTable() {
    const { id, eventTpId } = this.controls;
    console.warn('LOTIFICA_TABLATC');
    const body = {
      event: id.value,
      typeEvent: eventTpId.value,
      address: this.parameters.pDirection,
      user: this.loggedUser.preferred_username,
      bank: this.parameters.pBank,
    };
    this.loader.load = true;
    return this.lotService.lotifyThirdTable(body).pipe(
      catchError(error => {
        this.loader.load = false;
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(response => {
        this.loader.load = false;
        this.alert('success', 'Proceso Terminado', '');
        const params = new FilterParams();
        this.params.next(params);
      })
    );
  }

  async onCustomersTc(event: Event) {
    if (this.isValidFile(event)) {
      this.customersTccontrol.reset();
      return;
    }
    const response = await this.alertQuestion(
      'question',
      '¿El evento es desierto?',
      ''
    );
    let lifMessageYesNo: string = null;
    const { isConfirmed, dismiss } = response;
    if (isConfirmed) {
      lifMessageYesNo = 'S';
    }
    if (dismiss == Swal.DismissReason.cancel) {
      lifMessageYesNo = 'N';
    }
    if (!lifMessageYesNo) {
      this.customersTccontrol.reset();
      return;
    }
    const file = this.getFileFromEvent(event);
    this.customersTc(file, lifMessageYesNo).subscribe();
  }

  /**CLIENTES_TC */
  customersTc(file: File, lifMessageYesNo: string) {
    const { id } = this.eventForm.getRawValue();
    this.loader.load = true;
    return this.lotService
      .clientsTc({
        file,
        lifMessageYesNo,
        eventId: id,
      })
      .pipe(
        catchError(error => {
          this.alert('error', 'Error', UNEXPECTED_ERROR);
          return throwError(() => error);
        }),
        tap(response => {
          this.alert('success', 'Proceso Terminado', '');
          const params = new FilterParams();
          this.params.next(params);
        }),
        finalize(() => {
          this.loader.load = false;
          this.customersTccontrol.reset();
        })
      );
  }

  // ? ---------------- Valida Bienes
  onValidGoods() {
    const { statusVtaId } = this.controls;
    const invalidStatuses = ['SOLV', 'VALV', 'VEN', 'CONC', 'CNE', 'DES'];
    if (invalidStatuses.includes(statusVtaId.value)) {
      this.alert(
        'error',
        'Error',
        `No puede eliminar bienes de este evento estatus de la venta: ${statusVtaId.value}`
      );
      return;
    }
    this.callRev();
  }

  /**PUP_LLAMA_REV */
  callRev() {
    const { eventTpId } = this.controls;
    // PARAMETROS A ENVIAR A LA PANTALLA
    const ESTATUS = this.reverseType();
    const ID_EVENTO = eventTpId.value;
    const P_DIRECCION = this.parameters.pDirection;
    // this.modalService.show(GroundsStatusModalComponent, {
    //   ...MODAL_CONFIG,
    // });
    let config: ModalOptions = {
      initialState: {
        ESTATUS,
        ID_EVENTO,
        P_DIRECCION,
        callback: (next: any) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GroundsStatusModalComponent, config);
  }

  /**TIPO_REVERSA */
  reverseType() {
    const { eventTpId } = this.controls;
    return [6, 10].includes(Number(eventTpId.value)) ? 'PRE' : 'CPV';
  }

  // ? --------------- Generar Oficio Avalúo
  onGenerateOffice() {
    const { eventTpId, tpsolavalId } = this.controls;
    if (Number(eventTpId.value) != 10) {
      this.alert(
        'error',
        'Error',
        'No puede solicitar avalúo para este tipo de evento'
      );
      return;
    }
    if (!tpsolavalId.value) {
      this.alert('error', 'Error', 'No ha seleccionado un tipo de solicitud');
      return;
    }
    // TODO: PREGUNTAR POR EL LLAMADO A ESTO: "http://172.20.230.57/Pantallas/Avaluos/SolicitudAvaluo.aspx?"
  }

  // ?------------------------- Verifica Mandato
  onVerifyMandate() {
    this.checkLotTransf().subscribe();
  }

  /**REVISA_TRANSF_X_LOTE */
  checkLotTransf() {
    this.loader.load = true;
    const { id } = this.controls;
    const eventId = id.value;
    const pLote = this.lotSelected?.id ?? null;
    return this.lotService.checkTransXLot({ eventId, pLote }).pipe(
      catchError(error => {
        this.loader.load = false;
        this.alert('error', ' Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(resp => {
        this.loader.load = false;
        this.validateTrasXLoteResponse(resp);
      })
    );
  }

  validateTrasXLoteResponse(resp: string | { data: string }) {
    if (typeof resp != 'string') {
      this.alert(
        'success',
        'Los Bienes de los Lotes pertenecen a un solo Mandato, Prueba Completada',
        ''
      );
      return;
    }
    const message = resp;
    const splitedMsg = message.split(' ');
    const lot = splitedMsg[2];
    this.alert(
      'warning',
      `El Lote ${
        lot ?? ''
      }  tiene Bienes de diferente Mandato, presione el botón Actualizar Mandato`,
      ''
    );
  }

  // * ----------------- ACCIONES DE BASE

  // ?-------------------- EXPORTAR EXCEL
  onBaseExportExcel() {
    this.baseThird().subscribe();
  }

  /**ARCHIVO_TERCERO_BASE */
  baseThird() {
    this.loader.load = true;
    const { id } = this.controls;
    return this.lotService.thirdBaseFile(id.value).pipe(
      catchError(error => {
        this.loader.load = false;
        this.alert('error', 'Error', 'Ocurrió un Error al Generar el Archivo');
        return throwError(() => error);
      }),
      tap(res => {
        this.loader.load = false;
        console.log(res);

        this._downloadExcelFromBase64(res.base64File, `Evento-${id.value}`);
      })
    );
  }

  //  ? -------------------- CARGA VENTA DE BASES
  onLoadBaseSales() {
    const { statusVtaId } = this.controls;
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
    this.saleBaseInput.nativeElement.click();
  }

  async loadSaleBases(event: Event) {
    if (!this.isValidFile(event)) {
      this.saleBasesControl.reset();
      return;
    }

    try {
      await this.impExcelBase(event);
      this.saleBasesControl.reset();
      const params = this.params.getValue();
      this.params.next(params);
      this.fillStadistics.emit();
    } catch (error) {
      this.saleBasesControl.reset();
    }
  }

  async impExcelBase(event: Event) {
    return firstValueFrom(
      this.createBases(event).pipe(switchMap(() => this.calculatePrices()))
    );
  }

  /** CREATE_BASES */
  createBases(event: Event) {
    const { id, baseCost } = this.controls;
    this.loader.load = true;
    const file = this.getFileFromEvent(event);
    return this.lotService
      .createBases({
        eventId: id.value,
        costBase: baseCost.value,
        file,
      })
      .pipe(
        catchError(error => {
          this.loader.load = false;

          this.alert('error', ' Error', UNEXPECTED_ERROR);
          return throwError(() => error);
        }),
        tap(() => {
          this.loader.load = false;
        })
      );
  }

  /** CALCULA_PRECIOS_SALIDA */
  calculatePrices() {
    const { id } = this.controls;
    this.loader.load = true;
    return this.utilComerV1Service
      .salePrices({ event: id.value, lot: null })
      .pipe(
        catchError(error => {
          this.loader.load = false;
          this.alert('error', ' Error', UNEXPECTED_ERROR);
          return throwError(() => error);
        }),
        tap(() => {
          this.loader.load = false;
          this.alert('success', 'Proceso Terminado', '');
        })
      );
  }

  // ? -------------- CARGA CLIENTES BASE
  onLoadBaseCustomers() {
    const { statusVtaId } = this.controls;
    const valid = this.consignment();
    const canContinue =
      (valid && this.parameters.pValids) || statusVtaId.value == 'CONC';
    if (!canContinue) {
      this.alert(
        'error',
        'Error',
        'Este tipo de evento no permite esta funcionalidad o Usted no tiene permisos'
      );
      return;
    }

    this.customersBaseInput.nativeElement.click();
  }

  loadCustomersBase(event: Event) {
    if (!this.isValidFile(event)) {
      this.customersBasecontrol.reset();
      return;
    }
    this.impBaseCustomers(event).subscribe();
  }

  impBaseCustomers(event: Event) {
    console.warn('PUP_IMP_EXCEL_BASES_CLIENTE');
    this.loader.load = true;
    const file = this.getFileFromEvent(event);
    const { id } = this.controls;
    const body: any = {
      file,
      eventId: id.value,
      lot: null,
      base: null,
    };
    return this.lotService.importCustomersBase(body).pipe(
      catchError(error => {
        this.loader.load = false;
        this.customersBasecontrol.reset();
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(response => {
        this.loader.load = false;
        this.customersBasecontrol.reset();
        if (typeof response == 'string') {
          this.alert('info', response, '');
          return;
        }
        this.alert('success', 'Proceso Terminado', '');
      })
    );
  }

  // ? --------------- Carga Factura
  // CARGA_FACTURA
  loadBaseInvoice() {
    // TODO: IMPLEMENTAR CUANDO SE TENGA
    console.warn('CARGA_FACTURA');
  }
}
