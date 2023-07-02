import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SURVEILLANCE_SERVICE_COLUMNS } from './surveillance-service-columns';

@Component({
  selector: 'app-surveillance-service',
  templateUrl: './surveillance-service.component.html',
  styles: [],
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
  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private survillanceService: SurvillanceService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private excelService: ExcelService
  ) {
    super();
    this.settings.columns = SURVEILLANCE_SERVICE_COLUMNS;
    this.settings.actions = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  async ngOnInit() {
    await this.prepareForm();

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

    await this.getDelegation(new ListParams());
  }

  async prepareForm() {
    this.form = this.fb.group({
      delegation: [null],
      process: [null, Validators.required],
      period: [null, Validators.required],
      from: [null],
      to: [null],
      total: [null],
    });

    this.formRegistro = this.fb.group({
      processTwo: [null],
      fromTwo: [null],
      toTwo: [null],
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
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    let obj = {
      delegationNumber: this.delegationMae.delegationNumber,
      cveProcess: this.form.value.process,
      cvePeriod: this.form.value.period,
      delegationType: this.delegationMae.delegationType,
    };
    this.objGetSupervionDet = obj;
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
    this.survillanceService.getVigSupervisionDet(params).subscribe({
      next: async (response: any) => {
        console.log('EDED2', response);
        this.goods.load(response.data);
        this.goods.refresh();
        this.totalItems = response.count;

        this.form.get('total').setValue(response.count);
        this.loading = false;
        // resolve(response.data);
      },
      error: error => {
        this.loading = false;
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
      this.form.get('from').setValue(event.initialDate);
      this.form.get('to').setValue(event.finalDate);
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
    if (this.delegationMae.delegationNumber == null) {
      LV_VALIDAREP = 0;
      this.alert(
        'warning',
        'La Delegación Regional es un valor requerido para generar el reporte',
        ''
      );
      return;
    } else {
      LV_DELEGACION = this.delegationMae.delegationNumber;
      LV_TIPO_DELEGA = this.delegationDefault.typeDelegation;
    }
    const cveProcess = this.form.get('process').value;

    if (cveProcess == null) {
      LV_VALIDAREP = 0;
      this.alert(
        'warning',
        'El tipo de proceso es un valor requerido para generar el reporte',
        ''
      );
      return;
    } else {
      LV_PROCESO = cveProcess;
    }

    const period = this.form.get('period').value;

    if (period == null) {
      LV_VALIDAREP = 0;
      this.alert(
        'warning',
        'El periodo es un valor requerido para generar el reporte',
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
        .fetchReport('REP_SERVICIO_VIGILANCIA', params)
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
            this.onLoadToast('success', '', 'Reporte generado');
            this.cleanForm();
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
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      const excelImport = this.excelService.getData<any>(binaryExcel);
      console.log('excelImport', excelImport);
      this.createDataVigilanceMtp(excelImport);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
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
    const cveProcessTwo = this.formRegistro.get('processTwo').value;

    if (cveProcessTwo != 1 && cveProcessTwo != 2) {
      LV_VALPROCESO = 0;
      this.alert('warning', 'El Proceso es información requerida', '');
      return;
    }

    const fromTwo = this.formRegistro.get('fromTwo').value;

    if (fromTwo == null || fromTwo == '') {
      LV_VALPROCESO = 0;
      this.alert(
        'warning',
        'La fecha inicial del periodo es información requerida',
        ''
      );
      return;
    }

    const toTwo = this.formRegistro.get('toTwo').value;

    if (toTwo == null || toTwo == '') {
      LV_VALPROCESO = 0;
      this.alert(
        'warning',
        'La fecha final del periodo es información requerida',
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
        pInitialDate: fromTwo,
        pEndDate: toTwo,
      };
      console.log('objjj', obj);
      const getPaValidPeriod_: any = await this.getPaValidaPeriodo(obj);

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
          '¿Está seguro de hacer la carga del archivo ?',
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
    // ELIMINAMOS REGISTROS //
    const deleteVIG_SUPERVISION_TMP_ = await this.deleteVIG_SUPERVISION_TMP(
      this.objectDelete
    );

    // VALIDAMOS ANTES DE REALIZAR NUEVOS REGISTROS //
    if (excelImport.length > 0) {
      let result = excelImport.map(async (item: any) => {
        console.log('item', item);
        try {
          LV_VALCONSE = Number(item.recordId);
          LV_REGVALIDO = 1;
        } catch (error) {
          LV_REGVALIDO = 0;
        }

        if (LV_REGVALIDO == 1) {
          if (item.goodNumber) {
            let objCreate = {
              recordId: item.recordId,
              delegationNumber: this.objectDelete.delegationNo,
              cvePeriod: this.objectDelete.lvCvePeriod,
              goodNumber: item.goodNumber,
              address: item.address,
              transferee: item.transferee,
              delegationType: item.delegationType,
              user: item.user,
            };

            const createVIG_SUPERVISION_TMP_: any =
              await this.createVIG_SUPERVISION_TMP(objCreate);

            if (createVIG_SUPERVISION_TMP_ === null) {
              //ALMACENAMOS LA DATA QUE NO SE GUARDÓ //
              arr.push(objCreate);
            }
          }
        }
      });

      Promise.all(result).then(async (resp: any) => {
        if (excelImport.length != arr.length) {
          this.alertQuestion(
            'success',
            'Registros cargados correctamente',
            '¿Quiere visualizarlos?'
          ).then(async question => {
            if (question.isConfirmed) {
              this.openForm();
            }
          });
        }

        this.objectDelete = null; // LIMPIAMOS OBJECTDELETE //
        this.clearInput();
      });
    } else {
      this.objectDelete = null; // LIMPIAMOS OBJECTDELETE //
      this.alert('warning', 'El archivo no contenía registros', '');
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
          this.loading = false;
          resolve(null);
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
  async createVIG_SUPERVISION_TMP(params: any) {
    return new Promise((resolve, reject) => {
      this.survillanceService.createVigSupervisionTmp(params).subscribe({
        next: async (response: any) => {
          console.log('CREATE', response);
          resolve(response);
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  clearInput() {
    this.fileInput.nativeElement.value = '';
  }

  // LISTA DE REGISTROS CREADOS EN LA TABLA VIG_SUPERVISION_TMP //
  openForm() {}
}
