/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, skip, take, takeUntil } from 'rxjs';
import { HasMoreResultsComponent } from 'src/app/@standalone/has-more-results/has-more-results.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { getDataFromExcel, showToast } from 'src/app/common/helpers/helpers';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { IncidentMaintenanceService } from 'src/app/core/services/ms-generalproc/incident-maintenance.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { MassiveDictationService } from 'src/app/core/services/ms-massivedictation/massivedictation.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import * as XLSX from 'xlsx';
import { MassRulingModalComponent } from '../mass-ruling-modal/mass-ruling-modal.component';
import { MassRullingResponses } from '../tools/mass-rulling-responses';

@Component({
  selector: 'app-mass-ruling',
  templateUrl: './mass-ruling.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }
    `,
  ],
})
export class MassRulingComponent
  extends MassRullingResponses
  implements OnInit, OnDestroy
{
  @ViewChild('fileExpedient') fileInput: ElementRef;
  expedientNumber: number = null;
  wheelNumber: number = null;
  data: LocalDataSource = new LocalDataSource();
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  wheelType: string = '';
  maxDate: Date = new Date();
  deleteGoodDictamen: boolean;
  columnFilters: any = [];
  dictaminacion: any;
  tableSettings = { ...this.settings };
  totalItems = 0;
  // Data table
  dataTable2: LocalDataSource = new LocalDataSource();
  dataTable: { goodNumber: number; fileNumber: number }[] = [];
  isFileLoad = false;

  params = new BehaviorSubject<ListParams>(new ListParams());
  tableSettings1 = { ...this.settings };
  // Data table
  dataTableErrors: { processId: any; description: string }[] = [];
  totalItemsErrors = 0;
  paramsErrors = new BehaviorSubject<ListParams>(new ListParams());

  btnsEnabled = {
    btnDictation: false,
    btnGoodDictation: false,
  };

  public form = new FormGroup({
    /**@description no_of_dicta */
    id: new FormControl('', [Validators.required]),
    /**@description clave_oficio_armada */
    passOfficeArmy: new FormControl(''),
    /**@description no_expediente */
    expedientNumber: new FormControl(''),
    /**@description tipo_dictaminacion */
    typeDict: new FormControl(''),
    /**@description estatus_dictaminacion */
    statusDict: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    /**@description fec_dictaminacion */
    dictDate: new FormControl(''),
    /**@description usuario_dictamina */
    userDict: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    /**@description fecha_instructora */
    instructorDate: new FormControl(''),
    /**@description no_volante */
    wheelNumber: new FormControl(''),
    /**@description nn */
    delete: new FormControl({ value: false, disabled: false }),
  });
  public formCargaMasiva = new FormGroup({
    identificadorCargaMasiva: new FormControl('', [Validators.required]),
  });
  isDisabledBtnGoodDictation = true;
  result: any;
  identifier = new DefaultSelect();
  validate: boolean = false;
  fileNumber: number;
  goodNumber: number;
  form2: FormGroup = new FormGroup({});
  records: any[] = [];
  validCsv: boolean = false;
  validXls: boolean = false;
  tableXls: any[] = [];
  tableCsv: any[] = [];
  paramsXls = new BehaviorSubject<ListParams>(new ListParams());
  readFileArrayXls: any;
  readFileArrayCsv: any;
  // file: File | null = null;
  // public searchForm: FormGroup;
  constructor(
    // private fb: FormBuilder,
    protected dictationService: DictationService,
    private goodService: GoodService,
    private massiveGoodService: MassiveGoodService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private notificationsService: NotificationService,
    protected massiveDictationService: MassiveDictationService,
    protected documentsService: DocumentsService,
    private authService: AuthService,
    private dictationXGood1Service: DictationXGood1Service,
    private documentsDictumStatetMService: DocumentsDictumStatetMService,
    protected incidentMaintenanceService: IncidentMaintenanceService,
    private datePipe: DatePipe,
    private goodProcessService: GoodProcessService,
    private historyGoodService: HistoryGoodService,
    private fb: FormBuilder
  ) {
    super();
    this.tableSettings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false, //oculta subheaader de filtro
      //mode: 'external', // ventana externa
      columns: {
        goodNumber: {
          sort: false,
          title: 'No. Bien',
        },
        fileNumber: {
          sort: false,
          title: 'No. Expediente',
        },
      },
    };
    this.tableSettings1 = {
      ...this.settings,
      actions: false,
      hideSubHeader: false, // ventana externa
      columns: {
        description: {
          sort: false,
          title: 'Errores del proceso',
        },
      },
    };
  }

  ngOnInit(): void {
    /* this.form.get('wheelNumber').valueChanges.subscribe(x => {
      this.getVolante();
    });*/

    this.params.pipe(skip(1)).subscribe(params => {
      this.loadDataForDataTable(params);
    });

    this.paramsErrors.pipe(skip(1)).subscribe(params => {
      this.getTmpErrores(params);
    });

    this.prepareForm();

    this.dataTable2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            //  console.log('loooool');
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'goodNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fileNumber':
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.loadDataByIdentifier();
        }
      });
  }

  prepareForm() {
    this.form.controls['typeDict'].disable();
    this.form.controls['statusDict'].disable();
    this.form.controls['userDict'].disable();
    this.form.controls['dictDate'].disable();
    this.form.controls['instructorDate'].disable();
    this.form.controls['passOfficeArmy'].disable();
    this.form2 = this.fb.group({
      fileCsv: [null],
      fileXls: [null],
    });
  }

  loadDataForDataTable(listParams: ListParams) {
    if (this.isFileLoad) {
      this.getTmpExpDesahogoB(listParams);
    } else {
      this.loadDataByIdentifier(listParams);
    }
  }

  getIdentifier(params: ListParams) {
    if (params.text) {
      if (!isNaN(parseInt(params.text))) {
        params['filter.count'] = `$eq:${params.text}`;
        params['search'] = '';
      } else if (typeof params.text === 'string') {
        params['filter.identificador'] = `$ilike:${params.text}`;
      }
    }
    this.massiveGoodService.getIdentifier(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.result = resp.data.map(async (item: any) => {
          const formatDate = this.datePipe.transform(
            item?.fec_cargamasiv,
            'dd/MM/yyyy'
          );
          item['idCargMasiv'] =
            item.identificador + ' - ' + formatDate + ' - ' + item.count;
        });
        this.identifier = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.identifier = new DefaultSelect();
      },
    });
  }

  changeIdentifier(event: any) {
    if (event) {
      console.log(event.identificador);
    }
  }

  getDictations(
    // params: ListParams,
    id: number,
    wheelNumber: number
  ) {
    this.expedientNumber = id;
    if (!id && !wheelNumber) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe ingresar un número de dictaminacion o un número de volante'
      );
      return;
    }

    // this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    //  let data = this.params.value;
    //   data.limit = 1;
    let params = `?limit=1&page=1`;

    if (id) {
      params += `&filter.id=${id}`;
    }

    if (wheelNumber) {
      params += `&filter.wheelNumber=${wheelNumber}`;
    }

    const paramsSearch = this.generateParamsSearchDictation();
    Object.keys(paramsSearch).forEach(key => {
      params += `&${key}=${paramsSearch[key]}`;
    });
    this.dictationService.getAllWithFilters(params).subscribe({
      next: data => {
        if (data.count > +1) {
          console.log('get dictations', data);
          this.openMoreOneResults();
        } else {
          // this.form.patchValue(data.data[0] as any);
          // this.form
          //   .get('instructorDate')
          //   .patchValue(new Date(data.data[0].instructorDate) as any);
          // this.form
          //   .get('dictDate')
          //   .patchValue(new Date(data.data[0].dictDate) as any);
          this.loadValuesDictation(data.data[0]);
        }
      },
      error: err => {
        this.loading = false;
        this.form.reset();
        this.onLoadToast(
          'warning',
          'advertencia',
          'Sin datos para la informacion suministrada'
        );
      },
    });
  }

  loadValuesDictation(data: any) {
    this.form.patchValue(data);
    this.form
      .get('instructorDate')
      .patchValue(new Date(data.instructorDate) as any);
    this.form.get('dictDate').patchValue(new Date(data.dictDate) as any);
  }

  searchDictation() {
    const id = this.form.get('id').value;
    const wheelNumber = this.form.get('wheelNumber').value;
    const noExp = this.form.get('expedientNumber').value;
    //this.getDictations(parseInt(id), wheelNumber);
    console.log(id, wheelNumber, noExp);
    if (id === '' && wheelNumber === '' && noExp === '') {
      this.getDictationForId('find');
    } else {
      this.getDictationForId('');
    }
  }

  close() {
    this.modalService.hide();
  }

  async onClickGoodDictation() {
    console.log(this.dictaminacion);
    const question = await this.alertQuestion(
      'warning',
      'Confirmación',
      'Los Bienes del Dictamen Serán Eliminados ¿Desea Continuar?'
    );
    if (!question.isConfirmed) {
      return;
    } else {
      try {
        if (!this.formCargaMasiva.value.identificadorCargaMasiva) {
          this.onLoadToast(
            'warning',
            '',
            'Debe Ingresar Un Identificador de Carga Masiva y Cargar los Bienes del Identificador'
          );
          return;
        }
        let count = await this.getCount(this.goodNumber);
        let countData: any = count;
        const statusCount = countData.data[0].count;
        if (statusCount === 0) {
          this.alert(
            'warning',
            `El Estatus del Bien ${this.goodNumber}`,
            'No Corresponde a un Estatus de Dictaminacion'
          );
          return;
        }
        this.documentsDictumStatetMService
          .deleteDocumentXGood(this.goodNumber)
          .subscribe({
            next: resp => {},
            error: err => {
              this.alert('error', 'Ocurrio un Error', 'Al Elimnar el Bien');
            },
          });
        setTimeout(() => {
          this.historyGoodService
            .getUpdateGoodXHist(this.goodNumber)
            .subscribe({
              next: resp => {
                //console.log(resp.data[0].estado);
                //this.updateStatus(this.goodNumber, status);
                this.onLoadToast(
                  'success',
                  'Proceso Terminado',
                  'Correctamente'
                );
                this.onClickBtnClear();
              },
              error: err => {
                this.alert(
                  'error',
                  'Problemas',
                  'Para Regresar al Estatus Anterior'
                );
              },
            });
        }, 3000);
      } catch (ex: any) {
        this.btnsEnabled.btnDictation = false;
        this.alert('error', '', 'Verificar si Selecciono un Bien');
      }

      let bodyDelete: any = {};
      bodyDelete['officialNumber'] = this.form.value.expedientNumber;
      bodyDelete['typeDictum'] = this.form.value.typeDict;
      //// hace udo de la tabla documentos_dictamen_x_bien_m elige un dato de tipo PROCEDENCIA
      ///los datos de la tabla  no concuerdan
      /*this.dictationService
      .getTmpExpDesahogoByExpedient(this.dictaminacion.expedientNumber)
      .subscribe({
        next: data => {
          console.log(data);
          
          console.log(bodyDelete);
        },
        error: err => {
          this.onLoadToast(
            'warning',
            '',
            'No Se Han encontrado Bienes Relacionados'
          );
        },
      });*/

      /*if (this.dataTable.length < 1) {
        this.onLoadToast(
          'warning',
          '',
          'No Se Tiene Datos Cargados En la Tabla de Carga Masiva'
        );
        return;
      }

      let body: any = {};
      if (this.isFileLoad) {
        body['goodIds'] = /* this.dataTable.map(x => {
        return { no_bien: x.goodNumber }; 
      }); this.dataFile.map(x => {
          return { no_bien: x.goodNumber };
        });
      } else {
        if (!this.formCargaMasiva.value.identificadorCargaMasiva) {
          this.onLoadToast(
            'warning',
            '',
            'Debe Ingresar Un Identificador de Carga Masiva y Cargar los Bienes del Identificador'
          );
          return;
        }

        body['identifier'] =
          this.formCargaMasiva.value.identificadorCargaMasiva;
        this.btnsEnabled.btnGoodDictation = true;
      }
      this.documentsDictumStatetMService.removeDictamen(bodyDelete).subscribe({
        next: data => {
          this.onLoadToast('success', 'Bien', 'Eliminado Correctamente');
          this.dataTable = [];
          this.totalItems = 0;
          this.dataTableErrors = [];
          this.totalItemsErrors = 0;
          this.formCargaMasiva.reset();
          this.form.get('delete').setValue(false);
          this.form.get('delete').disable();
          this.btnsEnabled.btnGoodDictation = false;
        },
        error: err => {
          this.onLoadToast('warning', '', 'Error al Eliminar los Bienes');
          this.btnsEnabled.btnGoodDictation = false;
        },
      });*/
    }
  }

  async getCount(goodNumber: number) {
    return new Promise((resolve, reject) => {
      this.historyGoodService.getCount(goodNumber).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  onClickBtnClear() {
    this.dataTable2.load([]);
    this.totalItems = 0;
    this.dataTableErrors = [];
    this.totalItemsErrors = 0;
    this.validate = false;
    this.formCargaMasiva.reset();
    this.form.reset();
    this.form2.reset();
    this.validCsv = false;
    this.validXls = false;
    this.form.get('id').setValue('');
    this.form.get('wheelNumber').setValue('');
    this.form.get('expedientNumber').setValue('');
    this.form.get('delete').setValue(false);
    this.form.get('delete').disable();
    this.isFileLoad = false;
  }

  //TODO: FOR TESTING
  async onClickDictation() {
    console.log(this.dictaminacion);

    const responseQuestion = await this.alertQuestion(
      'info',
      '',
      'Desea Eliminar el Dictamen: ' + this.form.get('passOfficeArmy').value,
      'Continuar',
      'Cancelar'
    );
    if (!responseQuestion.isConfirmed) {
      this.btnsEnabled.btnDictation = false;
      return;
    } else {
      let bodyDelete: any = {};
      //// de utilizan datos  de la tabla : tmp_exp_desahogob

      /*this.dictationService
        .getTmpExpDesahogoByExpedient(this.dictaminacion.expedientNumber)
        // .getTmpExpDesahogoByExpedient(793680)
        .subscribe({
          next: data => {
            // console.log(data);
            bodyDelete['ofDictNumber'] = this.dictaminacion.id;
            bodyDelete['id'] = data.data[0].goodNumber;
            bodyDelete['typeDict'] = this.dictaminacion.typeDict;
            // console.log(bodyDelete);
          },
          error: err => {
            this.onLoadToast(
              'warning',
              '',
              'No Se Han encontrado Bienes Relacionados'
            );
          },
        });*/

      /*  const armyOfficeKey = this.form.get('passOfficeArmy').value;
    console.log(armyOfficeKey);
    if (!armyOfficeKey) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe Ingresar la Clave de la Oficina del Ejercito'
      );
      return;
    }*/

      try {
        let count = await this.getDictationXState(
          this.form.get('passOfficeArmy').getRawValue()
        );
        let dataCount: any = count;
        let count1: number = dataCount.count;

        const responseQuestion1 = await this.alertQuestion(
          'info',
          '',
          `El Total de Expediente a Eliminar son: ${count1}`,
          'Continuar'
        );
        if (responseQuestion1.isConfirmed) {
          /*this.btnsEnabled.btnDictation = false;
          return;*/
          let usuar;
          try {
            //  console.log(this.authService.decodeToken());
            const user = this.authService
              .decodeToken()
              .preferred_username?.toUpperCase();
            usuar = await this.getRtdictaAarusr(user);
            if (usuar) {
              this.deleteDictaMasIva();
            }
          } catch (ex) {
            this.btnsEnabled.btnDictation = false;
            this.alert(
              'info',
              'El Usuario',
              'No Tiene Permiso Para Eliminar Registros'
            );
            return;
          }

          /*if (usuar?.user) {
            //  console.log(bodyDelete);
            this.dictationXGood1Service.removDictamen(bodyDelete).subscribe({
              next: data => {
                this.alert('success', 'Dictamen', 'Proceso terminado');
              },
              error: err => {
                this.alert(
                  'error',
                  'Error',
                  'Error Desconocido Consulte a Su Analista'
                );
              },
            });
            await this.procedureDeleteDictationMoreTax(
              this.form.get('passOfficeArmy').value
            );
            this.alert('success', 'Dictamen', 'Proceso terminado');
            this.btnsEnabled.btnDictation = false;
          } else {
            this.alert(
              'error',
              '',
              'Su Usuario No Tiene Permiso Para Eliminar Registros'
            );
            this.btnsEnabled.btnDictation = false;
          }*/
        }

        /*this.onLoadToast(
          'info',
          '',
          `El Total de Expediente a eliminar son: ${count1}`
        );*/
      } catch (ex: any) {
        this.btnsEnabled.btnDictation = false;
        //this.alert('error', '', 'Error Desconocido Consulte a Su Analista');
      }
    }
  }

  async deleteDictaMasIva() {
    let status: string;
    let updateStatus = await this.getApplicationGetData(
      this.form.get('passOfficeArmy').getRawValue()
    );
    let dataUpdate: any = updateStatus;
    //console.log(dataUpdate.data.length);
    if (dataUpdate === null) {
      this.alert(
        'warning',
        'No se Encontraron Registros',
        'Para Actualizar el Estatus'
      );
      //return;
    } else {
      for (let i = 0; i < dataUpdate.data.length; i++) {
        let status = await this.getStatus(
          dataUpdate.data[i].no_bien,
          new ListParams()
        );
        let dataStatus: any = status;
        if (status == null) {
          this.alert('warning', '', 'No se Encontro el Estatus Anterior');
          break;
        }
        console.log(status);
        if (dataUpdate.data[i].no_bien && dataStatus.data[0].estatus) {
          const goodNumber = dataUpdate.data[i].no_bien;
          const status = dataStatus.data[0].estatus;
          try {
            this.updateStatus(goodNumber, status);
          } catch (ex: any) {
            this.btnsEnabled.btnDictation = false;
            this.alert('error', '', 'Error Desconocido Consulte a Su Analista');
          }
        }
      }
    }
    setTimeout(() => {
      if (this.form.get('passOfficeArmy').getRawValue()) {
        const keyArmy = this.form.get('passOfficeArmy').getRawValue();
        let body = {
          armedTradeKey: keyArmy,
        };
        this.documentsDictumStatetMService.deleteMassive(body).subscribe({
          next: resp => {
            this.alert('success', 'Dictamenes Eliminados', 'Correctamente');
          },
          error: err => {
            this.alert(
              'error',
              'Ocurrio un Error',
              'Al Elimnar los Dictamenes'
            );
          },
        });
      }
    }, 3000);
  }

  async updateStatus(goodNumber: number, status: string) {
    return new Promise((resolve, reject) => {
      this.goodService.putStatusGood(goodNumber, status).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getStatus(goodNumber: string | number, params: ListParams) {
    return new Promise((resolve, reject) => {
      this.historyGoodService.getStatus(goodNumber, params).subscribe({
        next: resp => {
          console.log(resp);
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getApplicationGetData(key: string) {
    return new Promise((resolve, reject) => {
      let body = {
        armedTradeKey: key,
      };
      this.goodProcessService.getApplicationData(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getDictationXState(key: string) {
    return new Promise((resolve, reject) => {
      let body = {
        armedTradeKey: key,
      };
      this.documentsDictumStatetMService.getDocumentXState(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  onClickLoadByIdentifier(): void {
    this.isFileLoad = false;
    this.dataTable = [];
    this.totalItems = 0;
    this.dataTableErrors = [];
    this.totalItemsErrors = 0;
    this.params.next(new ListParams());
  }

  loadDataByIdentifier(listParams = new ListParams()) {
    this.isFileLoad = false;
    const identificador = this.formCargaMasiva.get(
      'identificadorCargaMasiva'
    ).value;
    if (!identificador) {
      this.onLoadToast(
        'error',
        '',
        'Debe Ingresar un Identificador de Carga Masiva'
      );
      this.totalItems = 0;
      return;
    }
    this.loading = true;
    const params2 = `?filter.id=${identificador}&page=${listParams.page}&limit=${listParams.limit}`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    // console.log(params2);
    // console.log(params);
    this.massiveGoodService.getAllWithFilters(params2, params).subscribe({
      next: data => {
        //console.log('rrrrrrr', data);
        this.dataTable = data.data.map(item => {
          return {
            goodNumber: (item.goodNumber as any)?.id,
            fileNumber: (item.fileNumber as any)?.id,
          };
        });
        this.dataTable2.load(this.dataTable);
        this.totalItems = data.count;
        this.loading = false;
        // this.file = null;
      },
      error: () => {
        this.dataTable = [];
        this.totalItems = 0;
        this.dataTableErrors = [];
        this.totalItemsErrors = 0;
        // this.file = null;
        this.loading = false;
      },
    });
  }

  dataFile: { goodNumber: number; fileNumber: number }[];

  async onClickLoadFile(event: any) {
    //  console.log(event.target.files);
    this.dataTableErrors = [];
    this.dataTable = [];
    this.totalItemsErrors = 0;
    this.isFileLoad = true;
    this.totalItems = 0;
    const { id, typeDict } = this.form.value;
    if (!id && !typeDict) {
      showToast({
        icon: 'error',
        text: 'Se debe ingresar un Dictamen.',
      });
      event.target.value = null;
      return;
    }
    const file = event.target.files[0];

    const data = await getDataFromExcel(file);
    if (!this.validateExcel(data)) {
      this.fileInput.nativeElement.value = null;
      return;
    }
    this.dataFile = data.map((item: any) => {
      return {
        goodNumber: item.NO_BIEN,
        fileNumber: item.NO_EXPEDIENTE,
      };
    });

    this.pupPreviousData({ bienes: this.dataFile });
    // const dataTable: any[] = [];
    // const dataTableError: any[] = [];
    // data.forEach((item: any, index) => {
    //   if (isNaN(item.NO_BIEN) || isNaN(item.NO_EXPEDIENTE)) {
    //     dataTableError.push({
    //       processId: 12345,
    //       description: `REGISTRO: ${index + 1}, CONTENIDO NO_BIEN: ${
    //         item.NO_BIEN
    //       }, NO_EXPEDIENTE: ${item.NO_EXPEDIENTE} `,
    //     });
    //     return;
    //   }
    //   dataTable.push({
    //     goodNumber: item.NO_BIEN ,
    //     fileNumber: item.NO_EXPEDIENTE,
    //   });
    // });
    // this.dataTableErrors = dataTableError;
    // this.dataTable = dataTable;

    this.fileInput.nativeElement.value = null;
  }

  async onClickPrintOffice() {
    try {
      const {
        CLAVE_ARMADA,
        PARAMFORM,
        P_OFICIO,
        TIPO_DIC,
        TIPO_VOL,
        P_TIPOVOL,
        vIDENTI,
      } = await this.prePrints();
      console.log({
        CLAVE_ARMADA,
        PARAMFORM,
        P_OFICIO,
        TIPO_DIC,
        TIPO_VOL,
        vIDENTI,
      });
      console.log(vIDENTI);
      if (vIDENTI.includes('4') && TIPO_DIC === 'PROCEDENCIA') {
        let report = 'RGENREPDICTAMASDES_EXT';
        this.printReport(report, {
          CLAVE_ARMADA,
          P_OFICIO,
          TIPO_DIC,
          P_TIPOVOL,
        });
      } else {
        let report = 'RGENREPDICTAMASDES';
        this.printReport(report, {
          P_OFICIO,
          TIPO_DIC,
        });
      }
      /*let report = 'RGENREPDICTAMASDES';
      if (vIDENTI.includes('4')) {
        report = 'RGENREPDICTAMASDES_EXT';
      }

      this.printReport(report, {
        CLAVE_ARMADA,
        P_OFICIO,
        TIPO_DIC,
        TIPO_VOL,
      });*/
    } catch (ex) {
      this.onLoadToast('error', '', 'Reporte No Disponible');
    }
  }

  async onClickPrintRelationGood() {
    try {
      /*const { CLAVE_ARMADA, PARAMFORM, P_OFICIO, TIPO_DIC, TIPO_VOL } =
        await this.prePrints();*/

      const { CLAVE_ARMADA, TIPO_DIC, TIPO_VOL } = await this.prePrints();

      this.printReport('RGENREPDICTAMASREL', {
        CLAVE_ARMADA,
        TIPO_DIC,
        TIPO_VOL,
      });

      /*this.printReport('RGENREPDICTAMASREL', {
        CLAVE_ARMADA,
        PARAMFORM,
        P_OFICIO,
        TIPO_DIC,
        TIPO_VOL,
      });*/
    } catch (ex) {
      this.onLoadToast('error', '', 'Reporte No Disponible');
    }
  }

  async onClickPrintRelationExpedient() {
    try {
      const { CLAVE_ARMADA, TIPO_DIC, TIPO_VOL } = await this.prePrints();
      this.printReport('RGENREPDICTAMASEXP', {
        CLAVE_ARMADA,
        TIPO_DIC,
        TIPO_VOL,
      });
    } catch (ex) {
      this.onLoadToast('error', '', 'Reporte No Disponible');
    }
  }

  async btnExpedientesXls(event: any) {
    // console.log('event', event);
    const data = await getDataFromExcel(event.target.files[0]);
    if (!this.validateExcel(data)) {
      return;
    }
  }

  isDisableCreateDictation = false;

  async onClickCreatedDictation() {
    console.log(this.form);
    if (
      !this.form.getRawValue().instructorDate ||
      !this.form.getRawValue().dictDate ||
      !this.form.getRawValue().expedientNumber ||
      !this.form.getRawValue().id ||
      !this.form.getRawValue().passOfficeArmy ||
      !this.form.getRawValue().statusDict ||
      !this.form.getRawValue().typeDict ||
      !this.form.getRawValue().userDict ||
      !this.form.getRawValue().wheelNumber
    ) {
      this.alert('error', '', 'Se Debe Ingresar la Informacion de un Dictamen');
      return;
    }
    let vNO_OF_DICTA;
    if (this.form.invalid) {
      this.alert('error', '', 'Se Debe Ingresar la Informacion de un Dictamen');
      return;
    }
    if (!this.form.value.id && !this.form.getRawValue().typeDict) {
      this.alert('error', '', 'Se Debe Ingresar la Informacion de un Dictamen');
      return;
    }

    try {
      const dictation = await this.getDictationForId('other');
      vNO_OF_DICTA = dictation;
    } catch (error) {
      this.alert('error', '', 'No Se Encontró el Dictamen');
      return;
    }
    const body = {
      p_no_of_dicta: Number(this.form.get('id').value),
      p_tipo_dictaminacion: this.form.get('typeDict').getRawValue(),
    };
    console.log(body);
    // debugger;
    ////////////////////////////////////Hay que revisar por que si se le envia todo no realiza la insercion correctamente.
    // console.log(body);
    this.dictationService.postCargaMasDesahogob(body).subscribe({
      next: () => {
        this.isDisableCreateDictation = true;
        this.dataTableErrors = [];
      },
      error: e => {
        console.log({ e });
        this.alert('error', '', 'Error Inesperado En el Proceso.');
      },
    });
  }

  async getDictationForId(type: string) {
    let body: any;
    if (this.form.getRawValue().typeDict == '') {
      body = {
        id: this.form.value.id,
        typeDict: null,
      };
    } else {
      body = {
        id: this.form.value.id,
        typeDict: this.form.getRawValue().typeDict,
      };
    }

    this.dictationService.findByIds(body).subscribe({
      next: data => {
        const dictation = data;
        this.dictaminacion = data;
        console.log(data);
        this.form.controls['typeDict'].setValue(data.typeDict);
        this.form.controls['statusDict'].setValue(data.statusDict);
        this.form.controls['userDict'].setValue(data.userDict);
        const forDicDate = this.datePipe.transform(data.dictDate, 'dd/MM/yyyy');
        this.form.controls['dictDate'].setValue(forDicDate);
        const forInstructorDate = this.datePipe.transform(
          data.instructorDate,
          'dd/MM/yyyy'
        );
        this.form.controls['instructorDate'].setValue(forInstructorDate);
        this.form.controls['passOfficeArmy'].setValue(data.passOfficeArmy);
        this.validate = true;
        //console.log(this.form);
        // this.openMoreOneResults(data);
        return dictation;
      },
      error: error => {
        console.log(error);
      },
    });
    if (type == 'find') {
      // console.log(this.form);
      this.openMoreOneResults2();
    }
  }

  getVolante() {
    if (this.form.get('wheelNumber').value) {
      const params = `?filter.wheelNumber=${
        this.form.get('wheelNumber').value
      }&page=1&limit=1`;

      this.notificationsService.getAllFilter(params).subscribe({
        next: data => {
          this.wheelType = data.data[0].wheelType;
        },
        error: err => {
          console.log(err);
        },
      });
    }
  }

  rowsSelected(event: any) {
    if (event) {
      console.log(event.data.fileNumber, event.data.goodNumber);
      this.fileNumber = event.data.fileNumber;
      this.goodNumber = Number(event.data.goodNumber);
    }
  }

  changeCbDelete(event: any) {
    let target = event.target;
    const { id, typeDict, expedientNumber } = this.form.getRawValue();
    if ((!id && !typeDict) || (!this.fileNumber && !this.goodNumber)) {
      this.alert('info', '', 'No se han cargado los bienes a borrar');
      this.form.value.delete = false;
      event.target.checked = !target.checked;
      return;
    }

    if (target.checked) {
      this.isDisabledBtnGoodDictation = false;
      this.isDisableCreateDictation = true;
    } else {
      this.isDisabledBtnGoodDictation = true;
      this.isDisableCreateDictation = false;
    }
    console.log({ event, value: target.checked });
  }

  async prePrints(): Promise<{
    PARAMFORM: string;
    P_OFICIO: string;
    TIPO_DIC: any;
    CLAVE_ARMADA: any;
    TIPO_VOL: any;
    P_TIPOVOL: string;
    vIDENTI: any;
  }> {
    const { id, typeDict, passOfficeArmy, wheelNumber } =
      this.form.getRawValue();
    let vTIPO_VOLANTE: any;
    let vIDENTI = '';
    // console.log({ id, typeDict, passOfficeArmy });
    if (!id && !typeDict && !passOfficeArmy) {
      this.alert('warning', 'Error', 'Se Debe Ingresar un Dictamen.');
      throw new Error('Se debe ingresar un Dictamen.');
    }

    try {
      await this.getDictationForId('other');
    } catch (error) {
      this.alert('warning', 'Error', 'No se encontró un Dictamen');
      throw 'No se encontró un Dictamen';
    }

    try {
      let VIDEN = await this.findGoodAndDictXGood1();
      if (VIDEN) {
        let dataVIDEN: any = VIDEN;
        vIDENTI = dataVIDEN.data[0].substr;
      } else {
        vIDENTI = '';
      }

      //console.log(dataVIDEN.data[0].substr);
    } catch (error: any) {
      if (error.status >= 400 && error.status < 500) {
        this.alert(
          'warning',
          '',
          'No Se Encontró Identificador en el Dictamen.'
        );
        throw error;
      }
      //this.alert('warning', 'info', error?.message);
      throw error;
    }

    try {
      const notification = await this.getNotificationWhereWheelNumber();
      let data: any = notification;
      vTIPO_VOLANTE = data[0].wheelType;
      //console.log(vTIPO_VOLANTE);
    } catch (error) {
      this.alert(
        'warning',
        'Error',
        'No se encontró la Notificación del Dictamen.'
      );
      throw 'No se encontró la Notificación del Dictamen.';
    }

    //ERROR: este codigo no implementado de oracle forms
    //   pl_id := Get_Parameter_List(pl_name);
    //  IF Id_Null(pl_id) THEN
    //     pl_id := Create_Parameter_List(pl_name);
    //     IF Id_Null(pl_id) THEN
    //        LIP_MENSAJE('Error al crear lista de parámetros. '||pl_name,'N');
    //        RAISE Form_Trigger_Failure;
    //     END IF;
    //  ELSE
    //     Destroy_Parameter_List(pl_id);
    //     pl_id := Create_Parameter_List(pl_name);
    //  END IF;

    return {
      PARAMFORM: 'NO',
      P_OFICIO: id,
      TIPO_DIC: typeDict,
      CLAVE_ARMADA: passOfficeArmy,
      TIPO_VOL: vTIPO_VOLANTE,
      P_TIPOVOL: wheelNumber,
      vIDENTI,
    };
  }

  validateExcel(data: unknown): boolean {
    if (!Array.isArray(data)) {
      this.alert('error', 'No se encontraron datos en el archivo', '');
      return false;
    }
    if (Array.isArray(data) && data.length === 0) {
      this.alert('error', 'No se encontraron datos en el archivo', '');
      return false;
    }
    const columns = ['NO_BIEN', 'NO_EXPEDIENTE'];
    const keysExcel = Object.keys(data[0]);
    if (!keysExcel.every(key => columns.includes(key))) {
      this.alert(
        'error',
        `Columna(s) no encontrada(s), asegúrese de contener esta columnas ${columns.join(
          ','
        )}`,
        ''
      );
      return false;
    }
    return true;
  }

  printReport(report?: string, params?: any) {
    this.siabService.fetchReport(report, params).subscribe({
      next: response => {
        //  console.log('habemus pdf');
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
      error: () => {
        this.loading = false;
        this.onLoadToast('error', '', 'Reporte No Disponible');
      },
    });
  }

  async getNotificationWhereWheelNumber() {
    const { wheelNumber } = this.form.value;
    const queryParams = `filter.wheelNumber=$eq:${wheelNumber || ''}&limit=1`;
    //   console.log(queryParams);
    const notification = await firstValueFrom(
      this.notificationsService.getAllFilter(queryParams)
    );
    console.log(notification.data);
    return notification.data;
  }

  async findGoodAndDictXGood1() {
    /*const body = {
      ofDictNumber: this.form.value.id,
      typeDict: this.form.getRawValue().typeDict,
    };*/
    const ofDictNumber = Number(this.form.value.id);
    const typeDict = this.form.getRawValue().typeDict;
    //  console.log(body);
    /*const data = [];
    data.push(
      await firstValueFrom(this.dictationService.getDictationXGoodGetIden(typeDict, ofDictNumber))
    );
    let dicXGood = await firstValueFrom(this.dictationService.getDictationXGoodGetIden(typeDict, ofDictNumber));
    //  console.log(data);
    if (data?.length > 1) {
      throw new Error('Se tiene varios identificadores en el Dictamen.');
    }
    return dicXGood;*/
    return new Promise((resolve, reject) => {
      this.dictationService
        .getDictationXGoodGetIden(typeDict, ofDictNumber)
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: err => {
            resolve(null);
          },
        });
    });
  }

  showReport(nameReport: string, params: { [key: string]: any }) {
    this.siabService.fetchReport(nameReport, params).subscribe(response => {
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

  generateParamsSearchDictation() {
    const { id, expedientNumber, wheelNumber } = this.form.value;
    const params: any = {};
    id && (params['filter.id'] = id);
    expedientNumber && (params['filter.expedientNumber'] = expedientNumber);
    wheelNumber && (params['filter.wheelNumber'] = wheelNumber);
    console.log(params);
    return params;
  }

  openMoreOneResults2() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: any) => {
        if (next) {
          console.log(next);
          this.form.get('id').setValue(next.id);
          this.form.get('wheelNumber').setValue(next.wheelNumber);
          this.form.get('expedientNumber').setValue(next.expedientNumber);
          this.getDictationForId('');
        }
      },
    };
    this.modalService.show(MassRulingModalComponent, modalConfig);
  }

  openMoreOneResults(data?: any) {
    console.log(data);
    let context: Partial<HasMoreResultsComponent> = {
      queryParams: this.generateParamsSearchDictation(),
      columns: {
        id: {
          title: 'Identificador',
          sort: false,
        },
        expedientNumber: {
          title: 'No. de Expediente',
          sort: false,
        },
        wheelNumber: {
          title: 'No. de Volante',
          sort: false,
        },
        typeDict: {
          title: 'Tipo de Dictamen',
          sort: false,
        },
        statusDict: {
          title: 'Estatus',
          sort: false,
        },
      },
      totalItems: data ? data.count : 0,
      ms: 'dictation',
      path: 'dictation',
    };
    console.log(context);
    const modalRef = this.modalService.show(HasMoreResultsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onClose.pipe(take(1)).subscribe(result => {});
  }

  btnImprimeRelacionBienes() {
    if (
      !this.form.get('id').value &&
      !this.form.get('typeDict').getRawValue()
    ) {
      this.alert('info', 'Se debe ingresar un dictamen', '');
      return;
    }

    let params = {
      CLAVE_ARMADA: this.form.controls['passOfficeArmy'].getRawValue(),
      TIPO_DIC: this.form.controls['typeDict'].getRawValue(),
      TIPO_VOL: this.wheelType,
    };

    this.siabService
      .fetchReport('RGENREPDICTAMASREL', params)
      .subscribe(response => {
        if (response !== null) {
          if (response.body === null || response.code === 500) {
            this.alert('error', 'No existe el reporte', '');
            return;
          }
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }

  async chargeFileCsv(event: any) {
    if (event) {
      const file = event.target.files[0];
      let readFile = await this.arrayTxt(file);
      this.readFileArrayCsv = readFile;
      this.validCsv = true;
      console.log(this.readFileArrayCsv);
    }
  }

  formatTableCsv() {
    let body: any = {};
    if (this.readFileArrayCsv) {
      for (let i = 0; i < this.readFileArrayCsv.length; i++) {
        for (let r = 0; r < 2; r++) {
          if (
            isNaN(parseInt(this.readFileArrayCsv[i][0])) &&
            isNaN(parseInt(this.readFileArrayCsv[i][1]))
          ) {
            console.log('Deben ser Numeros enteros');
            break;
          }
          body = {
            goodNumber: this.readFileArrayCsv[i][0],
            fileNumber: this.readFileArrayCsv[i][1],
          };
        }
        this.tableCsv.push(body);
      }
      console.log(this.tableCsv);
      /*this.loading = true;
      this.paramsXls
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getTableXls(this.tableXls));*/
    }
  }
  //this.validCsv = true;

  async chargeFileXls(event: any) {
    if (event) {
      const file = event.target.files[0];
      let readFile = await this.arrayTxt(file);
      this.readFileArrayXls = readFile;
      console.log(readFile);
      this.validXls = true;
    }
  }

  formatTableXls() {
    let value = 0;
    //this.validXls = true;
    let body: any = {};
    if (this.readFileArrayXls) {
      for (let i = 0; i < this.readFileArrayXls.length; i++) {
        for (let r = 0; r < 2; r++) {
          body = {
            goodNumber: this.readFileArrayXls[i][0],
            fileNumber: this.readFileArrayXls[i][1],
          };
        }
        this.tableXls.push(body);
      }
      console.log(this.tableXls, this.readFileArrayXls);
      this.loading = true;
      this.paramsXls
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getTableXls(this.tableXls));
    }
  }

  getTableXls(array: any) {
    if (array) {
      this.dataTable2.load(array);
      this.dataTable2.refresh();
      this.totalItems = this.tableXls.length;
      this.loading = false;
    }
  }

  async arrayTxt(file: any) {
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          this.records = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          //console.log(this.records);
          console.log(this.records);
          resolve(this.records);
        };
        reader.readAsArrayBuffer(file);
      } else {
        resolve(null);
      }
    });
  }

  // btnImprimeRelacionExpediente() {
  //   if (
  //     !this.form.get('id').value &&
  //     !this.form.get('typeDict').value &&
  //     !this.form.get('passOfficeArmy')
  //   ) {
  //     this.alert('info', 'Se debe ingresar un dictamen', '');
  //     return;
  //   }

  //   let params = {
  //     CLAVE_ARMADA: this.form.controls['passOfficeArmy'].value,
  //     TIPO_DIC: this.form.controls['typeDict'].value,
  //     TIPO_VOL: this.wheelType,
  //   };

  //   this.siabService
  //     .fetchReport('RGENREPDICTAMASEXP', params)
  //     .subscribe(response => {
  //       if (response !== null) {
  //         console.log(response);
  //         if (response.body === null || response.code === 500) {
  //           this.alert('error', 'No existe el reporte', '');
  //           return;
  //         }

  //         const blob = new Blob([response], { type: 'application/pdf' });
  //         const url = URL.createObjectURL(blob);
  //         let config = {
  //           initialState: {
  //             documento: {
  //               urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
  //               type: 'pdf',
  //             },
  //             callback: (data: any) => {},
  //           },
  //           class: 'modal-lg modal-dialog-centered',
  //           ignoreBackdropClick: true,
  //         };
  //         this.modalService.show(PreviewDocumentsComponent, config);
  //       }
  //     });
  // }
}
