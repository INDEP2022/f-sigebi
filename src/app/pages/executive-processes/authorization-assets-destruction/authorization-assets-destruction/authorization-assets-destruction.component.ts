import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ASSETS_DESTRUCTION_COLUMLNS } from './authorization-assets-destruction-columns';
//XLSX
import { DatePipe } from '@angular/common';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
//Models
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import {
  IGoodsExpedient,
  IGoodTracker,
} from 'src/app/core/models/catalogs/package.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import {
  IDetailProceedingsDevollutionDelete,
  ITmpCreateAuthoDestroy,
  ITmpUpdateMassive,
  ITmpUpdateOneReg,
} from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { ListKeyProceedingsComponent } from '../list-key-proceedings/list-key-proceedings.component';
import { ModalCorreoComponent } from '../utils/modal-correo/modal-correo.component';

interface Blk {
  descripcion: string;
  email: string;
  numeroDelegacion: number;
  nombre: string;
  usuario: string;
  procesar: string;
}

@Component({
  selector: 'app-authorization-assets-destruction',
  templateUrl: './authorization-assets-destruction.component.html',
  styleUrls: ['./authorization-assets-destruction.scss'],
})
export class AuthorizationAssetsDestructionComponent
  extends BasePage
  implements OnInit
{
  //form = new FormGroup(new AuthorizationAssetsDestructionForm());

  form: FormGroup = new FormGroup({});
  show = false;
  ExcelData: any;
  table: boolean = false;
  idExpedient: string | number = null;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  expedient: IExpedient;
  data: LocalDataSource = new LocalDataSource();
  selectExpedient = new DefaultSelect<IExpedient>();
  rowSelected: boolean = false;
  selectedRow: any = null;
  title: string = 'Oficios de autorización de destrucción';
  textButton: string = 'Cerrar';
  expediente: number;
  textDisabled: boolean = true;
  acta: IProceedingDeliveryReception = null;
  dataFile: any[];
  consult: boolean = false;

  goodsList: IGood[] = [];

  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';

  numberAct = new DefaultSelect();

  //AGREGADO POR GRIGORK
  idProceeding: number = null;
  numFile: number = null;
  addGoodFlag: boolean = false;
  canSearch: boolean = true;
  cve_proceeding: string = null;
  date_proceeding: string = null;
  statusProceeding: string = null;
  canNewProceeding: boolean = false;
  returnTracker: boolean = true;
  user: string = null;

  get controls() {
    return this.form.controls;
  }
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe,
    private expedientService: ExpedientService,
    private globalVarService: GlobalVarsService,
    private goodService: GoodService,
    private modalService: BsModalService,
    private proceedingsDetailDel: ProceedingsDeliveryReceptionService,
    private proceedingService: ProceedingsService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private serviceDetailProc: DetailProceeDelRecService,
    private serviceDocuments: DocumentsService,
    private serviceMassiveGoods: MassiveGoodService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private documentService: DocumentsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...ASSETS_DESTRUCTION_COLUMLNS,
        approved: {
          title: 'Aprobado',
          type: 'custom',
          showAlways: true,
          filter: false,
          sort: false,
          renderComponent: CheckboxElementComponent,
          valuePrepareFunction: (isSelected: any, row: any) => {
            return row.approved == 'SI' ? true : false;
          },
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectRow(instance),
        },
      },
      mode: '',
      rowClassFunction: (row: { data: { available: any } }) =>
        row.data.available == 'S'
          ? 'bg-success text-white'
          : 'bg-dark text-white',
    };
  }

  ngOnInit(): void {
    this.prepareForm();

    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          const ngGlobal = global;
          if (ngGlobal.REL_BIENES) {
            console.log(ngGlobal.REL_BIENES);
            if (this.returnTracker) {
              this.form
                .get('noAuth')
                .setValue(
                  localStorage.getItem('noActa_FACTDIRAPROBDESTR') != 'null'
                    ? localStorage.getItem('noActa_FACTDIRAPROBDESTR')
                    : null
                );
              this.form
                .get('authNotice')
                .setValue(
                  localStorage.getItem('authNotice_FACTDIRAPROBDESTR') != 'null'
                    ? localStorage.getItem('authNotice_FACTDIRAPROBDESTR')
                    : null
                );

              this.cve_proceeding =
                localStorage.getItem('authNotice_FACTDIRAPROBDESTR') != 'null'
                  ? localStorage.getItem('authNotice_FACTDIRAPROBDESTR')
                  : null;
              this.form
                .get('universalFolio')
                .setValue(
                  localStorage.getItem('universalFolio_FACTDIRAPROBDESTR') !=
                    'null'
                    ? localStorage.getItem('universalFolio_FACTDIRAPROBDESTR')
                    : null
                );
              this.form
                .get('statusAct')
                .setValue(
                  localStorage.getItem('statusAct_FACTDIRAPROBDESTR') != 'null'
                    ? localStorage.getItem('statusAct_FACTDIRAPROBDESTR')
                    : null
                );
              this.form
                .get('fromDate')
                .setValue(
                  localStorage.getItem('fromDate_FACTDIRAPROBDESTR') != 'null'
                    ? this.correctDate(
                        localStorage.getItem('fromDate_FACTDIRAPROBDESTR')
                      )
                    : null
                );

              this.date_proceeding =
                localStorage.getItem('fromDate_FACTDIRAPROBDESTR') != 'null'
                  ? this.correctDate(
                      localStorage.getItem('fromDate_FACTDIRAPROBDESTR')
                    ).toString()
                  : null;
              this.expediente =
                localStorage.getItem('numFile_FACTDIRAPROBDESTR') != 'nul'
                  ? Number(localStorage.getItem('numFile_FACTDIRAPROBDESTR'))
                  : null;

              localStorage.removeItem('noActa_FACTDIRAPROBDESTR');
              localStorage.removeItem('authNotice_FACTDIRAPROBDESTR');
              localStorage.removeItem('universalFolio_FACTDIRAPROBDESTR');
              localStorage.removeItem('fromDate_FACTDIRAPROBDESTR');
              localStorage.removeItem('numFile_FACTDIRAPROBDESTR');
              localStorage.removeItem('statusAct_FACTDIRAPROBDESTR');

              this.returnTracker = false;
              this.pupGoodTrackerFn(ngGlobal.REL_BIENES);
            }
          }
        },
      });

    //AGREGADO POR GRIGORK
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(result => {
      console.log(result);
      if (this.consult) {
        this.fillTableGoodsByUser();
      }
    });

    if (localStorage.getItem('noAuth_scan')) {
      this.form.get('noAuth').setValue(localStorage.getItem('noAuth_scan'));
      this.getProceeding();
      localStorage.removeItem('noAuth_scan');
    }
    this.user = this.authService.decodeToken().preferred_username;
  }

  private prepareForm() {
    this.form = this.fb.group({
      idExpedient: [null, [Validators.required]],
      preliminaryInquiry: [null, [Validators.pattern(STRING_PATTERN)]],
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      circumstantialRecord: [null, [Validators.pattern(STRING_PATTERN)]],
      keyPenalty: [null, [Validators.pattern(STRING_PATTERN)]],
      noAuth: [null, [Validators.pattern(STRING_PATTERN)]],
      universalFolio: [null, [Validators.pattern(STRING_PATTERN)]],
      statusAct: [null, [Validators.pattern(STRING_PATTERN)]],
      act: [null, [Validators.pattern(STRING_PATTERN)]],
      authNotice: [null, [Validators.pattern(STRING_PATTERN)]],
      fromDate: [null, [Validators.pattern(STRING_PATTERN)]],
      scanFolio: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      cancelSheet: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
    });
    this.form.get('preliminaryInquiry').disable();
    this.form.get('criminalCase').disable();
    this.form.get('circumstantialRecord').disable();
    this.form.get('keyPenalty').disable();
    /* this.form.get('noAuth').disable(); */
    // this.form.get('authNotice').disable();
    // this.form.get('fromDate').disable();

    const localExpdeient = localStorage.getItem('expediente');
    console.log(localExpdeient);
    const folio = localStorage.getItem('folio');
    if (localExpdeient !== null) {
      this.expediente = Number(localExpdeient);
      if (folio) {
        this.form.controls['universalFolio'].setValue(folio);
      }
      // this.form.get('idExpedient').setValue(Number(localExpdeient));
      // this.expedientChange();
      localStorage.removeItem('expediente');
    }
  }

  //FUNCION PARA ACTUALIZAR EL APROBADO DEL TMP
  onSelectRow(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        console.log(data.row);
        if (
          !['CERRADO', 'CERRADA'].includes(this.form.get('statusAct').value)
        ) {
          const modelEdit: ITmpUpdateOneReg = {
            user: this.user,
            good: data.row.numberGood,
            approved: data.toggle ? 'SI' : 'NO',
          };
          this.proceedingService.tmpUpdateOneReg(modelEdit).subscribe(
            res => {
              data.row = data.toggle ? 'SI' : 'NO';
            },
            err => {
              console.log(err);
            }
          );
        } else {
          this.data.load(this.data['data']);
        }
      },
    });
  }

  async openModal() {
    let config: ModalOptions = {
      initialState: {
        proceeding: this.form.get('noAuth').value,
        expedient: this.expediente,
        universalFolio: this.form.get('universalFolio').value,
        proceedingKey: this.form.get('authNotice').value,
        elaborationDate: this.form.get('fromDate').value,
        detalleActa: await this.data.getAll(),
        callback: async result => {
          if (result) {
            this.getProceeding();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalCorreoComponent, config);
  }

  getDocuments() {
    return new Promise((resolve, _rej) => {
      this.documentService
        .getByFolio(this.form.get('universalFolio').value)
        .subscribe(res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];
          console.log(scanStatus);
          if (scanStatus == 'ESCANEADO') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  getDetailProceedingsDevolution(number: number, expedient: boolean = false) {
    this.loading = true;
    let params: any = {
      ...this.params.getValue(),
      //...this.columnFilters2,
    };
    if (expedient) params['filter.good.fileNumber'] = `$eq:${number}`;
    if (!expedient) params['filter.numberProceedings'] = `$eq:${number}`;
    this.proceedingService.getDetailProceedingsDevolution(params).subscribe({
      next: async response => {
        console.log(response);
        const data = await this.postQuery(response.data);

        this.data.load(data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
        console.log(error);
      },
    });
  }

  async closeButton() {
    if (!['CERRADA', 'CERRADO'].includes(this.form.get('statusAct').value)) {
      this.closed();
    } else {
      this.openProceeding();
    }
  }

  async closed() {
    if (this.form.get('fromDate').value === null) {
      this.alert(
        'warning',
        this.title,
        'Debe ingresar la fecha de autorización.',
        ''
      );
      return;
    }
    if (this.form.get('authNotice').value === null) {
      this.alert(
        'warning',
        this.title,
        'Debe ingresar el oficio de autorización.',
        ''
      );
      return;
    }

    if (this.form.get('universalFolio').value === null) {
      this.alert(
        'warning',
        this.title,
        'El oficio no tiene folio de escaneo, no se puede cerrar.',
        ''
      );
      return;
    }
    const isScan = await this.getDocuments();
    console.log(isScan);
    if (!isScan) {
      this.alert(
        'warning',
        this.title,
        'El oficio no tiene documentos escaneados, no se puede cerrar.',
        ''
      );
      return;
    }

    if (this.data.count() == 0) {
      this.alert(
        'warning',
        this.title,
        'El oficio no tiene ningun bien asignado, no se puede cerrar.',
        ''
      );
      return;
    }

    this.dataPurge();
    this.openModal();
  }

  openProceeding() {
    //!ENVIAR CORREO
  }

  cleanTmp() {
    const proceeding = '-1';
    const paramsF = new FilterParams();
    this.proceedingService
      .tmpAuthorizationsDestruction(this.user, proceeding, paramsF.getParams())
      .subscribe(
        res => {
          this.canNewProceeding = true;
          this.data.load([]);
        },
        err => {
          if (err.status != 400) {
            this.alert(
              'warning',
              'Hubo un problema limpiando la tabla temporal',
              ''
            );
          }
        }
      );
  }

  pupDepuraDetalle(model: IDetailProceedingsDevollutionDelete) {
    return new Promise((resolve, _reject) => {
      this.proceedingService
        .deleteDetailProceedingsDevolution(model)
        .subscribe({
          next: (resp: any) => {
            resolve(true);
          },
          error: (err: any) => {
            resolve(false);
          },
        });
    });
  }

  addGood() {
    if (!['CERRADA', 'CERRADO'].includes(this.acta.statusProceedings)) {
      if (this.expediente) {
        this.getDetailProceedingsDevolution(this.expediente, true);
      } else {
        this.pupBienesrastreador();
      }
    }
  }

  pupBienesrastreador() {
    this.alert('warning', this.title, 'Llamando a rastreador');
  }

  clean() {
    this.form.reset();
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    this.canSearch = true;
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.consult = false;
    this.form.get('noAuth').enable();
    this.form.get('authNotice').enable();
    this.form.get('fromDate').enable();
    this.canNewProceeding = false;

    localStorage.removeItem('noActa_FACTDIRAPROBDESTR');
    localStorage.removeItem('authNotice_FACTDIRAPROBDESTR');
    localStorage.removeItem('universalFolio_FACTDIRAPROBDESTR');
    localStorage.removeItem('fromDate_FACTDIRAPROBDESTR');
    localStorage.removeItem('numFile_FACTDIRAPROBDESTR');
    localStorage.removeItem('statusAct_FACTDIRAPROBDESTR');
  }

  async postQuery(det: any[]) {
    return await Promise.all(
      det.map(async (item: any) => {
        switch (item.good.ubicationType) {
          case 'A':
            item.di_cve_ubicacion = 'ALMACEN';
            item.di_ubicacion1 = `${
              item.good.almacen ? item.good.almacen.ubication : ''
            } LOTE ${item.good.lotNumber ? item.good.lotNumber.id : ''} RACK ${
              item.good.rackNumber ?? ''
            }`;
            break;
          case 'B':
            item.di_cve_ubicacion = 'BOVEDA';
            item.di_ubicacion1 = `${
              item.good.boveda ? item.good.boveda.ubication : ''
            } GAVETA ${item.good.lotNumber ? item.good.lotNumber.id : ''}`;
            break;
          case 'D':
            item.di_cve_ubicacion = 'DEPOSITARÍA';
            break;
          default:
            item.di_ubicacion1 = 'UBICACIÓN DESCONOCIDA';
            break;
        }
        item.di_disponible = 'N';
        item.aprobado = 'SI';
        item.description = item.good.description;
        item.status = item.good.status;
        item.process = item.good.extDomProcess;
        item.physicalReceptionDate = item.good.physicalReceptionDate;
        item.fecha = item.good.observationss
          ? item.good.observationss
          : `${this.acta.keysProceedings} ${this.datePipe.transform(
              this.acta.elaborationDate,
              'dd-MM-yyyy'
            )}`;
        return item;
      })
    );
  }

  findExpedientById(expedientId: number) {
    return this.expedientService.getById(expedientId);
  }

  getExpedients(params: ListParams) {
    const _params = new FilterParams();
    _params.page = params.page;
    _params.limit = params.limit;
    _params.addFilter('id', params.text);
    this.expedientService.getAll(_params.getParams()).subscribe({
      next: response => {
        this.selectExpedient = new DefaultSelect(response.data, response.count);
        this.getExpedientById();
      },
      error: () => {
        this.selectExpedient = new DefaultSelect();
      },
    });
  }

  getExpedientById(): void {
    let _id = this.idExpedient;
    this.loading = true;
    this.expedientService.getById(_id).subscribe(
      response => {
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getGoodsByExpedient(this.idExpedient);
          console.log(response);
        } else {
          //TODO: CHECK MESSAGE
          this.alert('warning', 'No se encontraron registros', '');
        }

        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getGoodsByExpedient(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods(id));
  }

  getGoods(id: string | number): void {
    this.goodService.getByExpedient(id, this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.goodsList = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }

  msjRequest() {
    this.alertQuestion(
      'question',
      'Atención',
      '¿Desea imprimir la solicitud de digitalización?'
    ).then(question => {
      if (question.isConfirmed) {
        this.alert('success', 'Listo', 'Se ha solicitado');
      }
    });
  }

  msjScan() {
    this.alertQuestion(
      'info',
      'Atención',
      'Para escanear debe de abrir la aplicación de su preferencia'
    );
  }

  async ReadExcel(event: any) {
    if (['CERRADO', 'CERRADA'].includes(this.form.get('statusAct').value)) {
      this.alert(
        'warning',
        this.title,
        'No se puede realizar la operación, el Acta está cerrada'
      );
      return;
    }

    this.loading = true;
    const files = (event.target as HTMLInputElement).files[0];
    let formData = new FormData();
    formData.append('file', files);
    formData.append('user', this.user);
    this.getDataFile(formData);
  }

  getDataFile(data: any) {
    if (this.data.count() == 0) {
      this.cleanTmp();
    }

    this.serviceMassiveGoods.pupFlatGoodsDestr(data).subscribe({
      next: resp => {
        this.loading = false;
        this.fillTableGoodsByUser();
        console.log(resp);
      },
      error: err => {
        console.log(err);
        this.loading = true;
        this.alert('error', 'Ocurrió un error al leer el archivo', '');
      },
    });
  }

  //AGREGADO POR GRIGORK
  //BUSCAR ACTAS SEGÚN EXPEDIENTE
  getProceeding() {
    if (
      this.form.get('authNotice').value == null &&
      this.form.get('noAuth').value == null
    ) {
      this.alert(
        'warning',
        'Debe ingresar datos de búsqueda',
        'Debe registrar el número de acta u oficio de autorización'
      );
      return;
    }

    const paramsF = new FilterParams();
    // paramsF.page = params.page;
    paramsF.limit = 1;
    paramsF.addFilter('typeProceedings', 'AXD');
    this.form.get('noAuth').value != null
      ? paramsF.addFilter('id', this.form.get('noAuth').value)
      : paramsF.addFilter('keysProceedings', this.form.get('authNotice').value);
    this.proceedingsDetailDel.getByFilter(paramsF.getParams()).subscribe(
      res => {
        const jsonResp = JSON.parse(JSON.stringify(res['data'][0]));
        this.idProceeding = jsonResp.id;
        this.cve_proceeding = jsonResp.keysProceedings;
        this.date_proceeding = this.correctDate(
          jsonResp.elaborationDate
        ).toString();
        this.form.get('noAuth').setValue(this.idProceeding);
        this.form.get('authNotice').setValue(jsonResp.keysProceedings);
        this.form.get('universalFolio').setValue(jsonResp.universalFolio);
        this.form.get('statusAct').setValue(jsonResp.statusProceedings);
        this.expediente = jsonResp.numFile;
        this.form
          .get('fromDate')
          .setValue(this.correctDate(jsonResp.elaborationDate));
        this.searchGoodsInDetailProceeding();
      },
      err => {
        console.log(err);
        this.alert(
          'warning',
          'No se encontró el acta',
          'No existe un acta con el dato ingresado'
        );
      }
    );
  }

  newProceeding() {
    this.canNewProceeding = true;
    console.log(this.data.count());
    console.log(this.form.get('noAuth').value);
    console.log(this.form.get('statusAct').value);
    if (
      (this.data.count() != 0 && this.form.get('noAuth').value != null) ||
      this.form.get('statusAct').value != null
    ) {
      this.cleanTmp();
      this.data.load([]);
    }

    this.form.get('noAuth').reset();
    this.form.get('authNotice').reset();
    this.form.get('fromDate').reset();
    this.form.get('statusAct').reset();
  }

  async saveNewProceeding() {
    if (this.form.get('authNotice').value == null) {
      this.alert(
        'warning',
        'Debe ingresar un oficio de autorización',
        'Debe registrar un oficio de autorización para crear un nuevo acta'
      );
      return;
    }

    const proceeding = await this.existProceeding();
    if (proceeding) {
      this.alert(
        'warning',
        'Ya existe un acta con el oficio de autorización',
        ''
      );
      return;
    }

    if (this.form.get('fromDate').value == null) {
      this.alert('warning', 'Debe especificar la fecha', '');
      return;
    }

    if (this.numFile == null) {
      this.alert(
        'warning',
        'No existe un número de expediente',
        'Debe insertar un número de expediente'
      );
      return;
    }

    const body: IProccedingsDeliveryReception = {
      keysProceedings: this.form.get('authNotice').value,
      elaborationDate: this.form.get('fromDate').value,
      statusProceedings: 'ABIERTA',
      elaborate: this.user,
      typeProceedings: 'AXD',
      numFile: this.numFile,
      numDelegation1: this.authService.decodeToken().department,
      numDelegation2: this.authService.decodeToken().department,
      captureDate: new Date().getTime(),
    };

    this.serviceProcVal.postProceeding(body).subscribe(
      res => {
        this.alert('success', 'Acta creada', '');
        console.log(res);
        const resJson = JSON.parse(JSON.stringify(res));
        this.form.get('noAuth').setValue(resJson.id);
        this.form.get('noAuth').disable();
        this.form.get('authNotice').disable();
        this.form.get('fromDate').disable();
        this.canNewProceeding = false;

        const body: ITmpCreateAuthoDestroy = {
          user: this.user,
          proceeding: resJson.id,
        };

        this.proceedingService.tmpCreateAuthorization(body).subscribe(
          res => {
            console.log(res);
            this.getProceeding();
          },
          err => {
            this.alert('error', 'Error al crear acta', '');
            console.log(err);
          }
        );
      },
      err => {
        this.alert('error', 'Error al crear acta', '');
        console.log(err);
      }
    );
  }

  async existProceeding() {
    return new Promise((resolve, _reject) => {
      const paramsF = new FilterParams();
      paramsF.addFilter('typeProceedings', 'AXD');
      paramsF.addFilter('keysProceedings', this.form.get('authNotice').value);
      this.proceedingsDetailDel.getByFilter(paramsF.getParams()).subscribe(
        res => {
          resolve(true);
        },
        err => {
          resolve(false);
        }
      );
    });
  }

  //FUNCIÓN PARA OBTENER LA FECHA CORRECTA
  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  //BUSCAR BIENES EN DETALLE_ACTA_ENT_RECEP
  searchGoodsInDetailProceeding() {
    this.canSearch = false;
    this.loading = true;
    const paramsF = new FilterParams();
    const proceeding = this.idProceeding.toString();
    paramsF.page = this.params.getValue().page;
    paramsF.limit = this.params.getValue().limit;
    this.proceedingService
      .tmpAuthorizationsDestruction(this.user, proceeding, paramsF.getParams())
      .subscribe(
        res => {
          const newData = res.data.map((item: any) => {
            return {
              ...item,
              cve_proceeding:
                item.available == 'N' ? this.cve_proceeding : null,
              date_proceeding:
                item.available == 'N'
                  ? format(this.correctDate(this.date_proceeding), 'dd/MM/yyyy')
                  : null,
            };
          });

          if (this.numFile == null) {
            this.numFile = res.data[0].expedient;
          }

          this.data.load(newData);
          this.totalItems = res.count;
          this.loading = false;
          this.consult = true;
        },
        err => {
          this.data.load([]);
          console.log(err);
          this.canSearch = true;
          this.loading = false;
        }
      );
  }

  //BOTON AGREGAR BIENES
  buttonAddGoods() {
    this.addGoodFlag = true;
    if (['CERRADO', 'CERRADA'].includes(this.form.get('statusAct').value)) {
      this.alert('warning', 'El acta se encuentra cerrada', '');
      this.addGoodFlag = false;
      return;
    }

    if (this.form.get('idExpedient').value != null) {
      this.expedientChange();
      console.log('');
    } else {
      this.pupGoodTracker();
    }
  }

  //LLENAR LA TABLA DE BIENES POR USUARIO
  fillTableGoodsByUser() {
    this.form.get('noAuth').value != null ? (this.canSearch = false) : null;
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.page = this.params.getValue().page;
    paramsF.limit = this.params.getValue().limit;
    this.proceedingService
      .tmpAuthorizationsDestruction(this.user, null, paramsF.getParams())
      .subscribe(
        res => {
          const newData = res.data.map((item: any) => {
            return {
              ...item,
              cve_proceeding:
                item.available == 'N' ? this.cve_proceeding : null,
              date_proceeding:
                item.available == 'N'
                  ? format(this.correctDate(this.date_proceeding), 'dd/MM/yyyy')
                  : null,
            };
          });

          if (this.numFile == null) {
            this.numFile = res.data[0].expedient;
          }

          console.log(newData);
          this.data.load(newData);
          this.totalItems = res.count;
          this.loading = false;
          this.consult = true;
        },
        err => {
          this.data.load([]);
          console.log(err);
          this.alert('warning', 'No se encontrarón registros', '');
          this.canSearch = true;
          this.loading = false;
        }
      );
  }

  //BUSCAR EXPEDIENTE
  expedientChange() {
    if (this.data.count() == 0) {
      this.cleanTmp();
    }

    this.consult = true;
    this.expediente = Number(this.form.get('idExpedient').value);
    const params: ListParams = {};
    params['filter.id'] = `$eq:${this.expediente}`;
    this.expedientService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.form.patchValue(resp.data[0]);
        this.pupGoodsExp();
      },
      error: err => {
        this.alert('warning', this.title, 'No se encontró el expediente');
        this.addGoodFlag = false;
      },
    });
  }

  pupGoodsExp() {
    const body: IGoodsExpedient = {
      proceedingsNumber: this.form.get('idExpedient').value,
      minutesNumber: this.idProceeding,
      user: this.authService.decodeToken().preferred_username,
    };

    this.serviceMassiveGoods.goodsExpedient(body).subscribe(
      async res => {
        console.log(res);
        console.log(res.file);
        this.addGoodFlag = false;

        if (res.rechazados > 0) {
          await this.downloadExcel(res.file, 'Bienes_con_errores.csv');
        }

        if (res.blk_det.length == 0) {
          this.alert('warning', 'No se cargo ninguno bien', '');
        } else {
          this.alert('success', `Se cargaron ${res.blk_det.length} bienes`, '');
          this.fillTableGoodsByUser();
        }
      },
      err => {
        console.log(err);
        this.addGoodFlag = false;
        this.alert('error', 'No se agregaron los bienes del expediente', '');
      }
    );
  }

  async downloadExcel(base64String: any, nameFile: string) {
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const link = document.createElement('a');
    link.href = mediaType + base64String;
    link.download = nameFile;
    link.click();
    link.remove();
  }

  pupGoodTracker() {
    console.log(this.data);
    console.log(this.data.count());
    if (this.data.count() == 0) {
      this.cleanTmp();
    }

    localStorage.setItem(
      'noActa_FACTDIRAPROBDESTR',
      this.form.get('noAuth').value
    );
    localStorage.setItem(
      'authNotice_FACTDIRAPROBDESTR',
      this.form.get('authNotice').value
    );
    localStorage.setItem(
      'universalFolio_FACTDIRAPROBDESTR',
      this.form.get('universalFolio').value
    );
    localStorage.setItem(
      'statusAct_FACTDIRAPROBDESTR',
      this.form.get('statusAct').value
    );
    localStorage.setItem(
      'fromDate_FACTDIRAPROBDESTR',
      this.form.get('fromDate').value
    );
    localStorage.setItem(
      'numFile_FACTDIRAPROBDESTR',
      this.expediente != null ? this.expediente.toString() : null
    );

    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FACTDIRAPROBDESTR',
      },
    });
  }

  pupGoodTrackerFn(globalRelGood: number) {
    let body: IGoodTracker;
    console.log(localStorage.getItem('noActa_FACTDIRAPROBDESTR'));
    !['null', null].includes(localStorage.getItem('noActa_FACTDIRAPROBDESTR'))
      ? (body = {
          minutesNumber: localStorage.getItem('noActa_FACTDIRAPROBDESTR'),
          globalRelGood: globalRelGood,
          user: this.authService.decodeToken().preferred_username,
        })
      : (body = {
          minutesNumber: null,
          globalRelGood: globalRelGood,
          user: this.authService.decodeToken().preferred_username,
        });

    this.serviceMassiveGoods.pupGoodTracker(body).subscribe(
      res => {
        console.log(res);
        this.downloadExcel(res.file, 'Bienes_con_errores.csv');
        localStorage.removeItem('noActa_FACTDIRAPROBDESTR');
        this.fillTableGoodsByUser();
      },
      err => {
        console.log(err);
      }
    );
  }

  //MASIVO
  masiveChange() {
    if (this.data.count() == 0) {
      this.alert('warning', 'No existen bienes para realizar el cambio', '');
      return;
    }

    const body: ITmpUpdateMassive = {
      user: this.authService.decodeToken().preferred_username,
      proceedingKey: this.form.get('noAuth').value,
      date: this.form.get('fromDate').value,
    };

    this.proceedingService.tmpUpdateMassive(body).subscribe(
      res => {
        console.log(res);
        this.fillTableGoodsByUser();
      },
      err => {
        console.log(err);
      }
    );
  }

  //DEPURAR
  dataPurge() {
    this.loading = true;
    this.serviceMassiveGoods.tmpDeleteAuthorization(this.user).subscribe(
      res => {
        console.log(res);
        this.alert(
          'success',
          `Se depuró el acta ${this.form.get('noAuth').value}`,
          ''
        );
        this.fillTableGoodsByUser();
      },
      err => {
        console.log(err);
        this.alert(
          'warning',
          'Se presentó un error depurando el acta',
          'Por favor vuelva a intentarlo'
        );
        this.loading = false;
      }
    );
  }

  dataPurgeButton() {
    if (['CERRADA', 'CERRADO'].includes(this.form.get('statusAct').value)) {
      this.alert(
        'warning',
        'El acta está cerrada',
        'No puede realizar modificaciones por el estatus del acta'
      );
      return;
    }

    this.alertQuestion(
      'question',
      `¿Desea depurar el acta ${this.form.get('noAuth').value}?`,
      'Se eliminarán todos los bienes que no estén aprobados'
    ).then(q => {
      if (q.isConfirmed) {
        this.dataPurge();
      }
    });
  }

  //GUARDADO DE SAVE
  massiveSave() {
    const body: ITmpCreateAuthoDestroy = {
      user: this.user,
      proceeding: this.form.get('noAuth').value,
    };

    this.proceedingService.tmpCreateAuthorization(body).subscribe(
      res => {
        console.log(res);
        this.getProceeding();
      },
      err => {
        this.alert('error', 'Error al crear acta', '');
        console.log(err);
      }
    );
  }

  selectRowTry(e: any) {
    console.log(e.data);
  }

  openListProceedings() {
    let config: ModalOptions = {
      initialState: {
        callback: (result: any) => {
          console.log(result);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };

    this.modalService.show(ListKeyProceedingsComponent, config);
  }
}
