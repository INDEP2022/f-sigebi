import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  take,
  takeUntil,
} from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IConcept } from 'src/app/core/models/ms-comer-concepts/concepts';
import { IParameterConcept } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { IParameterMod } from 'src/app/core/models/ms-comer-concepts/parameter-mod.model';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared';
import { secondFormatDateToDateAny } from 'src/app/shared/utils/date';
import { ILoadLotResponse } from '../../models/lot';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { ExpenseGoodProcessService } from '../../services/expense-good-process.service';
import { ExpenseLotService } from '../../services/expense-lot.service';
import { ExpenseMassiveGoodService } from '../../services/expense-massive-good.service';
import { ExpenseModalService } from '../../services/expense-modal.service';
import { ExpenseScreenService } from '../../services/expense-screen.service';
import { SpentIService } from '../../services/spentI.service';
import { SpentMService } from '../../services/spentM.service';
import { NotifyComponent } from '../notify/notify.component';
import { COLUMNS } from './columns';
import { RetentionsModalComponent } from './retentions-modal/retentions-modal.component';

@Component({
  selector: 'app-expense-comercial',
  templateUrl: './expense-comercial.component.html',
  styleUrls: ['./expense-comercial.component.scss'],
})
export class ExpenseComercialComponent extends BasePage implements OnInit {
  @Input() get address() {
    return this.dataService.address;
  }
  set address(value) {
    const list = [];
    if (value === 'M') {
      // this._address = value;
      this.resetVisiblesM();
      list.push({ value: 'C', title: 'GENERAL' });
      list.push({ value: 'M', title: 'MUEBLES' });
    } else if (value === 'I') {
      this.initScreenI();
    }
    this.columns = {
      ...COLUMNS,
      address: {
        ...COLUMNS.address,
        filter: {
          type: 'list',
          config: {
            selectText: 'Seleccionar',
            list,
          },
        },
      },
    };
  }

  provider: string;
  showCvePoliza = false;
  showEvent = true;
  showLote = true;
  //
  toggleInformation = true;
  ilikeFilters = [
    'attachedDocumentation',
    'comment',
    'nomEmplAuthorizes',
    'nomEmplRequest',
    'nomEmplcapture',
    'providerName',
    'usu_captura_siab',
    'eventDescription',
  ];
  dateFilters = [
    'captureDate',
    'invoiceRecDate',
    'payDay',
    'captureDate',
    'fecha_contrarecibo',
    'spDate',
    'dateOfResolution',
  ];
  columns: any;
  constructor(
    private dataService: ExpenseCaptureDataService,
    private spentMService: SpentMService,
    private spentIService: SpentIService,
    private spentService2: SpentService,
    private comerEventService: ComerEventosService,
    private screenService: ExpenseScreenService,
    private modalService: BsModalService,
    private parameterModService: ParametersModService,
    private sirsaeService: InterfacesirsaeService,
    private documentService: DocumentsService,
    private expenseGoodProcessService: ExpenseGoodProcessService,
    private authService: AuthService,
    private segAccessAreaService: SegAcessXAreasService,
    private lotService: ExpenseLotService,
    private eventService: EventAppService,
    private dictationService: DictationService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private massiveGoodService: ExpenseMassiveGoodService,
    private expenseModalService: ExpenseModalService,
    private parameterService: ParametersConceptsService
  ) {
    super();
    this.dataService.user = this.authService.decodeToken();
    const filterParams = new FilterParams();
    filterParams.addFilter('user', this.user.preferred_username);
    // filterParams.addFilter('user', 'HTORTOLERO');
    this.segAccessAreaService
      .getAll(filterParams.getParams())
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response) {
            const data = response.data;
            if (data && data.length > 0) {
              this.delegation = data[0].delegationNumber;
              this.subDelegation = data[0].subdelegationNumber;
              this.noDepartamento = data[0].departamentNumber;
            }
          }
        },
      });
    this.dataService.saveSubject.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        if (response) {
          this.save();
        }
      },
    });
    // console.log(user);
    this.prepareForm();
  }

  get user() {
    return this.dataService.user;
  }

  get delegation() {
    return this.dataService.delegation;
  }

  set delegation(value) {
    this.dataService.delegation = value;
  }

  get subDelegation() {
    return this.dataService.subDelegation;
  }

  set subDelegation(value) {
    this.dataService.subDelegation = value;
  }

  get noDepartamento() {
    return this.dataService.noDepartamento;
  }

  set noDepartamento(value) {
    this.dataService.noDepartamento = value;
  }

  private getBody() {
    console.log(this.form.value);
    let newBody = { ...this.form.value };
    delete newBody.publicLot;
    delete newBody.policie;
    delete newBody.descontract;
    delete newBody.padj;
    delete newBody.psadj;
    delete newBody.pssadj;
    delete newBody.cadena;
    return {
      ...newBody,
      amount: this.dataService.amount ?? 0,
      vat: this.dataService.vat ?? 0,
      vatWithheld: this.dataService.vatWithholding ?? 0,
      address: this.data ? this.data.address ?? this.address : this.address,
      dateOfResolution: this.form.value.dateOfResolution
        ? (this.form.value.dateOfResolution + '').trim().length > 0
          ? this.form.value.dateOfResolution
          : null
        : null,
      invoiceRecDate: this.form.value.invoiceRecDate
        ? (this.form.value.invoiceRecDate + '').trim().length > 0
          ? this.form.value.invoiceRecDate
          : null
        : null,
      payDay: this.form.value.payDay
        ? (this.form.value.payDay + '').trim().length > 0
          ? this.form.value.payDay
          : null
        : null,
      captureDate: this.form.value.captureDate
        ? (this.form.value.captureDate + '').trim().length > 0
          ? this.form.value.captureDate
          : null
        : null,
      fecha_contrarecibo: this.form.value.fecha_contrarecibo
        ? (this.form.value.fecha_contrarecibo + '').trim().length > 0
          ? this.form.value.fecha_contrarecibo
          : null
        : null,
      providerName: this.provider ?? '',
      comment: this.form.value.comment ?? '',
      monthExpense: this.form.value.monthExpense ? '1' : null,
      monthExpense2: this.form.value.monthExpense2 ? '2' : null,
      monthExpense3: this.form.value.monthExpense3 ? '3' : null,
      monthExpense4: this.form.value.monthExpense4 ? '4' : null,
      monthExpense5: this.form.value.monthExpense5 ? '5' : null,
      monthExpense6: this.form.value.monthExpense6 ? '6' : null,
      monthExpense7: this.form.value.monthExpense7 ? '7' : null,
      monthExpense8: this.form.value.monthExpense8 ? '8' : null,
      monthExpense9: this.form.value.monthExpense9 ? '9' : null,
      monthExpense10: this.form.value.monthExpense10 ? '10' : null,
      monthExpense11: this.form.value.monthExpense11 ? '11' : null,
      monthExpense12: this.form.value.monthExpense12 ? '12' : null,
    };
  }

  edit() {
    // let body = this.getBody();
    // console.log(this.data);
    // console.log(this.form.value);
    // return;
    this.spentService2
      .edit(this.getBody())
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.loader.load = false;
          this.alert(
            'success',
            'Se ha actualizado el gasto ' + this.expenseNumber.value,
            ''
          );
          this.fillFormSecond({
            ...this.data,
            ...this.form.value,
            amount: this.dataService.amount ?? 0,
            vat: this.dataService.vat ?? 0,
            vatWithheld: this.dataService.vatWithholding ?? 0,
            address: this.data.address ?? this.address,
          });
        },
        error: err => {
          this.alert(
            'error',
            'No se pudo actualizar el gasto ' + this.expenseNumber.value,
            'Favor de verificar'
          );
          this.loader.load = false;
        },
      });
  }

  clean(updateOthers = true) {
    this.dataService.clean();
    this.provider = null;

    if (updateOthers) {
      this.dataService.updateOI.next(true);
      this.dataService.resetExpenseComposition.next(true);
      this.dataService.updateFolio.next(true);
    }
  }

  delete() {
    // this.alert('success', 'Se elimino el gasto', '');
    // return;
    this.alertQuestion('question', '¿Desea eliminar el gasto?', '').then(x => {
      if (x.isConfirmed) {
        this.loader.load = true;
        this.spentService2
          .remove(this.data.expenseNumber)
          .pipe(take(1))
          .subscribe({
            next: response => {
              this.loader.load = false;
              this.clean();
              this.alert('success', 'Se elimino el gasto', '');
            },
            error: err => {
              this.loader.load = false;
              this.alert('error', 'No se pudo eliminar el gasto', '');
            },
          });
      }
    });
  }

  async save() {
    if (!this.validatePaymentCamps()) {
      return;
    }
    if (this.address === 'M') {
      if (!this.dataService.validPayment) {
        const responsePayments = await this.validPayments();
        // console.log(responsePayments);
        if (responsePayments.message[0] !== 'OK') {
          this.alert(
            'error',
            'Sucedió un error en la validación de pagos',
            'Favor de verificar'
          );
          return;
        } else {
          this.dataService.validPayment = true;
        }
      }
    }

    this.loader.load = true;
    // if (this.form.invalid) {
    //   const invalid = [];
    //   console.log(this.form.value);
    //   const controls = this.form.controls;
    //   for (const name in controls) {
    //     if (controls[name].invalid) {
    //       invalid.push(name);
    //     }
    //   }
    //   console.log(invalid);
    //   return;
    // }
    if (this.expenseNumber.value) {
      this.edit();
    } else {
      this.spentService2
        .save(this.getBody())
        .pipe(take(1))
        .subscribe({
          next: response => {
            console.log(response);
            this.alert('success', 'Se ha creado el gasto correctamente', '');
            // this.expenseNumber.setValue(response.expenseNumber);
            this.loader.load = false;
            this.fillFormSecond({
              ...this.form.value,
              expenseNumber: response.expenseNumber,
              amount: this.dataService.amount ?? 0,
              vat: this.dataService.vat ?? 0,
              vatWithheld: this.dataService.vatWithholding ?? 0,
              address: this.address,
            });
          },
          error: err => {
            this.alert(
              'error',
              'No se pudo crear el gasto',
              'Favor de verificar'
            );
            this.loader.load = false;
          },
        });
    }
  }

  get spentService() {
    return this.address
      ? this.address === 'M'
        ? this.spentMService
        : this.spentIService
      : null;
  }

  private resetVisiblesM() {
    this.showEvent = true;
    this.showLote = true;
    this.showTipoOp = false;
    this.showTipoTram = false;
    this.showContract = false;
    this.showTipAdj = false;
    this.showAdj = false;
    this.showCvePoliza = false;
    this.VISIBLE_PB_ESTATUS = true;
    this.VISIBLE_CARGA_BIENES = true;
    this.VISIBLE_DISPERSA = true;
  }

  get showTipoOp() {
    return this.dataService.showTipoOp;
  }

  get showTipoTram() {
    return this.dataService.showTipoTram;
  }

  get showContract() {
    return this.dataService.showContract;
  }

  get showTipAdj() {
    return this.dataService.showTipAdj;
  }

  get showAdj() {
    return this.dataService.showAdj;
  }

  set showTipoOp(value) {
    this.dataService.showTipoOp = value;
  }

  set showTipoTram(value) {
    this.dataService.showTipoTram = value;
  }

  set showContract(value) {
    this.dataService.showContract = value;
  }

  set showTipAdj(value) {
    this.dataService.showTipAdj = value;
  }

  set showAdj(value) {
    this.dataService.showAdj = value;
  }

  get VISIBLE_PB_ESTATUS() {
    return this.dataService.VISIBLE_PB_ESTATUS;
  }

  set VISIBLE_PB_ESTATUS(value) {
    this.dataService.VISIBLE_PB_ESTATUS = value;
  }

  get VISIBLE_CARGA_BIENES() {
    return this.dataService.VISIBLE_CARGA_BIENES;
  }

  set VISIBLE_CARGA_BIENES(value) {
    this.dataService.VISIBLE_CARGA_BIENES = value;
  }

  get VISIBLE_DISPERSA() {
    return this.dataService.VISIBLE_DISPERSA;
  }

  set VISIBLE_DISPERSA(value) {
    this.dataService.VISIBLE_DISPERSA = value;
  }

  private async initScreenI() {
    // debugger;
    const list = [];
    let filterParams = new FilterParams();
    let user = this.user.preferred_username; //'AJIMENEZC';
    filterParams.addFilter(
      'typeNumber',
      'GASTOINMU,GASTOVIG,GASTOSEG,GASTOADMI',
      SearchFilter.IN
    );
    filterParams.addFilter('user', user);
    let v_tip_gast = 0,
      v_tipo = null;
    let rtDicta = await firstValueFrom(
      this.dictationService.getRTdictaAarusr(filterParams.getParams()).pipe(
        take(1),
        catchError(x => {
          return of({ data: [] });
        }),
        map(x => x.data)
      )
    );
    if (rtDicta.length > 0) {
      v_tip_gast = rtDicta.length;
      v_tipo = rtDicta[0].typeNumber;
    } else {
      v_tip_gast = null;
    }
    this.showAdj = true;
    if (v_tip_gast !== 0 && v_tipo !== 'GASTOSEG') {
      this.showEvent = false;
      this.showLote = false;
      this.VISIBLE_PB_ESTATUS = false;
      this.VISIBLE_CARGA_BIENES = false;
      this.VISIBLE_DISPERSA = false;
      this.showTipoOp = true;
      this.showTipoTram = true;
      this.showContract = true;
      this.showTipAdj = true;
      this.showAdj = true;
      this.showCvePoliza = false;
      // this._address = 'J';
      this.dataService.address = 'J';

      let filterParams2 = new FilterParams();
      filterParams2.addFilter('user', user);
      let rtDicta2 = await firstValueFrom(
        this.dictationService.getRTdictaAarusr(filterParams2.getParams()).pipe(
          take(1),
          catchError(x => {
            return of({ data: [] });
          }),
          map(x => x.data)
        )
      );
      if (rtDicta2.length > 0) {
        this.fillAddressNotM(rtDicta2[0].typeNumber);
      } else {
        this.alert('warning', 'Usuario no válido', 'Favor de verificar');
      }
    } else if (v_tip_gast !== 0 && v_tipo === 'GASTOSEG') {
      this.showEvent = false;
      this.showLote = false;
      this.VISIBLE_PB_ESTATUS = false;
      this.VISIBLE_CARGA_BIENES = false;
      this.VISIBLE_DISPERSA = false;
      this.showTipoOp = true;
      this.showTipoTram = true;
      this.showContract = true;
      this.showTipAdj = true;
      this.showAdj = true;
      this.showCvePoliza = true;
      let filterParams2 = new FilterParams();
      filterParams2.addFilter('user', user);
      let rtDicta2 = await firstValueFrom(
        this.dictationService.getRTdictaAarusr(filterParams2.getParams()).pipe(
          take(1),
          catchError(x => {
            return of({ data: [] });
          }),
          map(x => x.data)
        )
      );
      if (rtDicta2.length > 0) {
        let v_no_tipo = rtDicta2[0].typeNumber;
        if (v_no_tipo === 'GASTOSEG') {
          // this._address = 'S';
          this.dataService.address = 'S';
        }
      } else {
        this.alert('warning', 'Usuario no válido', 'Favor de verificar');
      }
    } else {
      this.showTipoOp = false;
      this.showTipoTram = false;
      this.showContract = false;
      this.showTipAdj = false;
      this.showAdj = false;
      this.showCvePoliza = false;
    }
    // v_tip_gast = 0;
    if (v_tip_gast === 0) {
      // this._address = 'I';
      this.dataService.address = 'I';
      this.PDIRECCION_A = 'C';
      list.push({ value: 'C', title: 'GENERAL' });
      list.push({ value: 'I', title: 'INMUEBLES' });
    }
  }

  get PDIRECCION_A() {
    return this.dataService.PDIRECCION_A;
  }

  set PDIRECCION_A(value) {
    this.dataService.PDIRECCION_A = value;
  }

  // async ngOnChanges(changes: SimpleChanges) {
  //   if (changes['address'] && changes['address'].currentValue) {

  //   }
  // }

  get data() {
    return this.dataService.data;
  }

  set data(value) {
    this.dataService.data = value;
  }

  get form() {
    return this.dataService.form;
  }

  get expenseNumber() {
    return this.form.get('expenseNumber');
  }

  get expenseNumberValue() {
    return this.expenseNumber ? this.expenseNumber.value : null;
  }

  get conceptNumber() {
    return this.form.get('conceptNumber');
  }
  get paymentRequestNumber() {
    return this.form.get('paymentRequestNumber');
  }

  get idOrdinginter() {
    return this.form.get('idOrdinginter');
  }

  get eventNumber() {
    return this.form.get('eventNumber');
  }
  get lotNumber() {
    return this.form.get('lotNumber');
  }

  get publicLot() {
    return this.dataService.publicLot;
  }

  // set publicLot(value) {
  //   this.dataService.publicLot = value;
  // }

  get folioAtnCustomer() {
    return this.form.get('folioAtnCustomer');
  }

  get dateOfResolution() {
    return this.form.get('dateOfResolution');
  }

  get payDay() {
    return this.form.get('payDay');
  }

  get fecha_contrarecibo() {
    return this.form.get('fecha_contrarecibo');
  }

  get formPayment() {
    return this.form.get('formPayment');
  }

  get comproafmandsae() {
    return this.form.get('comproafmandsae');
  }

  get clkpv() {
    return this.form.get('clkpv');
  }

  get descurcoord() {
    return this.form.get('descurcoord');
  }

  get comment() {
    return this.form.get('comment');
  }

  get invoiceRecNumber() {
    return this.form.get('invoiceRecNumber');
  }

  ngOnInit() {
    this.eventNumber.valueChanges.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        this.publicLot.setValue(null, { emitEvent: false });
        this.lotNumber.setValue(null, { emitEvent: false });
      },
    });
    // this.lotNumber.valueChanges.subscribe({
    //   next: response => {
    //     console.log(response);
    //     if (response) {
    //       this.nextItemLote();
    //     }
    //   },
    // });
    if (localStorage.getItem('eventExpense')) {
      this.fillForm(JSON.parse(localStorage.getItem('eventExpense')));
      setTimeout(() => {
        localStorage.removeItem('eventExpense');
      }, 500);
    }
    // this.expenseModalService.selectedMotivesSubject.subscribe({
    //   next: response => {
    //     console.log(response);
    //   },
    // });
  }

  private usuarioCapturaDataI(user: string) {
    let filterParams = new FilterParams();
    filterParams.addFilter('description', user, SearchFilter.ILIKE);
    filterParams.limit = 1;
    return firstValueFrom(
      this.parameterService.getAll(filterParams.getParams()).pipe(
        take(1),
        catchError(x => of({ data: [] as IParameterConcept[] })),
        map(x => {
          return x.data.length > 0 ? x.data[0] : null;
        })
      )
    );
  }

  private usuarioParametro(param: string) {
    let filterParams = new FilterParams();
    filterParams.addFilter('parameter', param);
    filterParams.addFilter('address', this.address);
    filterParams.limit = 1;
    return firstValueFrom(
      this.parameterService.getAll(filterParams.getParams()).pipe(
        take(1),
        catchError(x => of({ data: [] as IParameterConcept[] })),
        map(x => {
          return x.data.length > 0 ? x.data[0] : null;
        })
      )
    );
  }

  private base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // this.fullService.generatingFileFlag.next({
    //   progress: 100,
    //   showText: false,
    // });

    return bytes.buffer;
  }

  private downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    // this.excelLoading = true;
    this.alert('success', 'El reporte se ha descargado', '');
    URL.revokeObjectURL(objURL);
  }

  exportExcel() {
    if (this.expenseNumberValue) {
      this.alertQuestion('question', '¿Desea exportar el gasto?', '').then(
        x => {
          if (x.isConfirmed) {
            // this.excelLoading = true;
            this.massiveGoodService
              .PUP_EXPOR_ARCHIVO_BASE(this.expenseNumberValue)
              .pipe(take(1))
              .subscribe({
                next: data => {
                  // this.excelLoading = false;
                  this.alert(
                    'warning',
                    'El archivo se esta generando, favor de esperar la descarga',
                    ''
                  );
                  this.downloadDocument('Gastos', 'excel', data);
                },
              });
          }
        }
      );
    } else {
      this.alert('warning', 'Debe seleccionar un gasto antes de exportar', '');
    }
  }

  private fillAddressNotM(v_tipo: string) {
    if (v_tipo === 'GASTOINMU') {
      // this._address = 'J';
      this.dataService.address = 'J';
    }
    if (v_tipo === 'GASTOVIG') {
      // this._address = 'V';
      this.dataService.address = 'V';
    }
    if (v_tipo === 'GASTOSEG') {
      // this._address = 'S';
      this.dataService.address = 'S';
    }
    if (v_tipo === 'GASTOADMI') {
      // this._address = 'A';
      this.dataService.address = 'A';
    }
  }

  async selectConcept(concept: IConcept) {
    if (!concept) return;
    if (this.address && this.address !== 'M') {
      let filterParams = new FilterParams();
      let user = this.user.preferred_username; //'PLAMAR';
      filterParams.addFilter(
        'typeNumber',
        'GASTOINMU,GASTOVIG,GASTOSEG,GASTOADMI',
        SearchFilter.IN
      );
      filterParams.addFilter('user', user);
      let rtDicta = await firstValueFrom(
        this.dictationService.getRTdictaAarusr(filterParams.getParams()).pipe(
          take(1),
          catchError(x => {
            return of({ data: [] });
          }),
          map(x => x.data)
        )
      );
      if (rtDicta.length > 0) {
        this.fillAddressNotM(rtDicta[0].typeNumber);
      }
      let usuarioCapturaData = await this.usuarioCapturaDataI(user);
      if (usuarioCapturaData) {
        this.form.get('capturedUser').setValue(usuarioCapturaData.value);
      }
      let usuarioAutorizaData = await this.usuarioParametro('USUAUTORIZA');
      if (usuarioAutorizaData) {
        this.form.get('authorizedUser').setValue(usuarioAutorizaData.value);
      }
      let usuarioSolicitaData = await this.usuarioParametro('USUSOLICITA');
      if (usuarioSolicitaData) {
        this.form.get('requestedUser').setValue(usuarioSolicitaData.value);
      }
      // this._address = 'I';
      this.dataService.address = 'I';
    }
    await this.readParams(concept.id);
  }

  updateLot(lot: { lotPublic: string; idLot: string; idEvent: string }) {
    console.log(lot);
    if (lot) {
      this.lotNumber.setValue(lot.idLot);
      if (this.address === 'M') {
        this.nextItemLote();
      }
      this.dataService.LS_EVENTO = +lot.idEvent;
    } else {
      this.lotNumber.setValue(null);
    }
  }

  updateProvider(event: any) {
    console.log(event);
    this.provider = event ? event.pvName : '';
  }

  reloadLoteEvent(event: any) {
    console.log(event);
    if (event)
      this.comerEventService
        .getMANDXEVENTO(event.id)
        .pipe(take(1))
        .subscribe({
          next: response => {
            if (response && response.data) {
              if (response.data.event > 0) {
                this.eventNumber.setValue(null);
                this.alert(
                  'error',

                  'Contiene bienes de más de un mandato verifique',
                  ''
                );
              }
            }
          },
        });
    // setTimeout(() => {
    //   this.reloadLote = !this.reloadLote;
    // }, 500);
  }

  readParams(id: string) {
    return this.dataService.readParams(id);
  }

  private async showModalNotify() {
    this.loader.load = true;
    let filterParams = new FilterParams();
    filterParams.addFilter(
      'id',
      this.dataService.formScan.get('folioUniversal').value,
      SearchFilter.EQ
    );
    filterParams.addFilter(
      'associateUniversalFolio',
      this.dataService.formScan.get('folioUniversal').value,
      SearchFilter.OR
    );
    filterParams.addFilter('sheets', 0, SearchFilter.GT);
    filterParams.addFilter('scanStatus', 'ESCANEADO', SearchFilter.ILIKE);
    let documents = await firstValueFrom(
      this.documentService.getAll(filterParams.getParams()).pipe(
        take(1),
        catchError(x => of({ data: null, message: x })),
        map(x => {
          return x.data;
        })
      )
    );
    if (!documents) {
      this.loader.load = false;
      this.alert('error', 'No a escaneado los documentos', '');
      return;
    }
    this.expenseGoodProcessService
      .replyFolio({
        goodArray: this.dataService.dataCompositionExpenses
          .filter(x => x.goodNumber)
          .map(x => {
            return { goodNumber: +x.goodNumber };
          }),
        delegationNumber: this.delegation,
        subdelegationNumber: this.subDelegation,
        departamentNumber: this.noDepartamento,
        universalFolio: this.dataService.formScan.get('folioUniversal').value,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          let config: ModalOptions = {
            initialState: {
              asunto: 'Cancelación de Venta ' + this.provider,
              // message,
              // action,
              // proceeding: this.proceedingForm.value,
              callback: (next: boolean) => {
                if (next) {
                  // const id = this.controls.keysProceedings.value;
                  // this.findProceeding(id).subscribe();
                }
              },
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.loader.load = false;
          this.modalService.show(NotifyComponent, config);
        },
        error: err => {
          this.loader.load = false;
          this.alert('error', 'No se ha guardado el folio de escaneo', '');
        },
      });
  }
  async notify() {
    // console.log('Notificar');

    if (!this.expenseNumber) {
      this.alert(
        'warning',
        'No puede mandar correo si no a guardado el gasto',
        ''
      );
      return;
    }
    if (!this.dataService.validateNotifyFirst()) {
      this.alert(
        'warning',
        'Tiene que llenar alguno de los campos',
        'Concepto, Evento, Proveedor, Detalle de gasto con bien'
      );
      return;
    }
    if (!this.dataService.formScan.get('folioUniversal').value) {
      this.alert('warning', 'No se han escaneado los documentos', '');
      return;
    }
    this.alertQuestion('question', '¿Desea notificar por correo?', '').then(
      x => {
        if (x.isConfirmed) {
          this.showModalNotify();
        }
      }
    );
  }

  private getParamValConcept(conceptNumber: number) {
    const filterParams = new FilterParams();
    filterParams.addFilter('parameter', 'VAL_CONCEPTO');
    filterParams.addFilter('value', conceptNumber);
    return firstValueFrom(
      this.parameterModService.getAllFilter(filterParams.getParams()).pipe(
        take(1),
        catchError(x => {
          return of(null);
        }),
        map(x => x && x.data && x.data.length > 0)
      )
    );
  }

  private URCOORDREGCHATARRA_AUTOMATICO(opcion: number) {
    return this.eventService.urcoordRegChatarraAutomatic(
      this.conceptNumber.value,
      opcion
    );
  }

  private updateGoodsByLote(response: ILoadLotResponse) {
    let { selectChange } = response;
    this.dataService.SELECT_CAMBIA_CLASIF_ENABLED =
      selectChange.SELECT_CAMBIA_CLASIF_ENABLED;
    this.dataService.SELECT_CAMBIA_CLASIF_UPDATE =
      selectChange.SELECT_CAMBIA_CLASIF_UPDATE;
    this.dataService.V_BIEN_REP_ROBO += selectChange.V_BIEN_REP_ROBO;
    if (selectChange.SELECT_CAMBIA_CLASIF === 'S') {
      this.dataService.SELECT_CAMBIA_CLASIF = true;
    } else {
      this.dataService.SELECT_CAMBIA_CLASIF = false;
    }
    this.dataService.addByLotExpenseComposition.next(response);
  }

  private CARGA_BIENES_LOTE_XDELRES(
    v_id_evento: number,
    v_id_lote: number,
    id_concepto: number
  ) {
    this.lotService
      .CARGA_BIENES_LOTE_DELRES({
        v_id_evento,
        v_id_lote,
        id_concepto,
        cve_pantalla: 'FCOMER084',
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response) {
            console.log(response);
            this.alert('success', 'Se han cargado los bienes del lote', '');
            this.updateGoodsByLote(response);
          }
        },
        error: err => {
          this.alert(
            'warning',
            'No se pudieron cargar los bienes del lote',
            'Favor de verificar'
          );
        },
      });
  }

  private CARGA_BIENES_LOTE(pEventId: number, pBatchId: number) {
    this.lotService
      .CARGA_BIENES_LOTE({
        pEventId,
        pBatchId,
        pConceptoId: this.conceptNumberValue,
        pScreen: 'FCOMER084',
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response) {
            console.log(response);
            this.alert('success', 'Se han cargado los bienes del lote', '');
            this.updateGoodsByLote(response);
          }
        },
        error: err => {
          this.alert(
            'warning',
            'No se pudieron cargar los bienes del lote',
            'Favor de verificar'
          );
        },
      });
  }

  get PVALIDADET() {
    return this.dataService.PVALIDADET;
  }

  async nextItemLote() {
    // this.CARGA_BIENES_LOTE_XDELRES(
    //   this.eventNumber.value,
    //   this.lotNumber.value,
    //   this.conceptNumber.value
    // );
    // return;
    if (this.PVALIDADET === 'S') {
      const V_EXIST = await this.getParamValConcept(this.conceptNumber.value);
      console.log(V_EXIST);
      if (V_EXIST) {
        // console.log(V_EXIST);
        let coordChatarra = await firstValueFrom(
          this.URCOORDREGCHATARRA_AUTOMATICO(3)
        );
        console.log(coordChatarra);
        this.CARGA_BIENES_LOTE_XDELRES(
          this.eventNumber.value,
          this.lotNumber.value,
          this.conceptNumber.value
        );
      } else {
        this.CARGA_BIENES_LOTE(this.eventNumber.value, this.lotNumber.value);
      }
      if (this.dataService.V_BIEN_REP_ROBO > 0) {
        this.dataService.PB_VEHICULO_REP_ROBO_DISPLAYED = true;
        this.dataService.PB_VEHICULO_REP_ROBO_ENABLED = true;
        this.dataService.SELECT_CAMBIA_CLASIF_ENABLED = true;
        this.dataService.SELECT_CAMBIA_CLASIF_UPDATE = true;
      }
    }
  }

  private async fillOthersParameters() {
    const filterParams = new FilterParams();
    filterParams.addFilter('parameter', 'CHCONIVA,IVA', SearchFilter.IN);
    return firstValueFrom(
      this.parameterModService.getAll(filterParams.getParams()).pipe(
        take(1),
        catchError(x => of({ data: [] as IParameterMod[], message: x })),
        map(response => {
          let data = response.data;
          let success;
          if (data.length > 0) {
            this.dataService.CHCONIVA = data[0].value;
            this.dataService.IVA = data[1].value ? +data[1].value / 100 : 0;
            success = true;
          } else {
            this.dataService.CHCONIVA = null;
            this.dataService.IVA = 0;
            success = false;
          }
          if (this.dataService.CHCONIVA === null)
            this.alert('warning', 'No tiene parámetro CHCONIVA', '');
          if (this.dataService.IVA === 0)
            this.alert('warning', 'No tiene parámetro IVA', '');
          return success;
        })
      )
    );
  }

  get numReceipts() {
    return this.form.get('numReceipts');
  }

  get attachedDocumentation() {
    return this.form.get('attachedDocumentation');
  }

  get capturedUser() {
    return this.form.get('capturedUser');
  }

  get authorizedUser() {
    return this.form.get('authorizedUser');
  }

  get requestedUser() {
    return this.form.get('requestedUser');
  }

  private validatePaymentCamps() {
    if (!this.clkpv.value) {
      this.alert('warning', 'Validación de pagos', 'Requiere proveedor');
      return false;
    }
    if (!this.comment.value) {
      this.alert('warning', 'Validación de pagos', 'Requiere servicio');
      return false;
    }
    // if (!this.conceptNumber.value) {
    //   this.alert(
    //     'warning',
    //     'Validación de pagos',
    //     'No cuenta con un concepto de pago'
    //   );
    //   return false;
    // }
    if (!this.numReceipts.value) {
      this.alert('warning', 'No cuenta con un número de comprobantes', '');
      return false;
    }
    if (!this.comproafmandsae.value) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere comprobantes a nombre'
      );
      return false;
    }
    if (!this.attachedDocumentation.value) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere documentación anexa'
      );
      return false;
    }
    if (!this.capturedUser) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere usuario de captura'
      );
      return false;
    }
    if (!this.authorizedUser.value) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere usuario que autoriza'
      );
      return false;
    }
    if (!this.requestedUser.value) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere usuario que solicita'
      );
      return false;
    }
    // if (!this.formPayment.value) {
    //   this.alert('warning', 'Validación de pagos', 'Requiere Forma de Pago');
    //   return false;
    // }
    // if (!this.eventNumber.value) {
    //   this.alert('warning', 'Validación de pagos', 'Requiere número de evento');
    //   return false;
    // }
    // if (!this.lotNumber.value) {
    //   this.alert('warning', 'Validación de pagos', 'Requiere número de lote');
    //   return false;
    // }
    return true;
  }

  private validPayments() {
    return firstValueFrom(
      this.sirsaeService
        .validPayments({
          pClkpv: this.clkpv.value,
          pComment: this.comment.value,
          pPayAfmandSae: this.comproafmandsae.value,
          pNumberVoucher: this.form.get('numReceipts').value,
          pDocumentationAnexa: this.form.get('attachedDocumentation').value,
          pUserCapture: this.form.get('capturedUser').value,
          pUserAuthorize: this.form.get('authorizedUser').value,
          pUserRequest: this.form.get('requestedUser').value,
          pFormPay: this.form.get('formPayment').value,
          pEventId: +this.eventNumber,
          pLotePub: this.lotNumber.value,
        })
        .pipe(catchError(x => of({ data: false, message: x })))
    );
  }

  private fillFormSecond(event: any) {
    if (this.address !== 'M') {
      this.dataService.address = 'I';
    }
    this.dataService.validPayment = false;
    this.expenseNumber.setValue(event.expenseNumber);
    this.data = event;
    this.provider = event.providerName;
    this.paymentRequestNumber.setValue(event.paymentRequestNumber);
    this.idOrdinginter.setValue(event.idOrdinginter);
    this.folioAtnCustomer.setValue(event.folioAtnCustomer);
    this.dateOfResolution.setValue(
      secondFormatDateToDateAny(event.dateOfResolution)
    );
    this.comment.setValue(event.comment);
    this.conceptNumber.setValue(event.conceptNumber);
    this.eventNumber.setValue(event.eventNumber);
    this.lotNumber.setValue(event.lotNumber);
    this.publicLot.setValue(
      event.publicLot
        ? event.publicLot
        : event.comerLot
        ? event.comerLot.publicLot
        : null
    );
    this.clkpv.setValue(event.clkpv);

    setTimeout(async () => {
      // if (!event.descurcoord) {
      //   this.alert('warning', 'No se cuenta con coordinación regional', '');
      // }
      this.descurcoord.setValue(event.descurcoord);
      this.dataService.updateOI.next(true);
      this.dataService.updateExpenseComposition.next(true);
      if (this.address === 'M') {
        this.dataService.updateFolio.next(true);
      }
      this.dataService.V_VALCON_ROBO = await firstValueFrom(
        this.screenService.PUF_VAL_CONCEP_ROBO(event.conceptNumber)
      );
      this.controlsInDet();
      const responseParams = await this.readParams(event.conceptNumber);
      if (!responseParams) {
        return;
      }
      const otherParams = await this.fillOthersParameters();
    }, 500);
  }

  private controlsInDet() {
    if (this.dataService.V_VALCON_ROBO > 0) {
      if (!this.paymentRequestNumber.value) {
        this.dataService.PB_VEHICULO_REP_ROBO_DISPLAYED = true;
        this.dataService.PB_VEHICULO_REP_ROBO_ENABLED = false;
        this.dataService.SELECT_CAMBIA_CLASIF_ENABLED = true;
        this.dataService.SELECT_CAMBIA_CLASIF_UPDATE = true;
      } else {
        this.dataService.PB_VEHICULO_REP_ROBO_DISPLAYED = true;
        this.dataService.PB_VEHICULO_REP_ROBO_ENABLED = false;
        this.dataService.SELECT_CAMBIA_CLASIF_ENABLED = false;
        this.dataService.SELECT_CAMBIA_CLASIF_UPDATE = false;
      }
    } else {
      this.dataService.PB_VEHICULO_REP_ROBO_DISPLAYED = true;
      this.dataService.PB_VEHICULO_REP_ROBO_ENABLED = false;
      this.dataService.SELECT_CAMBIA_CLASIF_ENABLED = false;
      this.dataService.SELECT_CAMBIA_CLASIF_UPDATE = false;
    }
  }

  async fillForm(expense: IComerExpense) {
    console.log(event);
    this.clean(false);
    this.fillFormSecond(expense);
  }

  private prepareForm() {
    this.dataService.prepareForm();
    console.log(this.form.getRawValue());
  }

  get pathComerExpenses() {
    return (
      'spent/api/v1/comer-expenses' +
      (this.address ? '?filter.address=$in:' + this.address : '')
    );
  }

  get pathConcept() {
    return (
      'comerconcepts/api/v1/application/query-eat-concepts' +
      (this.address
        ? '?filter.address=$in:' +
          this.address +
          (this.address === 'M'
            ? ',C'
            : this.PDIRECCION_A
            ? ',' + this.PDIRECCION_A
            : '')
        : '')
    );
  }

  get pathEvent() {
    // return 'prepareevent/api/v1/comer-event/getProcess';
    return (
      'event/api/v1/comer-event?filter.eventTpId:$in:1,2,3,4,5' +
      (this.address
        ? (this.address === 'M' ? ',10' : '') +
          '&filter.address=$eq:' +
          this.address
        : '' + (this.address === 'M' ? ',10' : ''))
    );
  }

  get pathPolicy() {
    return 'policy/api/v1/policies';
  }

  get idEventFilterPath() {
    return this.eventNumber && this.eventNumber.value
      ? '?filter.idEvent=' + this.eventNumber.value
      : '';
  }

  get idLotFilterPath() {
    return this.lotNumber && this.lotNumber.value
      ? (this.idEventFilterPath.length > 0 ? '&' : '?') +
          'filter.idLot=' +
          this.lotNumber.value
      : '';
  }

  get pathLote() {
    return (
      'lot/api/v1/eat-lots' + this.idEventFilterPath + this.idLotFilterPath
    );
  }

  get pathProvider() {
    return (
      'interfaceesirsae/api/v1/supplier' +
      (this.clkpv && this.clkpv.value
        ? '?filter.clkPv=$eq:' + this.clkpv.value + '&sortBy=clkPv:ASC'
        : '?sortBy=clkPv:ASC')
    );
  }

  get dataCompositionExpenses() {
    return this.dataService.dataCompositionExpenses;
  }

  get dataCompositionExpensesStatusChange() {
    return this.dataCompositionExpenses
      ? this.dataCompositionExpenses.filter(
          row => row.changeStatus && row.changeStatus === true
        )
      : [];
  }

  get conceptNumberValue() {
    return this.conceptNumber ? this.conceptNumber.value : null;
  }

  async sendToSIRSAE() {
    let result = await this.alertQuestion(
      'question',
      '¿Desea enviar solicitud de pago a sirsae?',
      ''
    );
    if (result.isConfirmed) {
      if (this.address === 'M') {
        this.dataService.actionButton = 'SIRSAE';
        await this.dataService.updateByGoods(true);
      } else {
        this.dataService.ENVIA_MOTIVOS();
      }
    }
  }

  get validImprimeAny() {
    return this.form
      ? (this.paymentRequestNumber && this.paymentRequestNumber.value) ||
          (this.expenseNumber && this.expenseNumber.value)
      : false;
  }

  get validImprimeRev() {
    return this.form
      ? this.paymentRequestNumber
        ? this.paymentRequestNumber.value
          ? this.paymentRequestNumber.value != ''
          : false
        : false
      : false;
  }

  async imprimeAny() {
    let result = await this.alertQuestion('question', '¿Desea imprimir?', '');
    if (result.isConfirmed) {
      this.loader.load = true;
      if (this.paymentRequestNumber.value) {
        this.sirsaeService
          .imprimeAny(this.paymentRequestNumber.value, this.expenseNumber.value)
          .pipe(take(1))
          .subscribe({
            next: response => {
              this.PUP_LANZA_REPORTE(1, 1);
            },
            error: err => {
              this.loader.load = false;
              this.alert('error', 'No se encontraron datos para imprimir', '');
            },
          });
      } else if (this.expenseNumber.value) {
        this.sirsaeService
          .viewPreview(this.expenseNumber.value)
          .pipe(take(1))
          .subscribe({
            next: response => {
              this.PUP_LANZA_REPORTE(1, 2);
            },
            error: err => {
              this.loader.load = false;
              this.alert('error', 'No se encontraron datos para imprimir', '');
            },
          });
      } else {
        this.loader.load = false;
        this.alert('warning', 'No existe un gasto a visualizar', '');
      }
    }
  }

  showRetentions() {
    let config: ModalOptions = {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RetentionsModalComponent, config);
  }

  async imprimeRev() {
    let result = await this.alertQuestion('question', '¿Desea imprimir?', '');
    if (result.isConfirmed) {
      if (this.paymentRequestNumber.value) {
        this.loader.load = true;
        this.sirsaeService
          .insertModuleCont(this.paymentRequestNumber.value)
          .pipe(take(1))
          .subscribe({
            next: response => {
              this.PUP_LANZA_REPORTE(2);
            },
            error: err => {
              this.loader.load = false;
              this.alert('error', 'No se encontraron datos para imprimir', '');
            },
          });
      } else {
        this.alert('warning', 'Requiere una solicitud de pago', '');
      }
    }
  }

  validImprimeDetalle() {
    let mandates = this.dataCompositionExpenses.filter(x => x.mandato);
    return this.expenseNumberValue && mandates.length > 0;
  }

  async imprimeDetalle() {
    let result = await this.alertQuestion(
      'question',
      '¿Desea imprimir detalle?',
      ''
    );
    if (result.isConfirmed) {
      if (this.validImprimeDetalle()) {
        // this.alertQuestion('question','Desea imprimir ')
        this.loader.load = true;
        this.PUP_LANZA_REPORTE(3);
      } else {
        this.alert('warning', 'No se encontro datos a imprimir', '');
      }
    }
  }

  PUP_LANZA_REPORTE(opcion: number, opcionDelete: number = 0) {
    let params: any;
    let obs: Observable<any>;
    if (opcion === 1) {
      params = {
        PSOLICITUDPAGO: this.paymentRequestNumber.value,
        PARAMFORM: 'NO',
        PIDGASTO: this.expenseNumber.value,
      };
      obs = this.siabService.fetchReport('RPTSOLSER', params).pipe(take(1));
    } else if (opcion === 2) {
      params = {
        PSOLICITUDPAGO: this.paymentRequestNumber.value,
        PARAMFORM: 'NO',
      };
      obs = this.siabService.fetchReport('RPTSOLREV', params).pipe(take(1));
    } else if (opcion === 3) {
      params = {
        PIDGASTO: this.expenseNumber.value,
        PARAMFORM: 'NO',
      };
      obs = this.siabService.fetchReport('RPTSOLDET', params).pipe(take(1));
    }
    if (obs) {
      obs.subscribe({
        next: response => {
          console.log(response);
          this.loader.load = false;
          if (response) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
            if (opcionDelete === 1) {
              this.sirsaeService
                .deleteSol(this.paymentRequestNumber.value)
                .pipe(take(1))
                .subscribe();
            } else if (opcionDelete === 2) {
              this.sirsaeService
                .deleteSolServceGast(this.expenseNumber.value)
                .pipe(take(1))
                .subscribe();
            } else if (opcionDelete === 3) {
              this.sirsaeService
                .deleteModuleCont(this.expenseNumber.value)
                .pipe(take(1))
                .subscribe();
            }
          } else {
            this.alert('error', 'El reporte no se encuentra disponible', '');
          }
        },
        error: err => {
          this.loader.load = false;
          this.alert('error', 'El reporte no se encuentra disponible', '');
        },
      });
    } else {
      this.loader.load = false;
      this.alert('error', 'El reporte no se encuentra disponible', '');
    }
  }
}
