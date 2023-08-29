import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ListComponent } from './list/list.component';
import { SURVEILLANCE_SERVICE_COLUMNS } from './surveillance-service-columns';
@Component({
  selector: 'app-surveillance-service',
  templateUrl: './surveillance-service.component.html',
  styles: [
    `
      .hr {
        border: none;
        border-right: 1px solid hsl(200deg 20.1% 80.92%);
        height: 90%;
        width: 51%;
      }

      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class SurveillanceServiceComponent extends BasePage implements OnInit {
  form: FormGroup;
  formRegistro: FormGroup;
  goods: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  users: LocalDataSource = new LocalDataSource();
  filters = new FilterParams();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());

  delegations = new DefaultSelect();
  delegationDefault: any = null;
  delegationMae: any = null;
  periods = new DefaultSelect();
  disabledPeriod: boolean = false;
  disabledProcess: boolean = false;
  @ViewChild('file') fileInput: ElementRef;
  jsonToCsv: any[] = [];
  loadingBtn: boolean = false;
  loadingBtn1: boolean = false;
  loadingBtn2: boolean = false;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private survillanceService: SurvillanceService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private token: AuthService,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {
    super();
    this.settings.columns = SURVEILLANCE_SERVICE_COLUMNS;
    this.settings.actions = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.prepareForm();

    this.goods
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              randomId: () => (searchFilter = SearchFilter.EQ),
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              address: () => (searchFilter = SearchFilter.ILIKE),
              transferee: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              console.log('filter.search', filter.search);
              if (filter.search == 'motionDate') {
              }
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;

              console.log(
                'this.columnFilters[field]',
                this.columnFilters[field]
              );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getVigSupervisionDet_();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getVigSupervisionDet_();
    });

    this.getDelegation(new ListParams());
  }

  async prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      process: [null, Validators.required],
      period: [null, Validators.required],
      from: [null],
      to: [null],
      total: [null],
    });

    this.formRegistro = this.fb.group({
      processTwo: [null, Validators.required],
      fromTwo: [null, Validators.required],
      toTwo: [null, Validators.required],
    });
  }

  // DELEGACIONES //
  async getDelegation(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('description', lparams.text, SearchFilter.ILIKE);

    return new Promise((resolve, reject) => {
      this.survillanceService
        .getViewVigDelegations(params.getParams())
        .subscribe({
          next: async (response: any) => {
            console.log('resss', response);
            let result = response.data.map(async (item: any) => {
              item['numberAndDescrip'] =
                item.delegationNumber + ' - ' + item.description;
            });

            Promise.all(result).then(async (resp: any) => {
              this.delegations = new DefaultSelect(
                response.data,
                response.count
              );
              this.loading = false;
            });
          },
          error: error => {
            this.delegations = new DefaultSelect();
            this.loading = false;
            resolve(null);
          },
        });
    });
  }

  // SUPERVISION_MAE //
  async changeDelegations(event: any) {
    console.log('event', event);
    // LIMPIAMOS CAMPOS PARA REALIZAR NUEVAMENTE LA BÚSQUEDA //
    const params = new FilterParams();
    if (event) {
      this.disabledProcess = true;
      this.disabledPeriod = false;
      this.form.get('process').setValue(null);
      this.form.get('period').setValue(null);
      this.form.get('from').setValue(null);
      this.form.get('to').setValue(null);
      this.form.get('total').setValue(null);
      this.delegationDefault = event;
      params.addFilter(
        'delegationNumber',
        event.delegationNumber,
        SearchFilter.EQ
      );
      // this.form.get('delegation').setValue(event.numberAndDescrip);
    } else {
      this.disabledProcess = false;
      this.disabledPeriod = false;
      this.form.get('process').setValue(null);
      this.form.get('period').setValue(null);
      this.form.get('from').setValue(null);
      this.form.get('to').setValue(null);
      this.form.get('total').setValue(null);
      // this.form.get('delegation').setValue(null);
    }
    //=======================================================//
    return new Promise((resolve, reject) => {
      this.survillanceService
        .getVigSupervisionMae(params.getParams())
        .subscribe({
          next: async (response: any) => {
            console.log('EDED', response);
            this.delegationMae = response.data[0];
            resolve(response.data[0]);
          },
          error: error => {
            this.loading = false;
            resolve(null);
          },
        });
    });
  }

  // CHANGE SELECT PROCESS //
  async cleanPeriod(event: any) {
    console.log('event', event);

    if (event != 1 && event != 2) {
      this.disabledPeriod = false;
      this.form.get('period').setValue(null);
      this.form.get('from').setValue(null);
      this.form.get('to').setValue(null);
      this.form.get('total').setValue(null);
    } else {
      this.disabledPeriod = true;
      this.form.get('period').setValue(null);
      this.form.get('from').setValue(null);
      this.form.get('to').setValue(null);
      this.form.get('total').setValue(null);
      this.getPeriods(new ListParams());
    }
  }

  // PREPARATION OBJECT SEARCH SUPERVISIONDET //
  objGetSupervionDet: any = null;
  async searchSupervisionDet() {
    console.log(this.form);

    if (!this.delegationDefault) {
      this.form.get('delegation').markAsTouched();
      this.alert('warning', 'Debe Seleccionar una Delegación', '');
      return;
    }

    const cveProcess = this.form.get('process').value;
    if (cveProcess == null) {
      this.form.get('process').markAsTouched();
      this.alert('warning', 'El Tipo de Proceso es un Valor Requerido', '');
      return;
    }

    const period = this.form.get('period').value;
    if (period == null) {
      this.form.get('period').markAsTouched();
      this.alert('warning', 'El Período es un Valor Requerido', '');
      return;
    }

    let obj = {
      delegationNumber: this.delegationMae.delegationNumber,
      cveProcess: this.form.value.process,
      cvePeriod: this.form.value.period,
      delegationType: this.delegationMae.delegationType,
    };
    this.objGetSupervionDet = obj;
    this.paramsList.getValue().page = 1;
    this.paramsList.getValue().limit = 10;
    this.getVigSupervisionDet_();
  }

  // SUPERVISION_DET
  async getVigSupervisionDet_() {
    console.log('AQUI', this.objGetSupervionDet);
    if (this.objGetSupervionDet == null) {
      return;
    }
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    // const params = new FilterParams();
    params[
      'filter.delegationNumber'
    ] = `$eq:${this.objGetSupervionDet.delegationNumber}`;
    params['filter.cveProcess'] = `$eq:${this.objGetSupervionDet.cveProcess}`;
    params['filter.cvePeriod'] = `$eq:${this.objGetSupervionDet.cvePeriod}`;
    params[
      'filter.delegationType'
    ] = `$eq:${this.objGetSupervionDet.delegationType}`;
    // params.addFilter(
    //   'delegationNumber',
    //   event.delegationNumber,
    //   SearchFilter.EQ
    // );
    // params.addFilter('cveProcess', event.cveProcess, SearchFilter.EQ);
    // params.addFilter('cvePeriod', event.cvePeriod, SearchFilter.EQ);
    // params.addFilter('delegationType', event.delegationType, SearchFilter.EQ);

    // return new Promise((resolve, reject) => {
    params['sortBy'] = 'randomId:ASC';
    this.survillanceService.getVigSupervisionDet(params).subscribe({
      next: async (response: any) => {
        console.log('EDED2', response);
        this.goods.load(response.data);
        this.goods.refresh();
        this.totalItems = response.count;

        this.form.get('total').setValue(response.count);
        this.loading = false;
        setTimeout(() => {
          this.performScroll();
        }, 100);
        // resolve(response.data);
      },
      error: error => {
        this.goods.load([]);
        this.goods.refresh();
        this.totalItems = 0;
        this.form.get('total').setValue('0');
        this.loading = false;
        setTimeout(() => {
          this.performScroll();
        }, 100);
        // resolve(null);
      },
    });
    // });
  }

  // OBTENER PERIODOS //
  async getPeriods(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (this.delegationDefault != null) {
      params.addFilter(
        'delegationNumber',
        this.delegationDefault.delegationNumber,
        SearchFilter.EQ
      );
      params.addFilter(
        'delegationType',
        this.delegationDefault.typeDelegation,
        SearchFilter.EQ
      );

      if (this.form.value.process != null) {
        params.addFilter(
          'cveProcess',
          this.form.value.process,
          SearchFilter.EQ
        );
      }
    }

    if (lparams.text != '') {
      params.addFilter('cvePeriod', lparams.text, SearchFilter.EQ);
    }
    params.sortBy = 'cvePeriod:ASC';
    return new Promise((resolve, reject) => {
      this.survillanceService
        .getVigSupervisionMae(params.getParams())
        .subscribe({
          next: async (response: any) => {
            console.log('EDED2', response);

            this.periods = new DefaultSelect(response.data, response.count);
            resolve(response.data);
          },
          error: error => {
            this.periods = new DefaultSelect();
            this.loading = false;
            resolve(null);
          },
        });
    });
  }

  // AGREGAR FECHAS //
  addDate(event: any) {
    console.log('event', event);
    if (event != null) {
      const from = this.datePipe.transform(event.initialDate, 'dd/MM/yyyy');
      const to = this.datePipe.transform(event.finalDate, 'dd/MM/yyyy');
      this.form.get('from').setValue(from);
      this.form.get('to').setValue(to);
    } else {
      this.form.get('from').setValue(null);
      this.form.get('to').setValue(null);
    }
  }

  save() {
    console.log(this.form.value);
  }

  cleanForm() {
    this.disabledProcess = false;
    this.disabledPeriod = false;
    this.objGetSupervionDet = null;
    this.delegationDefault = null;
    this.delegationMae = null;
    this.objectDelete = null;
    this.totalItems = 0;
    this.goods.load([]);
    this.goods.refresh();
    this.form.reset();
    this.formRegistro.reset();
  }

  generarReport() {
    let LV_DELEGACION: any,
      LV_TIPO_DELEGA: any = null;
    let LV_PROCESO: any = null;
    let LV_CVE_PERIODO: any = null;
    let LV_VALIDAREP: number = 1;

    if (
      this.delegationDefault == null ||
      this.delegationMae.delegationNumber == null
    ) {
      LV_VALIDAREP = 0;
      this.form.get('delegation').markAsTouched();
      this.alert(
        'warning',
        'Debe seleccionar una Delegación',
        'Es un valor requerido para generar el reporte'
      );
      return;
    } else {
      LV_DELEGACION = this.delegationMae.delegationNumber;
      LV_TIPO_DELEGA = this.delegationDefault.typeDelegation;
    }
    const cveProcess = this.form.get('process').value;

    if (cveProcess == null) {
      LV_VALIDAREP = 0;
      this.form.get('process').markAsTouched();
      this.alert(
        'warning',
        'El Tipo de Proceso es un Valor Requerido para Generar el Reporte',
        ''
      );
      return;
    } else {
      LV_PROCESO = cveProcess;
    }

    const period = this.form.get('period').value;

    if (period == null) {
      LV_VALIDAREP = 0;
      this.form.get('period').markAsTouched();
      this.alert(
        'warning',
        'El Período es un Valor Requerido para Generar el Reporte',
        ''
      );
      return;
    } else {
      LV_CVE_PERIODO = period;
    }

    if (LV_VALIDAREP == 1) {
      let params = {
        DESTYPE: 'SCREEN',
        PARAMFORM: 'NO',
        P_DELEGACION: LV_DELEGACION,
        P_PERIODO: LV_CVE_PERIODO,
        P_PROCESO: LV_PROCESO,
        P_TIPODEL: LV_TIPO_DELEGA,
      };

      this.siabService
        // .fetchReport('REP_SERVICIO_VIGILANCIA', params)
        .fetchReportBlank('blank')
        .subscribe(response => {
          if (response !== null) {
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
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
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
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        });
    }
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(files[0]);
  }

  async readExcel(binaryExcel: string | ArrayBuffer | any) {
    try {
      // const excelImport = this.excelService.getData<any>(binaryExcel);
      // console.log('excelImport', excelImport);
      this.loadingBtn = true;
      const deleteVIG_SUPERVISION_TMP_ = await this.deleteVIG_SUPERVISION_TMP(
        this.objectDelete
      );

      let objCreate = {
        user: this.token.decodeToken().preferred_username,
        Delegation: this.delegationDefault.delegationNumber,
        NumPeriod: this.objectDelete.lvCvePeriod,
        delegationType: this.delegationDefault.typeDelegation,
      };

      const formData = new FormData();
      formData.append('file', binaryExcel);
      formData.append('user', objCreate.user);
      formData.append('Delegation', objCreate.Delegation);
      formData.append('NumPeriod', objCreate.NumPeriod);
      formData.append('delegationType', objCreate.delegationType);

      const createVIG_SUPERVISION_TMP_: any =
        await this.createVIG_SUPERVISION_TMP(formData);

      if (createVIG_SUPERVISION_TMP_) {
        this.loadingBtn = false;
        this.alert('success', 'Archivo Cargado Correctamente', '');
        this.clearInput();
      } else {
        this.loadingBtn = false;
        this.alert(
          'error',
          'Ha Ocurrido un Error al Intentar Crear los Registros',
          ''
        );
        this.clearInput();
      }
    } catch (error) {
      this.loadingBtn = false;
      this.alert('error', 'Ocurrió un Error al Leer el Archivo', 'Error');
    }
  }

  async onButtonClick() {
    this.fileInput.nativeElement.click();
  }

  async cargarArchivo() {
    let LV_DELEGACION: any,
      LV_TIPO_DELEGA: any = null;
    let LV_PROCESO: any = null;
    let LV_VALPROCESO: number = 1;
    let LV_EST_PROCESO: number = null;
    let LV_ANIO_PROCESO: number = null;
    let LV_MES_PROCESO: number = null;
    let LV_CVE_PERIODO: any = null;
    let LV_MENSAJE: any = null;

    const delegation = this.form.get('delegation').value;
    if (delegation == null) {
      this.form.get('delegation').markAsTouched();
      this.alert('warning', 'Debe Seleccionar una Delegación', '');
      return;
    }

    const cveProcessTwo = this.formRegistro.get('processTwo').value;
    if (cveProcessTwo != 1 && cveProcessTwo != 2) {
      LV_VALPROCESO = 0;
      this.formRegistro.get('processTwo').markAsTouched();
      this.alert('warning', 'El Proceso es Información Requerida', '');
      return;
    }

    const fromTwo = this.formRegistro.get('fromTwo').value;

    if (fromTwo == null || fromTwo == '') {
      LV_VALPROCESO = 0;
      this.formRegistro.get('fromTwo').markAsTouched();
      this.alert(
        'warning',
        'La Fecha Inicial del Período es Información Requerida',
        ''
      );
      return;
    }

    const toTwo = this.formRegistro.get('toTwo').value;

    if (toTwo == null || toTwo == '') {
      LV_VALPROCESO = 0;
      this.formRegistro.get('toTwo').markAsTouched();
      this.alert(
        'warning',
        'La Fecha Final del Período es Información Requerida',
        ''
      );
      return;
    }

    if (LV_VALPROCESO == 1) {
      const period = this.form.get('period').value;

      let obj = {
        pDelegation: this.delegationDefault.delegationNumber,
        pProcess: cveProcessTwo,
        pPeriodKey: period,
        pTypeDelaga: this.delegationDefault.typeDelegation,
        pInitialDate: this.returnParseDate_(fromTwo),
        pEndDate: this.returnParseDate_(toTwo),
      };

      console.log('objjj', obj);

      const getPaValidPeriod_: any = await this.getPaValidaPeriodo(obj);

      if (getPaValidPeriod_ === 'error mes') {
        this.alert('warning', 'Ya Existe Relación con este Período', '');
        return;
      }

      if (getPaValidPeriod_ != null) {
        LV_ANIO_PROCESO = getPaValidPeriod_.P_ANIO_PROCESO;
        LV_MES_PROCESO = getPaValidPeriod_.P_MES_PROCESO;
        LV_CVE_PERIODO = getPaValidPeriod_.pPeriodKey;
        LV_EST_PROCESO = getPaValidPeriod_.P_EST_PROCESO;
        LV_MENSAJE = getPaValidPeriod_.P_MSG_PROCESO;
      }
      // PK_VIGILANCIA_SUPERVISION.PA_VALIDA_PERIODO(

      if (LV_EST_PROCESO == 1) {
        this.alertQuestion(
          'question',
          '¿Está Seguro de Hacer la Carga del Archivo ?',
          ''
        ).then(async (question: any) => {
          if (question.isConfirmed) {
            let objDelete = {
              delegationNo: this.delegationDefault.delegationNumber,
              lvCvePeriod: LV_CVE_PERIODO,
            };

            this.objectDelete = objDelete;

            await this.onButtonClick();
          }
        });
      } else {
        this.alert('warning', LV_MENSAJE, '');
      }
    }
  }

  objectDelete: any = null;
  async createDataVigilanceMtp(excelImport: any) {
    let LV_REGVALIDO: number = null;
    let LV_VALCONSE: number = null;
    let arr: any = [];
    let getDatCreada = this.objectDelete;
    // ELIMINAMOS REGISTROS //
    const deleteVIG_SUPERVISION_TMP_ = await this.deleteVIG_SUPERVISION_TMP(
      this.objectDelete
    );

    // VALIDAMOS ANTES DE REALIZAR NUEVOS REGISTROS //
    if (excelImport.length > 0) {
      let objCreate = {
        user: this.token.decodeToken().preferred_username,
        Delegation: this.delegationDefault.delegationNumber,
        NumPeriod: this.objectDelete.lvCvePeriod,
        delegationType: this.delegationDefault.typeDelegation,
      };
      const createVIG_SUPERVISION_TMP_: any =
        await this.createVIG_SUPERVISION_TMP(excelImport);

      if (createVIG_SUPERVISION_TMP_) {
        this.alert('warning', 'El Archivo no Contenía Registros', '');
      } else {
        this.alert(
          'error',
          'Ha Ocurrido un Error al Intentar Crear los Registros',
          ''
        );
      }
      this.objectDelete = null; // LIMPIAMOS OBJECTDELETE //
      this.clearInput();
    } else {
      this.objectDelete = null; // LIMPIAMOS OBJECTDELETE //
      this.alert('warning', 'El Archivo no Contenía Registros', '');
      this.clearInput();
    }
  }

  // GET - PA_VALIDA_PERIODO //
  async getPaValidaPeriodo(params: any) {
    return new Promise((resolve, reject) => {
      this.survillanceService.postValidPeriod(params).subscribe({
        next: async (response: any) => {
          console.log('EDED2', response);
          resolve(response);
        },
        error: error => {
          console.log('err', error);
          if (error.error.message == 'relation "lv_mes" already exists') {
            console.log('SI');
            resolve('error mes');
          } else {
            resolve(null);
          }
        },
      });
    });
  }

  // DELETE - VIG_SUPERVISION_TMP //
  async deleteVIG_SUPERVISION_TMP(params: any) {
    return new Promise((resolve, reject) => {
      this.survillanceService.deleteVigSupervisionTmp(params).subscribe({
        next: async (response: any) => {
          console.log('ELIMINADO', response);
          resolve(response);
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // CREAMOS REGISTROS EN LA TABLA VIG_SUPERVISION_TMP //
  async createVIG_SUPERVISION_TMP(excelImport: any) {
    return new Promise((resolve, reject) => {
      this.survillanceService.PostInsertSupervisionTmp(excelImport).subscribe({
        next: async (response: any) => {
          resolve(response);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  clearInput() {
    this.fileInput.nativeElement.value = '';
  }

  // LISTA DE REGISTROS CREADOS EN LA TABLA VIG_SUPERVISION_TMP //
  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;

    modalConfig.initialState = {
      data,
      callback: (next: boolean) => {
        if (next) {
        }
      },
    };
    this.modalService.show(ListComponent, modalConfig);
  }

  async generaAleatorios() {
    let LV_DELEGACION: any,
      LV_TIPO_DELEGA: any = null;
    let LV_PROCESO: any = null;
    let LV_VALPROCESO: number = 1;
    let LV_EST_PROCESO: number = null;
    let LV_ANIO_PROCESO: number = null;
    let LV_MES_PROCESO: number = null;
    let LV_CVE_PERIODO: any = null;
    let LV_MENSAJE: any = null;
    let LV_TOTREGISTRO: any = null;

    const delegation = this.form.get('delegation').value;
    if (delegation == null) {
      this.form.get('delegation').markAsTouched();
      this.alert('warning', 'Debe Seleccionar una Delegación', '');
      return;
    }
    const cveProcessTwo = this.formRegistro.get('processTwo').value;
    if (cveProcessTwo != 1 && cveProcessTwo != 2) {
      LV_VALPROCESO = 0;
      this.formRegistro.get('processTwo').markAsTouched();
      this.alert('warning', 'El Proceso es Información Requerida', '');
      return;
    }

    const fromTwo = this.formRegistro.get('fromTwo').value;
    if (fromTwo == null || fromTwo == '') {
      LV_VALPROCESO = 0;
      this.formRegistro.get('fromTwo').markAsTouched();
      this.alert(
        'warning',
        'La Fecha Inicial del Período es Información Requerida',
        ''
      );
      return;
    }

    const toTwo = this.formRegistro.get('toTwo').value;
    if (toTwo == null || toTwo == '') {
      LV_VALPROCESO = 0;
      this.formRegistro.get('toTwo').markAsTouched();
      this.alert(
        'warning',
        'La Fecha Final del Período es Información Requerida',
        ''
      );
      return;
    }

    if (LV_VALPROCESO == 1) {
      const period = this.form.get('period').value;
      let obj = {
        pDelegation: this.delegationDefault.delegationNumber,
        pProcess: cveProcessTwo,
        pPeriodKey: period,
        pTypeDelaga: this.delegationDefault.typeDelegation,
        pInitialDate: this.returnParseDate_(fromTwo),
        pEndDate: this.returnParseDate_(toTwo),
      };
      console.log('objjj', obj);
      const getPaValidPeriod_: any = await this.getPaValidaPeriodo(obj);

      if (getPaValidPeriod_ === 'error mes') {
        this.alert('warning', 'Ya Existe Relación con Este Período', '');
        return;
      }

      if (getPaValidPeriod_ != null) {
        LV_ANIO_PROCESO = getPaValidPeriod_.P_ANIO_PROCESO;
        LV_MES_PROCESO = getPaValidPeriod_.P_MES_PROCESO;
        LV_CVE_PERIODO = getPaValidPeriod_.pPeriodKey;
        LV_EST_PROCESO = getPaValidPeriod_.P_EST_PROCESO;
        LV_MENSAJE = getPaValidPeriod_.P_MSG_PROCESO;
      }
      // PK_VIGILANCIA_SUPERVISION.PA_VALIDA_PERIODO(

      if (LV_EST_PROCESO == 1) {
        this.alertQuestion(
          'question',
          '¿Está Seguro de Generar los Números Aleatorios?',
          ''
        ).then(async question => {
          if (question.isConfirmed) {
            console.log('SI');

            let obj = {
              delegationNo: this.delegationDefault.delegationNumber,
              lvCvePeriod: LV_CVE_PERIODO,
            };
            this.loadingBtn1 = true;
            const getDataVIG_SUPERVISION_TMP_: any =
              await this.getDataVIG_SUPERVISION_TMP(obj);
            LV_TOTREGISTRO = getDataVIG_SUPERVISION_TMP_;
            console.log(
              'getDataVIG_SUPERVISION_TMP_',
              getDataVIG_SUPERVISION_TMP_
            );
            if (LV_TOTREGISTRO > 0) {
              let obj = {
                pDelegationKey: this.delegationDefault.delegationNumber,
                pProcess: cveProcessTwo,
                pPeriodKey: LV_CVE_PERIODO,
                pTypeDelaga: this.delegationDefault.typeDelegation,
                pInitialDate: this.returnParseDate_(fromTwo),
                pEndDate: this.returnParseDate_(toTwo),
                user: this.token.decodeToken().preferred_username,
              };

              const createRegisterRandom: any = await this.createRegisterRandom(
                obj
              );

              if (createRegisterRandom != null) {
                if (createRegisterRandom.P_EST_PROCESO == 1) {
                  let objWhere = {
                    delegationNumber: this.delegationDefault.delegationNumber,
                    cveProcess: cveProcessTwo,
                    cvePeriod: LV_CVE_PERIODO,
                  };
                  await this.LV_WHERE(objWhere);
                } else {
                  this.loadingBtn1 = false;
                  this.alert(
                    'warning',
                    'No Existen Carga de Bienes en este Período para Generar Aleatorios',
                    ''
                  );
                  return;
                }
              } else {
                this.loadingBtn1 = false;
                this.alert(
                  'error',
                  'Ha Ocurrido un Error al Intentar Generar Aleatorios',
                  'Verifique que no exista el Periodo que Intentó Ingresar'
                );
              }
            } else {
              this.loadingBtn1 = false;
              this.alert('warning', 'No Hay Bienes Cargados', '');
            }
          }
        });
      } else {
        this.alert('warning', LV_MENSAJE, '');
      }
    }
  }

  async getDataVIG_SUPERVISION_TMP(data: any) {
    const params = new ListParams();
    params['filter.delegationNumber'] = `$eq:${data.delegationNo}`;
    params['filter.cvePeriod'] = `$eq:${data.lvCvePeriod}`;
    return new Promise((resolve, reject) => {
      this.survillanceService.getVigSupervisionTmp(params).subscribe({
        next: async (response: any) => {
          console.log('!!!!', response);
          resolve(response.count);
        },
        error: error => {
          resolve(0);
        },
      });
    });
  }

  async createRegisterRandom(params: any) {
    return new Promise((resolve, reject) => {
      this.survillanceService.postRecordRandom(params).subscribe({
        next: async (response: any) => {
          resolve(response);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  // SUPERVISION_MAE //
  async LV_WHERE(event: any) {
    console.log('event', event);
    // LIMPIAMOS CAMPOS PARA REALIZAR NUEVAMENTE LA BÚSQUEDA //
    const params = new FilterParams();
    params.addFilter(
      'delegationNumber',
      event.delegationNumber,
      SearchFilter.EQ
    );
    params.addFilter('cveProcess', event.cveProcess, SearchFilter.EQ);
    params.addFilter('cvePeriod', event.cvePeriod, SearchFilter.EQ);
    //=======================================================//
    // return new Promise((resolve, reject) => {
    this.survillanceService.getVigSupervisionMae(params.getParams()).subscribe({
      next: async (response: any) => {
        this.delegationMae = response.data[0];
        // this.form.controls['cveProcess'].reset();

        // this.form.controls['process'].setValue(response.data[0].cveProcess);

        this.form.patchValue({
          process: response.data[0].cveProcess,
        });

        // this.form.get('process').setValue('Proceso ' + response.data[0].cveProcess);
        this.form.get('period').setValue(response.data[0].cvePeriod);
        const from = this.datePipe.transform(
          response.data[0].initialDate,
          'dd/MM/yyyy'
        );
        const to = this.datePipe.transform(
          response.data[0].finalDate,
          'dd/MM/yyyy'
        );
        this.form.get('from').setValue(from);
        this.form.get('to').setValue(to);
        this.form.get('total').setValue(null);

        let obj = {
          delegationNumber: this.delegationMae.delegationNumber,
          cveProcess: this.form.value.process,
          cvePeriod: this.form.value.period,
          delegationType: this.delegationMae.delegationType,
        };
        this.objGetSupervionDet = obj;
        this.paramsList.getValue().page = 1;
        this.paramsList.getValue().limit = 10;
        this.disabledPeriod = true;
        this.getVigSupervisionDet_();

        console.log('RESPUESTA', response);
        this.loadingBtn1 = false;
        this.alert('success', 'Se Generaron Los Aleatorios Correctamente', '');

        // resolve(response.data[0]);
      },
      error: error => {
        this.loadingBtn1 = false;
        this.loading = false;
        // resolve(null
      },
    });
    // });
  }
  //   if: BK_SUPERVISION_MAE.CVE_PROCESO is null then
  // LIP_MENSAJE('El Proceso es información requerida', 'S');
  // LV_VALPROCESO:= 0;
  // 	end if;

  // if : BK_SUPERVISION_MAE.CVE_PERIODO is null then
  // LIP_MENSAJE('La clave del periodo es información requerida', 'S');
  // LV_VALPROCESO:= 0;
  // 	end if;
  async exportar() {
    const delegation = this.form.get('delegation').value;
    if (delegation == null) {
      this.form.get('delegation').markAsTouched();
      this.alert('warning', 'Debe Seleccionar una Delegación', '');
      return;
    }

    const cveProcess = this.form.get('process').value;
    if (cveProcess == null) {
      this.form.get('process').markAsTouched();
      this.alert('warning', 'El Tipo de Proceso es un Valor Requerido', '');
      return;
    }

    const period = this.form.get('period').value;
    if (period == null) {
      this.form.get('period').markAsTouched();
      this.alert('warning', 'El Período es un Valor Requerido', '');
      return;
    }

    if (this.goods.count() == 0) {
      this.alert('warning', 'No hay Registros Cargados para Exportar', '');
      return;
    }

    const params = new ListParams();

    params[
      'filter.delegationNumber'
    ] = `$eq:${this.delegationDefault.delegationNumber}`;
    params['filter.cveProcess'] = `$eq:${cveProcess}`;
    params['filter.cvePeriod'] = `$eq:${period}`;
    params[
      'filter.delegationType'
    ] = `$eq:${this.delegationMae.delegationType}`;
    delete params.limit;
    delete params.page;
    this.loadingBtn2 = true;
    this.survillanceService.getVigSupervisionAllExcel(params).subscribe({
      next: async (response: any) => {
        // Decodifica el archivo Base64 a un array de bytes
        const base64 = response.base64File;
        // const base64 = await this.decompressBase64ToString(response.data.base64File)
        await this.downloadExcel(base64);

        console.log('RESSS', response);
      },
      error: err => {
        this.loadingBtn2 = false;
        console.log('Errorr', err);
      },
    });

    return;
    const filename: string = 'Servicio de Vigilancia';
    const jsonToCsv = await this.returnJsonToCsv();
    console.log('jsonToCsv', jsonToCsv);
    let arr: any = [];
    jsonToCsv.map((item: any) => {
      let obj = {
        CONSECUTIVO: item.randomId,
        NO_BIEN: item.goodNumber,
        DIRECCIÓN: item.address,
        TRANSFERENTE: item.transferee,
      };
      arr.push(obj);
    });
    // CONSECUTIVO	NO_BIEN	DIRECCIÓN	TRANSFERENTE

    Promise.all(arr).then(item => {
      this.jsonToCsv = arr;
      console.log('this.jsonToCsv2', this.jsonToCsv);
      this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
    });
  }

  async returnJsonToCsv() {
    return this.goods.getAll();
  }

  async decompressBase64ToString(compressedBase64: any) {
    // const compressedBuffer = Buffer.from(compressedBase64, 'base64');
    // const decompressedBuffer = zlib.gunzipSync(compressedBuffer);
    // const decompressedString = decompressedBuffer.toString('utf8');
    // return decompressedString;
  }

  async downloadExcel(base64String: any) {
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const link = document.createElement('a');
    link.href = mediaType + base64String;
    link.download = 'Servicio_De_Vigilancia.csv';
    link.click();
    link.remove();
    this.loadingBtn2 = false;
    this.alert('success', 'Archivo Descargado Correctamente', '');
  }

  async revisarCarga() {
    if (!this.delegationDefault) {
      // const delet = this.form.get('delegation')
      //   (delet.invalid)
      // delet.markAsTouched();
      this.form.get('delegation').markAsTouched();
      this.alert('warning', 'Debe Seleccionar una Delegación', '');
      return;
    }

    const cveProcessTwo = this.formRegistro.get('processTwo').value;
    if (cveProcessTwo != 1 && cveProcessTwo != 2) {
      this.formRegistro.get('processTwo').markAsTouched();
      // cveProcessTwo.markAsTouched();
      this.alert('warning', 'El Proceso es Información Requerida', '');
      return;
    }

    const fromTwo = this.formRegistro.get('fromTwo').value;
    if (fromTwo == null || fromTwo == '') {
      this.formRegistro.get('fromTwo').markAsTouched();
      this.alert(
        'warning',
        'La Fecha Inicial del Período es Información Requerida',
        ''
      );
      return;
    }

    const toTwo = this.formRegistro.get('toTwo').value;
    if (toTwo == null || toTwo == '') {
      this.formRegistro.get('toTwo').markAsTouched();
      this.alert(
        'warning',
        'La Fecha Final del Período es Información Requerida',
        ''
      );
      return;
    }

    const fecha = new Date(fromTwo);
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    // const formattedDate = `${year}${month.toString()}`;
    const formattedDate = `${year}${month.toString().padStart(2, '0')}`;

    console.log(formattedDate);
    let obj = {
      delegationNo: this.delegationDefault.delegationNumber,
      lvCvePeriod: formattedDate,
      typeDelegation: this.delegationDefault.typeDelegation,
    };
    const LV_TOTREGISTRO: any = await this.getDataVIG_SUPERVISION_TMP(obj);

    if (LV_TOTREGISTRO != 0) {
      this.openForm(obj);
    } else {
      this.alert(
        'warning',
        'No Existen Bienes Cargados para Procesar en este Periodo',
        ''
      );
      return;
    }
  }

  returnParseDate_(data: Date) {
    console.log('DATEEEE', data);
    const formattedDate = moment(data).format('YYYY-MM-DD');
    return formattedDate;
  }

  performScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
