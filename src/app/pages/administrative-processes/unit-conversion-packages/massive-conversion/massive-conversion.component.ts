import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, map, of, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { MassiveConversionPermissionsComponent } from '../massive-conversion-permissions/massive-conversion-permissions.component';
import { COLUMNS } from './columns';

import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import * as FileSaver from 'file-saver';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IpackageValidGood } from 'src/app/core/models/catalogs/Ipackage-valid-good';
import {
  IFoliovInvoice,
  IPackage,
  IPackageInfo,
} from 'src/app/core/models/catalogs/package.model';
import { IPerUser } from 'src/app/core/models/expedient/expedient.model';
import { ISecondIfMC } from 'src/app/core/models/ms-good/good';
import { IPackageGoodEnc } from 'src/app/core/models/ms-package-good/package-good-enc';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { firstFormatDate } from 'src/app/shared/utils/date';
import { EmailModalComponent } from '../massive-conversion-email-modal/email-modal.component';
import { MassiveConversionErrorsModalComponent } from '../massive-conversion-erros-list/massive-conversion-errors-modal/massive-conversion-errors-modal.component';
import { MassiveConversionModalGoodComponent } from '../massive-conversion-modal-good/massive-conversion-modal-good.component';
import { MassiveConversionSelectGoodComponent } from '../massive-conversion-select-good/massive-conversion-select-good.component';
import { UnitConversionPackagesDataService } from '../services/unit-conversion-packages-data.service';

interface ValidaButton {
  PB_VALIDA: boolean;
  PB_AUTORIZA: boolean;
  PB_CERRAR: boolean;
  PB_CANCELA: boolean;
  PB_PERMISOS: boolean;
}

interface GeneralPermissions {
  Proyecto: boolean;
  Validar: boolean;
  Autorizar: boolean;
  Cerrar: boolean;
  Cancelar: boolean;
}

interface DataUser {
  delegation: string;
  desDelegation: string;
}

@Component({
  selector: 'app-massive-conversion',
  templateUrl: './massive-conversion.component.html',
  styles: [],
})
export class MassiveConversionComponent extends BasePage implements OnInit {
  //Data para busqueda
  dataDelegation = new DefaultSelect();
  dataGoodClass = new DefaultSelect();
  dataTransferent = new DefaultSelect();
  dataWarehouse = new DefaultSelect();
  dataUnit = new DefaultSelect();
  dataTag = new DefaultSelect();
  dataGoodStatus = new DefaultSelect();

  loadingNewBtn = false;

  modalRef: BsModalRef;
  loadingText: string = '';
  widthErrors = false;
  validaButton: ValidaButton = {
    PB_VALIDA: false,
    PB_AUTORIZA: false,
    PB_CERRAR: false,
    PB_CANCELA: false,
    PB_PERMISOS: false,
  };
  generalPermissions: GeneralPermissions = {
    Proyecto: false,
    Validar: false,
    Autorizar: false,
    Cerrar: false,
    Cancelar: false,
  };
  dataUser: DataUser = {
    delegation: '',
    desDelegation: '',
  };

  descData: {
    descDelegation: string;
  };
  descPaq = {
    // descDelegation: '',
    descTargetTag: '',
    // descTransferent: '',
    warehouseDesc: '',
    descgoodClassification: '',
  };

  goodErrors: any[] = [];
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});
  dates = {
    elaborationDate: '',
    validationDate: '',
    authorizationDate: '',
    closingDate: '',
    cancellationDate: '',
  };

  users = {
    elaborationUSU: '',
    validationUSU: '',
    authorizationUSU: '',
    closingUSU: '',
    applicationUSU: '',
    cancellationUSU: '',
  };
  totalItems: number = 0;
  columnFilters: any = [];
  generateFo = true;
  packageNumber: string = '';
  chValidateGood = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  goodsList: any;
  VALIDA_VAL24: string;
  V_EMAIL: string = null;
  //VARIABLES PARA PAQUETES
  P_ASUNTO: string;
  P_MENSAJE: string;
  dataPackage = new DefaultSelect();
  statusPackage = new DefaultSelect([
    { name: 'Proyecto', value: 'P' },
    { name: 'Validado', value: 'V' },
    { name: 'Autorizado', value: 'A' },
    { name: 'Cerrado', value: 'C' },
    { name: 'Aplicado', value: 'L' },
    { name: 'Cancelado', value: 'X' },
  ]);
  //VARIABLES DE DATA QUE SE RECIBE
  dataArrive: any[];
  //Variables de folio de escaneo
  scanFolioString: string = 'scanFolio';
  contador = 0;
  //Descripciones
  descGoodClass: string;
  descLabel: string;
  descWarehouse: string;

  newDataFilled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private router: Router,
    private serviceUser: UsersService,
    private lotService: LotService,
    private goodService: GoodService,
    private sanitizer: DomSanitizer,
    private goodProcessService: GoodprocessService,
    private massiveGoodService: MassiveGoodService,
    private siabService: SiabService,
    //Nuevos servicios
    private securityService: SecurityService,
    private dynamicCatalogService: DynamicCatalogService,
    private transferCatalogService: TransferenteService,
    private rNomenclaService: ParametersService,
    private userService: UsersService,
    private packageGoodService: PackageGoodService,
    private delegationService: DelegationService,
    private unitConversionDataService: UnitConversionPackagesDataService,
    private serviceDocuments: DocumentsService,
    private authService: AuthService,
    //Para las descripciones
    private goodSssubtypeService: GoodSssubtypeService,
    private tagService: LabelOkeyService,
    private warehouseService: WarehouseService,
    private unitMessureService: StrategyServiceService
  ) {
    super();

    //Tabla de PREVISUALIZACIÓN DE DATOS
    this.settings = {
      ...this.settings,
      rowClassFunction: (row: { data: { available: any } }) =>
        row.data.available ? 'bg-dark text-white' : 'bg-success text-white',
      actions: { add: false, delete: false, edit: false },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getGoods());
    this.checkPer();
    this.fillDataByPackage();
    this.getDataUser();
    this.getEmail();
    this.initByLocalStorage();
    //Descripciones
    this.getGoodClassDescriptions();
    this.getWarehouseDescription();
    this.getTagDescription();
    //Busquéda de datos del bien Padre
    this.searchFatherGood();
    //Cargar Catalogos
    this.initCatalogs();
  }

  searchFatherGood() {
    this.numberGoodFather.valueChanges.subscribe(res => {
      console.log(res);
      this.goodService.getByIdv3(res).subscribe(
        res => {
          console.log(res);
          this.form2.get('record').setValue(res.fileNumber);
          this.form2.get('description').setValue(res.description);
          this.form2.get('amount').setValue(res.quantity);
          this.form2.get('unitGood').setValue(res.unit);
          this.form2.get('statusGood').setValue(res.status);
        },
        err => {
          console.log(err);
        }
      );
    });

  }

  initByLocalStorage() {
    if (localStorage.getItem('noPackage')) {
      this.loading = true;
      this.researchNoPackage(localStorage.getItem('noPackage'));
      localStorage.removeItem('noPackage');
    }
    // this.packageType.valueChanges.pipe(takeUntil(this.$unSubscribe)).subscribe({
    //   next: response => {
    //     if (this.cvePackage.value) {
    //       if (this.contador > 0) {
    //         if (response === 3) {
    //           this.amountKg.setValue(1);
    //           this.statusGood.setValue('ROP');
    //           this.unit.setValue('UNIDAD');
    //           this.amountKg.disable({ onlySelf: true, emitEvent: false });
    //           this.unit.disable({ onlySelf: true, emitEvent: false });
    //           this.statusGood.disable({ onlySelf: true, emitEvent: false });
    //         } else {
    //           this.statusGood.setValue('');
    //           this.amountKg.enable({ onlySelf: true, emitEvent: false });
    //           this.unit.enable({ onlySelf: true, emitEvent: false });
    //           this.statusGood.enable({ onlySelf: true, emitEvent: false });
    //           this.validateButtons(this.status.value);
    //         }
    //       } else {
    //         this.contador++;
    //       }
    //     }
    //   },
    // });
  }

  private getEmail() {
    const filter = new FilterParams();
    filter.addFilter('user', localStorage.getItem('username'));
    this.securityService
      .getAllUsersTracker(filter.getParams())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response && response.data) {
            this.V_EMAIL = response.data[0].mail;
          } else {
            this.V_EMAIL = null;
          }
        },
        error: err => {
          this.V_EMAIL = null;
        },
      });
  }

  //Gets del formulario de paquete
  //Primera parte
  get noPackage() {
    return this.form.get('noPackage');
  }

  get cvePackage() {
    return this.form.get('cvePackage');
  }

  get descriptionPackage() {
    return this.form.get('descriptionPackage');
  }

  get packageType() {
    return this.form.get('packageType');
  }

  get amountKg() {
    return this.form.get('amountKg');
  }

  get status() {
    return this.form.get('status');
  }
  //Segunda parte
  get fecElab() {
    return this.form.get('fecElab');
  }

  get userElab() {
    return this.form.get('userElab');
  }

  get fecValida() {
    return this.form.get('fecValida');
  }

  get userValida() {
    return this.form.get('userValida');
  }

  get fecAutoriza() {
    return this.form.get('fecAutoriza');
  }

  get userAutoriza() {
    return this.form.get('userAutoriza');
  }

  get fecCerrado() {
    return this.form.get('fecCerrado');
  }

  get userCerrado() {
    return this.form.get('userCerrado');
  }

  get fecCancelado() {
    return this.form.get('fecCancelado');
  }

  get userCancelado() {
    return this.form.get('userCancelado');
  }
  //Tercera parte
  get delegation() {
    return this.form.get('delegation');
  }

  get goodClassification() {
    return this.form.get('goodClassification');
  }

  get targetTag() {
    return this.form.get('targetTag');
  }

  // get measurementUnit() {
  //   return this.form.get('measurementUnit');
  // }

  get transferent() {
    return this.form.get('transferent');
  }

  get warehouse() {
    return this.form.get('warehouse');
  }
  //Parrafos
  get paragraph1() {
    return this.form.get('paragraph1');
  }

  get paragraph2() {
    return this.form.get('paragraph2');
  }

  get paragraph3() {
    return this.form.get('paragraph3');
  }

  // Form 2
  get numberGoodFather() {
    return this.form2.get('numberGoodFather');
  }

  get record() {
    return this.form2.get('record');
  }

  get goodDescription() {
    return this.form2.get('description');
  }

  get amount() {
    return this.form2.get('amount');
  }

  get measurementUnit() {
    return this.form.get('measurementUnit');
  }

  get goodStatus() {
    return this.form.get('goodStatus');
  }

  get dataPrevisualization() {
    return this.unitConversionDataService.dataPrevisualization;
  }

  get scanFolio() {
    return this.form.get('scanFolio');
  }

  set dataPrevisualization(value) {
    this.unitConversionDataService.dataPrevisualization = value;
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      //Primer form
      noPackage: [null, [Validators.required]],
      cvePackage: [null, [Validators.required]],
      descriptionPackage: [null, [Validators.required]],
      packageType: ['', [Validators.required]],
      amountKg: [null, [Validators.required]],
      status: [null, []],
      fecElab: [null],
      userElab: [null],
      fecValida: [null],
      userValida: [null],
      fecAutoriza: [null],
      userAutoriza: [null],
      fecCerrado: [null],
      userCerrado: [null],
      fecCancelado: [null],
      userCancelado: [null],
      delegation: [null, [Validators.required]],
      goodClassification: [null, [Validators.required]],
      targetTag: [null, [Validators.required]],
      goodStatus: [null, [Validators.required]],
      transferent: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],
      measurementUnit: [null, [Validators.pattern(STRING_PATTERN)]],
      //Pestaña de "ESCANEO"
      scanFolio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],

      //Pestaña de "PÁRRAFOS"
      paragraph1: [null, [Validators.required]],
      paragraph2: [null, [Validators.required]], //Párrrafo inicial
      paragraph3: [null, [Validators.required]], //Párrrafo final
    });

    //Formulario "NUEVO BIEN"
    this.form2 = this.fb.group({
      numberGoodFather: [null, [Validators.required]],
      record: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: [null, [Validators.required]],
      statusGood: [null, [Validators.required]],
      check: [false],
      unitGood: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  //Datos de usuario logueado
  getDataUser() {
    const token = this.authService.decodeToken();
    const user = token.preferred_username;
    const routeUser = `?filter.id=$eq:${user}`;
    this.userService.getAllSegUsers().subscribe(
      res => {
        const resJson = JSON.parse(JSON.stringify(res.data[0]));
        console.log(resJson.usuario.delegationNumber);
        this.dataUser.delegation = resJson.usuario.delegationNumber;
        const paramsF = new FilterParams();
        paramsF.addFilter('id', resJson.usuario.delegationNumber);
        this.delegationService.getFiltered(paramsF.getParams()).subscribe(
          res => {
            console.log(res['data'][0]);
            this.dataUser.desDelegation = res['data'][0]['description'];
          },
          err => {
            console.log(err);
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  //Descripciones
  getTagDescription() {
    this.targetTag.valueChanges.subscribe(res => {
      if (this.targetTag.value != null) {
        this.tagService.getById(this.targetTag.value.id).subscribe(
          res => {
            console.log(res);
            this.descLabel = res.description;
          },
          err => {
            this.descLabel = null;
          }
        );
      }
    });
  }

  getWarehouseDescription() {
    this.warehouse.valueChanges.subscribe(res => {
      if (this.warehouse.value != null) {
        let params = {
          text: `filter.idWarehouse=${this.warehouse.value.idWarehouse}`,
        };
        this.warehouseService.getAll(params.text).subscribe(
          res => {
            console.log(res);
            this.descWarehouse = res['data'][0].description;
          },
          err => {
            this.descLabel = null;
          }
        );
      }
    });
  }

  getGoodClassDescriptions() {
    this.goodClassification.valueChanges.subscribe(res => {
      // console.log(res, this.goodClassification.value);
      if (this.goodClassification.value != null) {
        const paramsF = new FilterParams();
        paramsF.addFilter('numClasifGoods', res.numClasifGoods);
        this.goodSssubtypeService
          .getAllSssubtype(paramsF.getParams())
          .subscribe({
            next: res => {
              console.log(res);
              if (res.data && res.data.length > 0) {
                this.descGoodClass = res.data[0].description;
              } else {
                this.descGoodClass = null;
              }
            },
            error: err => {
              this.descGoodClass = null;
            },
          });
      }
    });
  }

  //Llenar valores por el no. paquete
  fillDataByPackage() {
    this.noPackage.valueChanges.subscribe((res: IPackageGoodEnc) => {
      console.log(res.numberClassifyGood);
      console.log(res);
      if (res != null) {
        this.newDataFilled = false;
        this.contador = 0;
        //Seteo de la primera parte
        this.cvePackage.setValue(res.cvePackage);
        this.descriptionPackage.setValue(res.description);
        this.packageType.setValue(res.typePackage);
        this.amountKg.setValue(res.amount);
        this.status.setValue(res.statuspack.toString().toLocaleUpperCase());
        this.scanFolio.setValue(res.InvoiceUniversal);
        //Seteo de la segunda parte
        this.fecElab.setValue(res.dateElaboration);
        this.userElab.setValue(res.useElaboration);
        this.fecValida.setValue(res.dateValid);
        this.userValida.setValue(res.useValid);
        this.fecAutoriza.setValue(res.dateauthorize);
        this.userAutoriza.setValue(res.useauthorize);
        this.fecCerrado.setValue(res.dateClosed);
        this.userCerrado.setValue(res.useClosed);
        this.fecCancelado.setValue(res.dateCancelled);
        this.userCancelado.setValue(res.useCancelled);
        //Setep de la tercera parte
        this.getCatalogDelegation({ text: res.numberDelegation }, true);
        this.getCatalogClassGood({ text: res.numberClassifyGood }, true);
        this.getCatalogTag({ text: res.numberLabel }, true);
        this.getCatalogTransferent({ text: res.numbertrainemiaut }, true);
        this.getCatalogWareHouse({ text: res.numberStore }, true);
        //Parrafos
        this.paragraph1.setValue(res.paragraph1);
        this.paragraph2.setValue(res.paragraph2);
        this.paragraph3.setValue(res.paragraph3);

        // Form2
        this.numberGoodFather.setValue(res.numberGoodFather);
        this.record.setValue(res.numberRecord);
        // this.goodDescription.setValue(res.numberGoodFather);
        // this.amount.setValue(res.numberGoodFather);
        this.measurementUnit.setValue(res.unit);
        console.log(res.status)
        this.getCatalogGoodStatus({ text: res.status }, true);
        // this.status2.setValue(res.numberGoodFather);

        if (
          ['C', 'X', 'L', 'P', 'V', 'A'].includes(
            res.statuspack.toString().toLocaleUpperCase()
          )
        ) {
          this.form.disable({ onlySelf: true, emitEvent: false });
        } else {
          this.form.enable({ onlySelf: true, emitEvent: false });
        }

        //Traer los bienes de pack_det
        this.validateButtons(res.statuspack.toString().toLocaleUpperCase());
        this.unitConversionDataService.updatePrevisualizationData.next(true);
      }
    });
  }
  //Buscar no_paquete
  searchNoPackage(params: any) {
    const paramsF = new FilterParams();
    paramsF.addFilter('numberPackage', params.text);
    this.unitConversionDataService.selectedPackage = params.text;
    this.packageGoodService.getPaqDestinationEnc(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        if (res && res.data && res.data.length > 0) {
          this.dataPackage = new DefaultSelect(res.data);
        } else {
          // this.dataPackageEnc = null;
        }
      },
      err => {
        console.log(err);
        this.dataPackage = new DefaultSelect([]);
        this.alert('error', 'ERROR', 'Paquete no encontrado');
      }
    );
  }

  checkPer() {
    const token = this.authService.decodeToken();

    const paramsF = new FilterParams();
    paramsF.addFilter('screenKey', 'FMTOPAQUETE_0001');
    paramsF.addFilter('readingPermission', 'S');
    paramsF.addFilter('writingPermission', 'S');
    paramsF.addFilter('user', token.preferred_username);
    this.securityService.getAccessXScreenFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        if (res.count > 0) {
          this.validaButton.PB_PERMISOS = true;
        } else {
          this.validaButton.PB_PERMISOS = false;
        }
      },
      err => {
        console.log(err);
      }
    );

    const model: IPerUser = {
      user:
        localStorage.getItem('username') == 'sigebiadmon'
          ? localStorage.getItem('username')
          : localStorage.getItem('username').toLocaleUpperCase(),
    };

    this.dynamicCatalogService
      .getPerUser(model)
      .pipe(
        catchError(x => of({ data: [] })),
        map(x => x.data)
      )
      .subscribe({
        next: res => {
          if (res && res.length > 0) {
            const resPer = res[0]['otvalor'].split('-');
            const gPer = this.generalPermissions;
            gPer.Proyecto = resPer[0] == 'P' ? true : false;
            gPer.Validar = resPer[1] == 'V' ? true : false;
            gPer.Autorizar = resPer[2] == 'A' ? true : false;
            gPer.Cerrar = resPer[3] == 'C' ? true : false;
            gPer.Cancelar = resPer[4] == 'X' ? true : false;
          } else {
            this.generalPermissions.Proyecto = true;
            this.generalPermissions.Validar = true;
            this.generalPermissions.Autorizar = true;
            this.generalPermissions.Cerrar = true;
            this.generalPermissions.Cancelar = true;
          }
        },
      });
  }

  goToGoodTracker() {
    this.bsModalRef.hide();
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FACTADBUBICABIEN' },
    });
  }

  emitDelegation(delegation: any) {
    this.descData.descDelegation = delegation;
  }

  edit(data: any) {
    //this.openModal({ edit: true, paragraph });
  }

  viewModal(type: string, size: string = '') {
    const modals: Record<string, any> = {
      error: {
        config: {
          data: this.dataErrors,
        },
        component: MassiveConversionErrorsModalComponent,
      },
      good: {
        config: {
          data: {
            goodDet: this.dataPrevisualization,
            infoPack: { ...this.form.value, ...this.descPaq },
          },
        },
        component: MassiveConversionModalGoodComponent,
      },
      email: {
        config: {
          form: this.fb.group({
            para: [null, [Validators.required]],
            cc: [this.V_EMAIL],
            asunto: [
              this.P_ASUNTO,
              [Validators.required, Validators.pattern(STRING_PATTERN)],
            ],
            mensaje: [
              this.P_MENSAJE,
              [Validators.required, Validators.pattern(STRING_PATTERN)],
            ],
          }),
        },
        component: EmailModalComponent,
      },
    };

    const activeModal = modals[type];

    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data: activeModal.config.data,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };

    /* Override the class */
    if (size.length > 0) {
      modalConfig.class = `modal-${size} modal-dialog-centered`;
    }

    this.modalRef = this.modalService.show(activeModal.component, modalConfig);

    // this.modalRef.content.onSentGoods.subscribe((result: any) => {
    //   this.modalEvent(result);
    // });
  }

  /* validateButtons(status: string) {
    if (status)
      if (status === 'P') {
        this.validaButton.PB_VALIDA = true;
        this.validaButton.PB_AUTORIZA = false;
        this.validaButton.PB_CERRAR = false;
      }
    if (status === 'X') {
      this.validaButton.PB_CANCELA = true;
    }

    if (status === 'V') {
      this.validaButton.PB_AUTORIZA = true;
      this.validaButton.PB_VALIDA = false;
      this.validaButton.PB_CERRAR = false;
    }
    if (status === 'X') {
      this.validaButton.PB_CANCELA = true;
    }

    if (status === 'A') {
      this.validaButton.PB_CERRAR = true;
      this.validaButton.PB_AUTORIZA = false;
      this.validaButton.PB_VALIDA = false;
    }
    if (status === 'X') {
      this.validaButton.PB_CANCELA = true;
    }

    if (status === 'X') {
      this.validaButton.PB_CANCELA = true;
    }
    if (status === 'C') {
      this.validaButton.PB_CANCELA = true;
      this.validaButton.PB_AUTORIZA = false;
      this.validaButton.PB_VALIDA = false;
      this.validaButton.PB_CERRAR = false;
    }
  } */

  modalEvent(event: any) {
    let dataRes;
    if (event) {
      dataRes = event.map((element: any) => {
        return {
          numberGood: element.goodNumber,
          description: element.description,
          record: element.fileNumber,
          originalUnit: element.measurementUnit,
          originalAmount: element.quantity,
        };
      });
    }
    this.dataPrevisualization = dataRes;
    // this.data.load(dataRes);
    this.totalItems = this.dataPrevisualization.length;
  }

  // Aquí puedes realizar las acciones necesarias con la información recibida

  selectRow(e: any) {
    console.log(e);
  }

  // getGoods() {
  //   if (!this.noPackage.value) return;
  //   this.loading = true;
  //   const newParams = new ListParams();
  //   newParams['filter.numberPackage'] = this.noPackage.value.numberPackage;
  //   this.params.getValue()['filter.numberPackage'] =
  //     this.noPackage.value.numberPackage;
  //   this.packageGoodService
  //     .getPaqDestinationDet(this.params.getValue())
  //     .subscribe(
  //       async response => {
  //         this.goodsList = response.data;
  //         let dataMap = await Promise.all(
  //           response.data.map(async (item: any) => {
  //             const respAvailable = await this.validateGood(item);
  //             let disponible = JSON.parse(
  //               JSON.stringify(respAvailable)
  //             ).available;
  //             return {
  //               ...item,
  //               available: disponible,
  //             };
  //           })
  //         );
  //         this.totalItems = response.count || 0;
  //         this.data.load(dataMap);
  //         this.dataPrevisualization = dataMap;
  //         this.loading = false;
  //       },
  //       error => {
  //         this.totalItems = 0;
  //         this.data.load([]);
  //         this.dataPrevisualization = [];
  //         this.loading = false;
  //       }
  //     );
  // }

  chargeForm2(noGoodFather: string) {
    let params = new ListParams();
    params['filter.id'] = noGoodFather;
    this.goodService.getAll(params).subscribe(response => {
      this.form2.patchValue({
        numberGood: response.data[0].id,
        record: response.data[0].fileNumber,
        description: response.data[0].description,
        amount: response.data[0].quantity,
        unitGood: response.data[0].unit,
        statusGood: response.data[0].status,
      });
    });
  }

  showButtonAlert(status: string) {
    let titleInit = '';
    let messageInit = '';
    switch (status) {
      case 'V':
        titleInit = 'Validación';
        messageInit = 'validar';
        break;
      case 'A':
        titleInit = 'Autorización';
        messageInit = 'autorizar';
        break;
      case 'C':
        titleInit = 'Cierre';
        messageInit = 'cerrar';
        break;
      default:
        break;
    }
    const noPackage = this.noPackage.value.numberPackage;
    if (this.dataPrevisualization.length === 0) {
      this.alert(
        'warning',
        titleInit + ' de paquete ' + noPackage,
        'No puede ' + messageInit + ' un paquete sin bienes'
      );
      return;
    }

    if (['V', 'A'].includes(status)) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Está seguro de ' + messageInit + ' el paquete ' + noPackage + '?'
      ).then(question => {
        if (question.isConfirmed) {
          this.updatePackageFirstBlock(status, titleInit);
        }
      });
    } else {
      this.updatePackageFirstBlock(status, titleInit);
    }
  }

  showConfirmAlert() {
    this.showButtonAlert('V');
    // this.alertQuestion(
    //   'info',
    //   'Confirmación',
    //   '¿Está seguro de que el Paquete ya ha sido validado?'
    // ).then(question => {
    //   if (question.isConfirmed) {
    //     this.updatePackageFirstBlock('V');
    //   }
    // });
  }

  showAutorizateAlert() {
    if (this.packageType.value != 3) {
      if (this.form.get('scanFolio').value != null) {
        this.serviceDocuments
          .getByFolio(this.form.get('scanFolio').value)
          .subscribe(
            res => {
              const data = JSON.parse(JSON.stringify(res));
              const scanStatus = data.data[0]['scanStatus'];
              console.log(scanStatus);
              if (scanStatus === 'ESCANEADO') {
                this.showButtonAlert('A');
              } else {
                this.alert('warning', 'El folio no ha sido escaneaddo', '');
              }
            },
            err => {
              this.alert('warning', 'El folio no ha sido escaneaddo', '');
            }
          );
      } else {
        this.alert('warning', 'Debe registrar un número de folio', '');
      }
    } else {
      this.form.get('scanFolio').setValue(1);
      const modelUpdate: Partial<IPackage> = {
        InvoiceUniversal: 1,
      };

      this.packageGoodService
        .updatePaqDestinationEnc(
          this.noPackage.value.numberPackage,
          modelUpdate
        )
        .subscribe(
          res => {
            this.showButtonAlert('A');
          },
          err => {
            this.alert(
              'error',
              'Se presentó un error inesperado al guardar el folio',
              ''
            );
          }
        );
    }

    // if (!this.form.valid) {
    //   Swal.fire(`Existe inconsistencia en los bienes ${this.form}`);
    //   return;
    // }

    // this.alertQuestion(
    //   'info',
    //   'Confirmación',
    //   '¿Está seguro de que el Paquete ya ha sido autorizado?'
    // ).then(async question => {
    //   if (question.isConfirmed) {
    //     let lnuInvoiceUnoversal = 0;
    //     if (this.form.get('packageType').value != 3) {
    //       const newParams = new ListParams();
    //       newParams['filter.id'] = this.form.get('scanFolio').value;
    //       newParams['filter.scanStatus'] = 'ESCANEADO';
    //       const documentsResult = await firstValueFrom(
    //         this.documentService
    //           .getAll(newParams)
    //           .pipe(catchError(x => of({ data: [] })))
    //       );
    //       if (documentsResult.data.length > 0) {
    //         lnuInvoiceUnoversal = 1;
    //       }
    //     } else if (this.form.get('packageType').value == 3) {
    //       lnuInvoiceUnoversal = 1;
    //     }

    //     if (lnuInvoiceUnoversal > 0 && this.form.get('status').value == 'V') {
    //       this.verifyGoods();
    //       const check = document.getElementById(
    //         'checkGood'
    //       ) as HTMLInputElement;

    //       if (!check.checked) {
    //         this.alert(
    //           'error',
    //           'Autoriza',
    //           'Existe inconsistencia en los bienes...'
    //         );
    //       } else {
    //         let currentDate = new Date();
    //         let formattedDate = currentDate.toISOString().substring(0, 10);
    //         const noPack: IPackageGoodEnc = this.noPackage.value;
    //         let packageUpdate: Partial<IPackage> = {
    //           numberPackage: +noPack.numberPackage,
    //           statuspack: 'A',
    //           dateValid: formattedDate,
    //         };
    //         this.updatePackage(packageUpdate, 'A');
    //       }
    //     }
    //   }
    // });
  }

  showCloseAlert() {
    const noPackage = this.noPackage.value.numberPackage;
    if (this.form.get('packageType').value != 3) {
      if (this.form.get('amountKg').value <= 0) {
        this.alert(
          'error',
          'Cierre de paquete ' + noPackage,
          'Debe ingresar previamente la cantidad convertida.'
        );
        return;
      }
      if (this.form.get('scanFolio').value === null) {
        this.alert(
          'error',
          'Cierre de paquete ' + noPackage,
          'Se debe tener el folio de escaneo'
        );
        return;
      }
      this.alertQuestion(
        'question',
        `Se generará un nuevo número de bien, agrupando los bienes del paquete: ${noPackage}`,
        'Una vez generado ya no se podrán hacer cambios, ¿Desea continuar?',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          const lv_ACCION = 'PARINV';

          let goods = this.dataPrevisualization.map(
            (good: { numberGood: any }) => {
              return good.numberGood;
            }
          );
          let closeData = {
            packageNumber: this.noPackage.value.numberPackage,
            packageUnit: this.measurementUnit.value,
            packageStatus: this.goodStatus.value.status,
            packageType: this.packageType.value,
            user: localStorage.getItem('username').toUpperCase(), // 'sigebiadmon',
            screenKey: 'FMTOPAQUETE',
            amount: this.amountKg.value,
            goodNumberArray: goods,
            goodClasifNumber: this.goodClassification.value.id,
          };

          this.goodProcessService.packageClose(closeData).subscribe(
            res => {
              this.alert('success', 'El paquete fue cerrado', '');
              this.researchNoPackage(this.noPackage.value.numberPackage);

              const modelUpdate: Partial<IPackage> = {
                amount: this.form.get('amountKg').value,
              };

              this.packageGoodService
                .updatePaqDestinationEnc(
                  this.noPackage.value.numberPackage,
                  modelUpdate
                )
                .subscribe(
                  res => {
                    console.log(res);
                  },
                  err => {
                    console.log(err);
                  }
                );
            },
            err => {
              console.log(err);
            }
          );
        }
      });
    } else {
      this.alert(
        'error',
        'Cierre de paquete ' + noPackage,
        'No puede cerrar paquetes chatarra'
      );
      this.amountKg.markAsTouched();
    }
    // Validar que todos los campos estén diligenciados
    // console.log(this.noPackage.value);
    // const noPackage = this.noPackage.value.numberPackage;
    // // return;
    // if (this.dataPrevisualization.length === 0) {
    //   this.alert(
    //     'error',
    //     'Cierre de paquete ' + noPackage,
    //     'No puede cerrar un paquete sin bienes'
    //   );
    //   return;
    // }
    // if (this.form.get('packageType').value != 3) {
    //   if (this.form.get('amountKg').value <= 0) {
    //     this.alert(
    //       'error',
    //       'Cierre de paquete ' + noPackage,
    //       'Debe ingresar previamente la cantidad convertida.'
    //     );
    //     return;
    //   }
    //   if (this.form.get('scanFolio').value === null) {
    //     this.alert(
    //       'error',
    //       'Cierre de paquete ' + noPackage,
    //       'Se debe tener el folio de escaneo'
    //     );
    //   } else {
    //     this.alertQuestion(
    //       'info',
    //       'Cierre de paquete ' + noPackage,
    //       '¿Está seguro en cerrar el Paquete?'
    //     ).then(async question => {
    //       if (question.isConfirmed) {
    //         const check = document.getElementById(
    //           'checkGood'
    //         ) as HTMLInputElement;
    //         if (!check.checked) {
    //           const verify = this.verifyGoods();
    //           if (!verify) return;
    //           // this.alert(
    //           //   'error',
    //           //   'Cierre de paquete ' + noPackage,
    //           //   'Existe inconsistencia en los bienes...'
    //           // );
    //         }
    //         let res = this.dataPrevisualization;
    //         let goods = res.map((good: { numberGood: any }) => {
    //           return good.numberGood;
    //         });
    //         let closeData = {
    //           packageNumber: this.noPackage.value,
    //           packageUnit: this.measurementUnit.value,
    //           packageStatus: this.status.value,
    //           packageType: this.packageType.value,
    //           user: localStorage.getItem('username').toUpperCase(), // 'sigebiadmon',
    //           screenKey: 'FMTOPAQUETE',
    //           amount: this.amountKg.value,
    //           goodNumberArray: goods,
    //           goodClasifNumber: this.goodClassification.value,
    //         };

    //         let currentDate = new Date();
    //         let formattedDate = currentDate.toISOString().substring(0, 10);
    //         this.goodProcessService
    //           .packageClose(closeData)
    //           .subscribe(response => {
    //             this.updatePackage(
    //               {
    //                 numberPackage: this.form.value.package,
    //                 statuspack: 'C',
    //                 dateValid: formattedDate,
    //               },
    //               'C'
    //             );
    //           });
    //       }
    //     });
    //   }
    // } else {
    //   this.alert(
    //     'error',
    //     'Cierre de paquete ' + noPackage,
    //     'No puede cerrar paquetes chatarra'
    //   );
    // }
  }

  async updatePackageFirstBlock(status: string, pAsuntoInit: string) {
    // if (['C', 'L'].includes(status) && this.amountKg.value <= 0) {
    //   this.alert(
    //     'error',
    //     'Actualización de Paquete',
    //     'Debe ingresar previamente la cantidad convertida'
    //   );
    //   return;
    // }
    let result = true;
    const check = document.getElementById('checkGood') as HTMLInputElement;
    console.log(this.form.value);
    const noPack: IPackageGoodEnc = this.noPackage.value;
    if (!check.checked) {
      result = await this.verifyGoods();
    }
    if (!result) return;
    let currentDate = new Date();
    let formattedDate = currentDate.toISOString().substring(0, 10);
    let packageUpdateV: Partial<IPackage> = {
      numberPackage: +noPack.numberPackage,
      statuspack: status,
      dateValid: formattedDate,
      useValid: localStorage.getItem('username').toUpperCase(),
    };

    let packageUpdateA: Partial<IPackage> = {
      numberPackage: +noPack.numberPackage,
      statuspack: status,
      dateauthorize: formattedDate,
      useauthorize: localStorage.getItem('username').toUpperCase(),
    };

    let packageUpdateC: Partial<IPackage> = {
      amount: this.amountKg.value,
    };

    this.packageGoodService
      .updatePaqDestinationEnc(
        this.noPackage.value.numberPackage,
        status == 'V'
          ? packageUpdateV
          : status == 'A'
          ? packageUpdateA
          : status == 'C'
          ? packageUpdateC
          : null
      )
      .subscribe({
        next: response => {
          let pMessageStatus = '';

          switch (status) {
            case 'V':
              this.validaButton.PB_VALIDA = false;
              this.validaButton.PB_AUTORIZA = true;
              // pAsuntoInit = 'Validación';
              pMessageStatus = 'validado';
              break;
            case 'A':
              // pAsuntoInit = 'Autorización';
              pMessageStatus = 'autorizado';
              this.validaButton.PB_AUTORIZA = false;
              this.validaButton.PB_CERRAR = true;
              break;
            case 'C':
              // pAsuntoInit = 'Autorización';
              this.validaButton.PB_CERRAR = false;
              pMessageStatus = 'cerrado';
              break;
            default:
              break;
          }
          /* this.pupIniCorreo(
            this.noPackage.value.numberPackage,
            pAsuntoInit,
            pMessageStatus
          ); */
          // if (statusMessage !== '') {
          //   Swal.fire(statusMessage, '', 'success');
          // }

          // this.form.patchValue({
          //   status: status,
          // });
          this.researchNoPackage(this.noPackage.value.numberPackage);
          this.validateButtons(status);
        },
        error: err => {
          this.alert(
            'error',
            'Validar Paquete',
            'Error al actualizar el paquete'
          );
        },
      });
  }

  get dataErrors() {
    return this.unitConversionDataService.dataErrors;
  }

  set dataErrors(value) {
    this.unitConversionDataService.dataErrors = value;
  }

  pbCorreo() {
    if (this.status.value === 'V') {
      this.alert(
        'error',
        'Envío de Correo',
        'El paquete ya está validado ya no se puede enviar correos'
      );
      return;
    }
    if (this.status.value === 'A') {
      this.alert(
        'error',
        'Envío de Correo',
        'El paquete ya está autorizado ya no se puede enviar correos'
      );
      return;
    }
    if (this.status.value === 'L') {
      this.alert(
        'error',
        'Envío de Correo',
        'El paquete ya está aplicado ya no se puede enviar correos'
      );
      return;
    }
    const noPack: IPackageGoodEnc = this.noPackage.value;

    if (noPack.numberPackage && this.status.value != 'L') {
      // this.pupIniCorreo(noPack.numberPackage,);
      this.P_ASUNTO =
        'Paquete de Conversión de Unidades No. ' + noPack.numberPackage;
      this.P_MENSAJE =
        '\n\n' + 'Atentamente,' + '\n\n\n' + localStorage.getItem('username');
      this.viewModal('email');
    }
  }

  async verifyGoods() {
    // console.log(this.data['data']);
    if (!['L', 'X'].includes(this.status.value)) {
      let _status: string;

      this.status.value == null
        ? (_status = 'Z')
        : (_status = this.status.value);
      //Validacion de filtros
      if (this.delegation.value == null) {
        this.alert(
          'warning',
          'Debe ingresar la Coordinación que administra',
          ''
        );
      } else if (this.goodClassification.value == null) {
        this.alert('warning', 'Debe ingresar el Clasificador', '');
      } else if (this.targetTag.value == null) {
        this.alert('warning', 'Debe ingresar la Etiqueta de destino', '');
      } else if (this.goodStatus.value == null) {
        this.alert('warning', 'Debe ingresar el Estatus', '');
      } else if (this.transferent.value == null) {
        this.alert('warning', 'Debe ingresar la Transferente', '');
      } else if (
        this.packageType.value != '3' &&
        this.warehouse.value == null
      ) {
        this.alert('warning', 'Debe ingresar el Almacén', '');
      } else {
        //Validacion de bienes
        if (this.dataPrevisualization.length > 0) {
          const check = document.getElementById(
            'checkGood'
          ) as HTMLInputElement;
          check.checked = true;
          const ch_bienes_ok = 1;

          // debugger;
          let availablePrincipal = true;
          this.unitConversionDataService.dataErrors = [];

          this.dataPrevisualization.forEach(data => {
            this.VALIDA_VAL24 = 'S';
            const resp = this.validateGoods(data);
            console.log(resp);

            const available = JSON.parse(JSON.stringify(resp)).res;
            const message = JSON.parse(JSON.stringify(resp)).msg;
            if (!available) {
              this.dataErrors.push({
                numberGood: data.numberGood,
                descError: message,
              });
            }

            availablePrincipal = availablePrincipal && available;
            // this.unitConversionDataService.descError = message;
          });

          if (availablePrincipal) {
            this.form2.enable({ onlySelf: true, emitEvent: false });
            this.alert('success', 'Bienes sin Errores', '');
          } else {
            this.form2.disable({ onlySelf: true, emitEvent: false });
            this.alert('error', 'Bienes con Errores', '');
          }
          this.widthErrors = availablePrincipal;
          check.checked = availablePrincipal;
          return availablePrincipal;
          // this.form2.get('check').setValue(false);
        } else {
          this.alert('warning', 'No hay Bienes que verificar', '');
          return false;
        }
      }
    }
    return false;
  }

  validateGoods(good: any) {
    // debugger;
    const noPack: IPackageGoodEnc = this.noPackage.value;
    let LV_VALIDA: string;
    let lv_DESC_ERROR = '';
    console.log(noPack);
    if (noPack.numberDelegation != good.bienes.delegationNumber) {
      console.log(good);
      console.log({
        valpack: noPack.numberDelegation,
        valgood: good.bienes.delegationNumber,
        good: good.bienes.goodId,
      });
      lv_DESC_ERROR += 'En la Delegación del bien.';
    }
    if (noPack.numberClassifyGood != good.bienes.goodClassNumber) {
      console.log({
        valpack: noPack.numberClassifyGood,
        valgood: good.bienes.goodClassNumber,
        good: good.bienes.goodId,
      });
      lv_DESC_ERROR +=
        (lv_DESC_ERROR.length > 0 ? '/' : '') + 'En el Clasif. del bien.';
      // resolve({ res: false, msg: 'classify' });
    }
    if (noPack.numberLabel != good.bienes.labelNumber) {
      console.log({
        valpack: noPack.numberLabel,
        valgood: good.bienes.labelNumber,
        good: good.bienes.goodId,
      });
      lv_DESC_ERROR +=
        (lv_DESC_ERROR.length > 0 ? '/' : '') + 'En la Etiqueta del bien.';
      // resolve({ res: false, msg: 'label' });
    }
    if (noPack.status != good.bienes.status) {
      console.log({
        valpack: noPack.status,
        valgood: good.bienes.status,
        good: good.bienes.goodId,
      });
      lv_DESC_ERROR +=
        (lv_DESC_ERROR.length > 0 ? '/' : '') + 'En el Estatus del bien.';
      // resolve({ res: false, msg: 'status' });
    }
    if (
      noPack.typePackage != '3' &&
      noPack.numberStore != good.bienes.storeNumber
    ) {
      // resolve({ res: false, msg: 'store' });
      lv_DESC_ERROR +=
        (lv_DESC_ERROR.length > 0 ? '/' : '') + 'En el Almacén del bien.';
    }
    if (noPack.typePackage == '3') {
      if (this.VALIDA_VAL24 === 'S') {
        LV_VALIDA = this.VALIDA_VAL24;
        this.VALIDA_VAL24 = 'N';
      }
      if (LV_VALIDA !== good.bienes.val24) {
        lv_DESC_ERROR +=
          (lv_DESC_ERROR.length > 0 ? '/' : '') + 'El parametro del Val24.';
      } else if (!good.bienes.val24) {
        lv_DESC_ERROR +=
          (lv_DESC_ERROR.length > 0 ? '/' : '') + 'El parametro del Val24.';
      }
    }
    if (lv_DESC_ERROR.length > 0) {
      return { res: false, msg: lv_DESC_ERROR };
    } else {
      return { res: true, msg: '' };
    }
  }

  pupIniCorreo(
    numberPackage: any,
    pAsuntoInit: string,
    pMessageStatus: string
  ) {
    // console.log(V_MENSAJE);

    this.P_ASUNTO =
      pAsuntoInit +
      ' de Paquete de Conversión de Unidades No. ' +
      numberPackage;
    this.P_MENSAJE =
      'Para informar que el Paquete de Conversión de Unidades No. ' +
      numberPackage +
      ' fué marcado como ' +
      pMessageStatus +
      ' el día ' +
      firstFormatDate(new Date()) +
      '.' +
      '\n\n' +
      'Atentamente,' +
      '\n\n\n' +
      localStorage.getItem('username');
    this.viewModal('email');
  }

  pubValidaGoods(val24: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let IpackageValidGoods: IpackageValidGood = {
        pAlmacenNumber: this.warehouse.value.idWarehouse,
        pDelegationNumber: this.delegation.value,
        pGoodClasifNumber: this.goodClassification.value,
        pEtiquetaNumber: this.targetTag.value.id,
        pPaqueteNumber: this.noPackage.value.numberPackage,
        pStatus: this.goodStatus.value.status,
        pTypePaquete: this.packageType.value,
        pValidVal24: val24.toString(),
      };

      this.packageGoodService.pubValidGood(IpackageValidGoods).subscribe(
        response => {
          this.goodErrors = response.data;
          if (this.goodErrors.length > 0) {
            this.chValidateGood = false;
            this.alert('warning', 'Existe inconsistencia en los bienes', '');
          } else {
            this.chValidateGood = true;
            this.alert('warning', 'Validación de bienes correcta', '');
          }

          resolve(true); // Resuelve la promesa con valor `true`
        },
        error => {
          this.alert('error', 'Error Al Validar los bienes', '');
          reject(error); // Rechaza la promesa en caso de error
        }
      );
    });
  }

  exportToExcel() {
    let iPackage: IPackageInfo = {
      amountGood: this.amountKg.value,
      goodFatherNumber: this.numberGoodFather.value,
      delegationNumber: this.delegation.value,
      descGood: this.descriptionPackage.value,
      statusGood: this.goodStatus.value.status,
      packageNumber: this.noPackage.value.numberPackage,
      proceedingNumber: this.record.value,
      unitGood: this.measurementUnit.value,
    };

    this.massiveGoodService.pubExport(iPackage).subscribe(
      response => {
        this.convertAndDownloadExcel(response.base64File, response.fileName);
        this.alert('success', 'Exportación Excel', 'Generada Correctamente');
        // Swal.fire('Exito', 'Se genero el archivo excel', 'success');
      },
      error => {
        this.alert('error', 'Error al Generar el Archivo Excel', '');
        // Swal.fire('Error', 'Error Al generar el archivo excel', 'error');
      }
    );
  }

  delete(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  convertAndDownloadExcel(base64String: string, fileName: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const workbook = XLSX.read(byteArray, { type: 'array' });
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    FileSaver.saveAs(data, fileName);
  }

  pufDescError(err: number): string {
    const errors: Record<number, string> = {
      1: 'En la Delegación del bien.',
      2: 'En el Clasif. del bien.',
      3: 'En la Etiqueta del bien.',
      4: 'En el Estatus del bien.',
      5: 'En la Autoridad del bien.',
      6: 'En el Almacén del bien.',
      7: 'El parámetro del Val24.',
    };

    return errors[err];
    // let err0: string = '';

    // if (err === 1) {
    //   err0 = 'En la Delegación del bien.';
    // } else if (err === 2) {
    //   err0 = 'En el Clasif. del bien.';
    // } else if (err === 3) {
    //   err0 = 'En la Etiqueta del bien.';
    // } else if (err === 4) {
    //   err0 = 'En el Estatus del bien.';
    // } else if (err === 5) {
    //   err0 = 'En la Autoridad del bien.';
    // } else if (err === 6) {
    //   err0 = 'En el Almacén del bien.';
    // } else if (err === 7) {
    //   err0 = 'El parámetro del Val24.';
    // }
  }

  generateFoli() {
    if (this.form.get('scanFolio').value) {
      Swal.fire('Error', 'Ya existe un folio', 'error');
    } else {
      let data = {
        noPaquete: this.form.get('package').value,
        tipoPaquete: this.form.get('packageType').value,
        cvePaquete: this.cvePackage,
        toolbarNoDelegacion: '',
        toolbarNoSubdelegacion: '',
        toolbarNoDepartamento: '',
        usuario: 'DR_SIGEBI',
      };

      this.lotService.pubFmtoPackage(data).subscribe(
        response => {
          console.log('response', 'response');
          this.form.get('scanFolio').setValue(response.data.LNU_FOLIO);
          Swal.fire('Exito', 'Se genero el folio', 'success');
        },
        error => {
          Swal.fire('Error', 'Error Al generar el folio', 'error');
        }
      );
    }
  }

  // cancelPackage() {
  //   this.alertQuestion(
  //     'warning',
  //     'Cancelar',
  //     '¿Desea cancelar este paquete?'
  //   ).then(question => {
  //     if (question.isConfirmed) {
  //       let data = {
  //         goodNumber: this.form2.get('numberGood').value,
  //         packageNumber: this.form.get('package').value,
  //         user: 'DR_SIGEBI',
  //         toolbarUsername: 'DR_SIGEBI',
  //         statusPaq: this.form.get('status').value,
  //         parentGoodNumber: this.form2.get('numberGood').value,
  //         status: this.form2.get('status').value,
  //       };
  //       this.lotService.pubCancelPackage(data).subscribe(
  //         response => {
  //           console.log(response);
  //           Swal.fire('Exito', 'Se cancelo el paquete', 'success');
  //         },
  //         error => {
  //           console.log(error);
  //           Swal.fire('Error', 'Error Al cancelar el paquete', 'error');
  //         }
  //       );
  //     }
  //   });
  // }

  getUsername() {
    const user =
      localStorage.getItem('username') == 'sigebiadmon'
        ? localStorage.getItem('username')
        : localStorage.getItem('username').toLocaleUpperCase();
    return user;
  }

  downloadReport() {
    this.loading = true;
    let params: any = {};
    params['NO_PAQUETE'] = this.form.get('noPackage').value.numberPackage;
    params['PCLAVE'] = this.form.get('cvePackage').value.cvePackage;
    params['PDESTINO'] = this.form.get('packageType').value.packageType;
    console.log('params....', params);
    this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport('RGENACTACONVUNIDAD', params).subscribe({
      next: (response: BlobPart) => {
        this.loading = false;
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
      },
    });
  }

  /* private getSegPantalla() {
    const filterParams = new FilterParams();
    filterParams.addFilter('screenKey', 'FMTOPAQUETE_0001');
    filterParams.addFilter(
      'user',
      localStorage.getItem('username').toUpperCase()
    );
    filterParams.addFilter('writingPermission', 'S');
    filterParams.addFilter('readingPermission', 'S');
    return this.segAppService
      .getScreenWidthParams(filterParams.getFilterParams())
      .pipe(
        takeUntil(this.$unSubscribe),
        map(x => (x.data ? x.data : []))
      );
  } */

  openPermissions(data: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: false,
    };
    this.modalService.show(MassiveConversionPermissionsComponent, modalConfig);
  }

  //Funciones Agregadar por Grigork Farfan
  //Nuevo
  newPackage() {
    this.loadingNewBtn = true;
    console.log(this.form.get('packageType').value);

    if (!this.generalPermissions.Proyecto) {
      this.alert(
        'warning',
        'No cuenta con privilegios',
        'No cuenta con privilegios para guardar un nuevo paquete'
      );
      return;
    } else if (
      this.delegation.value == null ||
      this.goodClassification.value == null ||
      this.targetTag.value == null ||
      this.goodStatus.value == null ||
      this.transferent.value == null
    ) {
      this.delegation.markAsTouched();
      this.goodClassification.markAsTouched();
      this.targetTag.markAsTouched();
      this.goodStatus.markAsTouched();
      this.transferent.markAsTouched();
      this.loadingNewBtn = false;
    } else if (this.form.get('packageType').value == null) {
      this.alert('warning', 'Debe especificar el tipo de paquete', '');
      this.loadingNewBtn = false;
    } else if (this.form.get('packageType').value != 3) {
      if (this.warehouse.value.idWarehouse == null) {
        this.warehouse.markAsTouched();
        this.alert('warning', 'Debe ingresar el Almacén', '');
        this.loadingNewBtn = false;
      } else {
        this.newCvePackage();
      }
    } else {
      this.newCvePackage();
    }
  }

  zeroAdd(number: number, lengthS: number) {
    if (number != null) {
      const stringNum = number.toString();
      let newString = '';
      if (stringNum.length < lengthS) {
        lengthS = lengthS - stringNum.length;
        for (let i = 0; i < lengthS; i++) {
          newString = newString + '0';
        }
        newString = newString + stringNum;
        return newString;
      } else {
        return stringNum;
      }
    } else {
      return null;
    }
  }

  newCvePackage() {
    //Variables
    let v_clave: string; //V_DESC_TRANS es el mismo valor
    let v_id_tipo_acta: string;
    let v_administra: string;
    let v_ejecuta: string;
    let v_folio: string;
    console.log(this.delegation.value);

    const paramsF = new FilterParams();
    paramsF.addFilter('id', this.transferent.value.id);
    this.transferCatalogService.getAllWithFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        v_clave = res['data'][0].keyTransferent;
        if (['PGR', 'PJF'].includes(v_clave)) {
          v_id_tipo_acta = 'A';
        } else {
          v_id_tipo_acta = 'RT';
        }
        console.log(v_clave);
        this.rNomenclaService
          .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
          .subscribe(res => {
            console.log(res);
            let edo = JSON.parse(JSON.stringify(res));
            console.log(edo);
            const paramsF2 = new FilterParams();
            console.log(this.delegation.value);
            paramsF2.addFilter('numberDelegation2', this.delegation.value.id);
            paramsF2.addFilter('stageedo', edo.stagecreated);
            this.rNomenclaService.getRNomencla(paramsF2.getParams()).subscribe(
              res => {
                console.log(res);
                v_administra = JSON.parse(
                  JSON.stringify(res['data'][0])
                ).delegation;

                const resJson = JSON.parse(JSON.stringify(res.data[0]));
                const paramsF3 = new FilterParams();
                paramsF3.addFilter('stageedo', edo.stagecreated);
                paramsF3.addFilter(
                  'numberDelegation2',
                  this.dataUser.delegation
                );
                console.log(paramsF3.getParams());
                this.rNomenclaService
                  .getRNomencla(paramsF3.getParams())
                  .subscribe(
                    res => {
                      console.log(res);
                      console.log(res['data'][0]);
                      v_ejecuta = JSON.parse(
                        JSON.stringify(res['data'][0])
                      ).delegation;
                      const model: IFoliovInvoice = {
                        vExecute: v_ejecuta,
                        vYear: parseInt(format(new Date(), 'yy')),
                      };
                      console.log(model);
                      this.packageGoodService.getFolio(model).subscribe(
                        async res => {
                          console.log(res);
                          v_folio = this.zeroAdd(res.vfolio, 5);
                          await this.cvePackage.setValue(
                            `CONV/${v_id_tipo_acta}/${v_clave}/${v_administra}/${v_ejecuta}/${v_folio}/${format(
                              new Date(),
                              'yy'
                            )}/${format(new Date(), 'MM')}`
                          );
                          await this.descriptionPackage.setValue(
                            `FOLIO: ${v_folio}, DELEGACION: ${this.dataUser.desDelegation}`
                          );
                          this.generate();
                        },
                        err => {
                          console.log(err);
                          this.loadingNewBtn = false;
                          this.alert(
                            'error',
                            'Se presentó un error inesperado',
                            ''
                          );
                        }
                      );
                    },
                    err => {
                      console.log(err);
                      this.loadingNewBtn = false;
                      this.alert(
                        'error',
                        'Se presentó un error inesperado',
                        ''
                      );
                    }
                  );
              },
              err => {
                console.log(err);
                this.loadingNewBtn = false;
                this.alert('error', 'Se presentó un error inesperado', '');
              }
            );
          });
      },
      err => {
        console.log(err);
        v_clave = 'XXX';
        this.alert('error', 'Se presentó un error inesperado', '');
        this.loadingNewBtn = false;
      }
    );
  }

  researchNoPackage(noPack: string) {
    const paramsF = new FilterParams();
    paramsF.addFilter('numberPackage', noPack);
    this.unitConversionDataService.selectedPackage = noPack;
    this.packageGoodService.getPaqDestinationEnc(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        if (res && res.data && res.data.length > 0) {
          this.noPackage.setValue(res.data[0]);
          this.loading = false;
          this.validateButtons(this.noPackage.value.statuspack);
        } else {
          // this.dataPackageEnc = null;
        }
      },
      err => {
        console.log(err);
        this.dataPackage = new DefaultSelect([]);
        this.alert('error', 'ERROR', 'Paquete no encontrado');
        this.loading = false;
      }
    );
  }

  generate() {
    const user =
      localStorage.getItem('username') == 'sigebiadmon'
        ? localStorage.getItem('username')
        : localStorage.getItem('username').toLocaleUpperCase();

    const model: IPackage = {
      description: this.descriptionPackage.value,
      typePackage: this.packageType.value,
      amount: this.amountKg.value,
      dateElaboration: format(new Date(), 'yyyy-MM-dd'),
      dateCapture: format(new Date(), 'yyyy-MM-dd'),
      dateCaptureHc: null,
      statuspack: 'P',
      numberClassifyGood: this.goodClassification.value.numClasifGoods,
      numberLabel: this.targetTag.value.id,
      unit: this.measurementUnit.value,
      numberStore: this.warehouse.value.idWarehouse,
      numberRecord: null,
      status: this.goodStatus.value.status,
      numbertrainemiaut: this.transferent.value.id,
      dateValid: null,
      dateauthorize: null,
      dateClosed: null,
      dateApplied: null,
      cvePackage: this.cvePackage.value,
      dateCancelled: null,
      InvoiceUniversal: null,
      paragraph1: null,
      paragraph2: null,
      paragraph3: null,
      numberDelegation: this.delegation.value.id,
      useElaboration: user,
      useValid: null,
      useauthorize: null,
      useClosed: null,
      useApplied: null,
      useCancelled: null,
      numberGoodFather: null,
      nbOrigin: '',
    };
    console.log(model);
    this.status.setValue('P');
    this.fecElab.setValue(format(new Date(), 'yyyy-MM-dd'));
    this.userElab.setValue(user);

    this.packageGoodService.insertPaqDestionarioEnc(model).subscribe(
      res => {
        console.log(res);
        console.log(res.numberPackage);
        this.researchNoPackage(res.numberPackage);
        this.loadingNewBtn = false;
        this.alert('success', 'Se creó un Nuevo Paquete', '');
      },
      err => {
        console.log(err);
        this.loadingNewBtn = false;
        this.alert('error', 'Se presentó un error inesperado', '');
      }
    );
  }

  clear() {
    this.form.reset({}, { onlySelf: true, emitEvent: false });

    this.form.enable({ onlySelf: true, emitEvent: false });
    this.form2.reset({}, { onlySelf: true, emitEvent: false });
    this.form2.enable({ onlySelf: true, emitEvent: false });
    this.dataErrors = [];
    this.unitConversionDataService.clearPrevisualizationData.next(true);
  }



  validateButtons(status: string) {
    const vBtn = this.validaButton;
    if (status == 'P') {
      if (this.generalPermissions.Validar) {
        vBtn.PB_VALIDA = true;
        vBtn.PB_AUTORIZA = false;
        vBtn.PB_CERRAR = false;
      }
      if (this.generalPermissions.Cancelar) {
        vBtn.PB_CANCELA = true;
      }
    } else if (status == 'V') {
      if (this.generalPermissions.Autorizar) {
        vBtn.PB_AUTORIZA = true;
        vBtn.PB_VALIDA = false;
        vBtn.PB_CERRAR = false;
      }
      if (this.generalPermissions.Cancelar) {
        vBtn.PB_CANCELA = true;
      }
    } else if (status == 'A') {
      if (this.generalPermissions.Cancelar) {
        vBtn.PB_CERRAR = true;
        vBtn.PB_AUTORIZA = false;
        vBtn.PB_VALIDA = false;
      }
      if (this.generalPermissions.Cancelar) {
        vBtn.PB_CANCELA = true;
        vBtn.PB_CERRAR = true;
      }
    } else if (status == 'C') {
      if (this.generalPermissions.Cancelar) {
        vBtn.PB_CANCELA = true;
        vBtn.PB_CERRAR = false;
      }
    } else {
      vBtn.PB_AUTORIZA = false;
      vBtn.PB_CANCELA = false;
      vBtn.PB_CERRAR = false;
      vBtn.PB_PERMISOS = false;
      vBtn.PB_VALIDA = false;
    }
  }

  //Cargar bienes
  selectGoods() {
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        noPackage: this.noPackage,
      },
      ignoreBackdropClick: true,
    };
    this.modalService.show(MassiveConversionSelectGoodComponent, modalConfig);
  }

  handleOutPut(e: any) {
    console.log(e.data);
    this.dataArrive = e.data;
  }

  //Boton de Cancelar
  cancelPackFunction() {
    console.log(this.noPackage.value.numberPackage);
    if (
      this.noPackage.value.numberPackage != null &&
      !['L', 'C', 'X'].includes(this.status.value)
    ) {
      this.alertQuestion(
        'question',
        '¿Está seguro en cancelar el Paquete?',
        ''
      ).then(q => {
        if (q.isConfirmed) {
          const model = {
            noPackage: this.noPackage.value.numberPackage,
          };

          this.goodProcessService
            .firstIfCancelMassiveConversion(model)
            .subscribe(
              res => {
                this.researchNoPackage(this.noPackage.value.numberPackage);
                this.alert('success', 'El Paquete fue cancelado', '');
              },
              err => {
                console.log(err);
              }
            );
        }
      });
    } else if (this.status.value == 'C') {
      this.alertQuestion(
        'question',
        '¿Está seguro en cancelar el Paquete Cerrado?',
        ''
      ).then(q => {
        if (q.isConfirmed) {
          let token = this.authService.decodeToken();
          const noPack = this.noPackage.value;
          console.log(this.noPackage.value);

          const model: ISecondIfMC = {
            noPackage: this.noPackage.value.numberPackage,
            noGoodFather: this.noPackage.value.numberGoodFather,
            encStatus: this.noPackage.value.status,
            vcScreen: 'FMTOPAQUETE',
            user:
              localStorage.getItem('username') == 'sigebiadmon'
                ? localStorage.getItem('username')
                : localStorage.getItem('username').toLocaleUpperCase(),
            toolbarUser:
              localStorage.getItem('username') == 'sigebiadmon'
                ? localStorage.getItem('username')
                : localStorage.getItem('username').toLocaleUpperCase(),
          };
          console.log(model);
          this.goodProcessService
            .secondIfCancelMassiveConversion(model)
            .subscribe(
              res => {
                this.researchNoPackage(this.noPackage.value.numberPackage);
                this.alert('success', 'El Paquete fue cancelado', '');
              },
              err => {
                console.log(err);
              }
            );
        }
      });
    }
  }

  //Insertar párrafos
  insertParagraph() {
    if (
      this.noPackage.value.numberPackage != null &&
      !['L', 'X'].includes(this.noPackage.value.statuspack.toString())
    ) {
      if (this.form.get('paragraph1').value != null) {
        this.alertQuestion(
          'question',
          '¿El proceso reinicializa los párrafos, se continua?',
          '',
          'Continuar'
        ).then(q => {
          if (q.isConfirmed) {
            this.insertParagraphFn();
          }
        });
      } else {
        this.insertParagraphFn();
      }
    } else {
      this.alert(
        'warning',
        'No hay registrado un número de paquete o el estatus no es el correcto',
        ''
      );
    }
  }

  insertParagraphFn() {
    let V_DESC_TIP: string;

    switch (this.noPackage.value.typePackage.toString()) {
      case '1':
        V_DESC_TIP = 'Destrucción';
        break;
      case '1':
        V_DESC_TIP = 'Donación';
        break;
      case '1':
        V_DESC_TIP = 'Chatarra';
        break;
      default:
        V_DESC_TIP = 'Indeterminado';
        break;
    }

    const p1 = `- - - En la Ciudad de ______________, siendo las _____ horas, del día ____de ________ de 200__, se encuentran presentes en la Bodega ubicada en la calle de ________________________ de esta Ciudad, el C. _____________________ con cargo de ___________________, de la empresa ______________ y el C. ________________ adscrito a _______________ del Servicio de Administración y Enajenación de Bienes (SAE), Organismo Descentralizado de la Administración Pública Federal; ambos con el fin de llevar a cabo la validación y conversión de los bienes transferidos al SAE.- - - - - - - - - - - - - - - - - - - - - - - - - - - - \n
    - - -Intervienen como testigos de asistencia los CC. _______________________, y ___________________________, - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n
    -------------------------------------------------- A N T E C E D E N T E S ------------------------------------------\n

    - - - l. Los bienes fueron transferidos al SAE por [_____________________________], con fundamento en los artículos 3 de la LFAEBSP, 12 y 13 del Reglamento de la ley en comento. - - \n
    - - - II.- Los bienes sujetos ha validación y conversión de unidad, se encuentran en administración del SAE y bajo la custodia de _____________________ los cuales se incorporan a este procedimiento a efecto de facilitar la ejecución de su destino.- - - - - - - - - - - - '\n
    ----------------------------------------------------- DECLARACIONES ---------------------------------------------'\n
    - - - PRIMERA.- El C. _________________ manifiesta que los bienes que fueron transferidos al SAE se encuentran bajo su custodia y con el fin de dar cumplimento al destino final sugerido por la Entidad Transferente se sujetaran a un procedimiento de validación y conversión en virtud de que fueron puestos a disposición con un tipo de unidad diferente al de kilogramos.- - - \n
    - - - SEGUNDA.- Que para realizar el proceso de validación y conversión se verifican las cantidades físicas, contra las cantidades señaladas en los documentos y registros oficiales para posteriormente determinar el valor de conversión a kilogramos. - - - - - - - - - - - - - - - - - - - - - - -'\n
    - - - TERCERA.- La conversión integra un paquete de bienes, que puede estar conformado por uno o varios registros y que son consistentes en las siguientes características: a) Autoridad ${this.noPackage.value.numbertrainemiaut}, b) Clasificador del bien ${this.descGoodClass}, c) Estatus del bien ${this.noPackage.value.status}, d) Etiqueta de destino ${this.descLabel}, e) La custodia se encuentra a cargo del almacén ${this.descWarehouse}, y f) La administración de los bienes esta a cargo de la Coordinación (s) Regional (es)_________________________________.- - - - - - - - - - - - - `;

    const p2 = `- - - CUARTA.- Una vez validada la existencia física de los bienes descritos en la declaratoria anterior, se determinó que su valor de conversión a kilogramos corresponde a: `;
    const p3 = `- - - QUINTA.- El valor de conversión a kilogramos determinado en la Cláusula Cuarta es una referencia para ejecutar el destino de ${V_DESC_TIP} de los bienes  que conforman en paquete, por lo que cada registro conserva la referencia de cantidad y unidad recibidas del transferente - - - - - - - - - - -  -- - - - - - - - - - - - - - - - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - -'\n
    '- - - - - - - - - - - - - - - - - - - - - - - - - - -  CIERRE DEL ACTA -------------------------------------------------'\n
    'Se da por concluida la presente acta, siendo las ____ horas del día ____ de __________ de 200__, firmando  al margen y al calce por las personas que en ella intervienen, para todos los efectos a que haya lugar. - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'\n\n\n\n
    \t\t\t'CUSTODIA, VALIDA Y EJECUTA CONVERSIÓN'\t\t\t'POR EL S.A.E.'\n\n\n\n\n\n
    \t\t\t'C. _____________________'\t\t\t\t\t'C. _____________________'\n\n\n
    'Ultima página del Acta Administrativa de Validación y Conversión de Bienes con Clave ${this.noPackage.value.cvePackage}' de fecha ___ de  _________ de 2008, constante de ____ fojas. - - - - - - - - - - - - `;

    //Insertar en el parrafo
    this.paragraph1.setValue(p1);
    this.paragraph2.setValue(p2);
    this.paragraph3.setValue(p3);

    //Actualizar paq_dest_enc
    const modelUpdate: Partial<IPackage> = {
      paragraph1: this.paragraph1.value,
      paragraph2: this.paragraph2.value,
      paragraph3: this.paragraph3.value,
    };

    this.packageGoodService
      .updatePaqDestinationEnc(this.noPackage.value.numberPackage, modelUpdate)
      .subscribe(
        res => {
          console.log(res);
          this.alert('success', 'Párrafos Insertados', '');
        },
        err => {
          console.log(err);
          this.alert(
            'error',
            'Se presentó un Error al Insertar los Párrafos',
            ''
          );
        }
      );
  }

  addNewPack() {
    this.clear();
    this.newDataFilled = true;
    this.getCatalogGoodStatus({ text: 'ADM' }, true);
  }

  updatePackage() {
    const modelUpdate: Partial<IPackage> = {
      paragraph1: this.paragraph1.value,
      paragraph2: this.paragraph2.value,
      paragraph3: this.paragraph3.value,
    };

    this.packageGoodService
      .updatePaqDestinationEnc(this.noPackage.value.numberPackage, modelUpdate)
      .subscribe(
        res => {
          this.alert('success', 'Párrafos actualizados', '');
          console.log(res);
        },
        err => {
          this.alert(
            'error',
            'Se presentó un Error al Actualizar los Párrafos',
            ''
          );
          console.log(err);
        }
      );
  }

  //Funciones para los catalogos
  initCatalogs() {
    this.getCatalogDelegation();
    this.getCatalogClassGood();
    this.getCatalogTransferent();
    this.getCatalogWareHouse();
    this.getCatalogUnit();
    this.getCatalogTag();
    this.getCatalogGoodStatus({ text: 'ADM' }, true);
  }

  getCatalogDelegation(e?: ListParams, research?: boolean) {
    const paramsF = new FilterParams();
    if (e) {
      if (e.text != '') {
        if (isNaN(parseInt(e.text))) {
          paramsF.addFilter('description', e.text, SearchFilter.ILIKE);
        } else {
          paramsF.addFilter('id', e.text);
        }
      } else {
        paramsF.page = e.page;
      }
    }

    this.delegationService.getAll(e ? paramsF.getParams() : '').subscribe(
      res => {
        const newData = res.data.map((e: any) => {
          return {
            ...e,
            labelValue: `${e.id} - ${e.description}`,
          };
        });
        this.dataDelegation = new DefaultSelect(newData, res.count);
        research ? this.delegation.setValue(newData[0]) : '';
      },
      err => {
        console.log(err);
        this.dataDelegation = new DefaultSelect();
      }
    );
  }

  getCatalogClassGood(e?: ListParams, research?: boolean) {
    const paramsF = new FilterParams();
    if (e) {
      console.log(e);
      if (e.text != '') {
        if (isNaN(parseInt(e.text))) {
          paramsF.addFilter('description', e.text, SearchFilter.ILIKE);
        } else {
          paramsF.addFilter('numClasifGoods', e.text);
        }
      } else {
        paramsF.page = e.page;
      }
      this.goodSssubtypeService
        .getAllSssubtype(e ? paramsF.getParams() : '')
        .subscribe({
          next: res => {
            if (res && res.data) {
              const newData = res.data.map((e: any) => {
                return {
                  ...e,
                  labelValue: `${e.numClasifGoods} - ${e.description}`,
                };
              });
              this.dataGoodClass = new DefaultSelect(newData, res.count);
              research ? this.goodClassification.setValue(newData[0]) : '';
            } else {
              this.dataGoodClass = new DefaultSelect();
            }
          },
          error: err => {
            console.log(err);
            this.dataGoodClass = new DefaultSelect();
          },
        });
    }
  }

  getCatalogTransferent(e?: ListParams, research?: boolean) {
    const paramsF = new FilterParams();
    if (e) {
      if (e.text != '') {
        if (isNaN(parseInt(e.text))) {
          paramsF.addFilter('nameTransferent', e.text, SearchFilter.ILIKE);
        } else {
          paramsF.addFilter('id', e.text);
        }
      } else {
        paramsF.page = e.page;
      }
    }

    this.transferCatalogService.getAll(e ? paramsF.getParams() : '').subscribe(
      res => {
        const newData = res.data.map((e: any) => {
          return {
            ...e,
            labelValue: `${e.id} - ${e.nameTransferent}`,
          };
        });
        this.dataTransferent = new DefaultSelect(newData, res.count);
        research ? this.transferent.setValue(newData[0]) : '';
      },
      err => {
        console.log(err);
        this.dataTransferent = new DefaultSelect();
      }
    );
  }

  getCatalogWareHouse(e?: ListParams, research?: boolean) {
    const paramsF = new FilterParams();
    if (e) {
      if (e.text != '') {
        if (isNaN(parseInt(e.text))) {
          paramsF.addFilter('description', e.text, SearchFilter.ILIKE);
        } else {
          paramsF.addFilter('idWarehouse', e.text);
        }
      } else {
        paramsF.page = e.page;
      }
    }

    this.warehouseService.getAll(e ? paramsF.getParams() : '').subscribe(
      res => {
        console.log(res);
        const newData = res.data.map((e: any) => {
          return {
            ...e,
            labelValue: `${e.idWarehouse} - ${e.description}`,
          };
        });
        this.dataWarehouse = new DefaultSelect(newData, res.count);
        research ? this.warehouse.setValue(newData[0]) : '';
      },
      err => {
        console.log(err);
        this.dataWarehouse = new DefaultSelect();
      }
    );
  }

  getCatalogUnit(e?: ListParams, research?: boolean) {
    const paramsF = new FilterParams();
    if (e) {
      if (e.text != '') {
        if (isNaN(parseInt(e.text))) {
          paramsF.addFilter('description', e.text, SearchFilter.ILIKE);
        } else {
          paramsF.addFilter('idWarehouse', e.text);
        }
      } else {
        paramsF.page = e.page;
      }
    }

    this.unitMessureService.getMedUnits(e ? paramsF.getParams() : '').subscribe(
      res => {
        console.log(res);
        const newData = res.data.map((e: any) => {
          return {
            ...e,
            labelValue: `${e.idWarehouse} - ${e.description}`,
          };
        });
        this.dataUnit = new DefaultSelect(newData, res.count);
      },
      err => {
        console.log(err);
        this.dataUnit = new DefaultSelect();
      }
    );
  }

  getCatalogTag(e?: ListParams, research?: boolean) {
    const paramsF = new FilterParams();
    if (e) {
      if (e.text != '') {
        if (isNaN(parseInt(e.text))) {
          paramsF.addFilter('description', e.text, SearchFilter.ILIKE);
        } else {
          paramsF.addFilter('id', e.text);
        }
      } else {
        paramsF.page = e.page;
      }
    }

    this.tagService.getAll(e ? paramsF.getParams() : '').subscribe(
      res => {
        console.log(res);
        const newData = res.data.map((e: any) => {
          return {
            ...e,
            labelValue: `${e.id} - ${e.description}`,
          };
        });
        this.dataTag = new DefaultSelect(newData, res.count);
        research ? this.targetTag.setValue(newData[0]) : '';
      },
      err => {
        this.dataTag = new DefaultSelect();
        console.log(err);
      }
    );
  }

  getCatalogGoodStatus(e?: ListParams, research?: boolean) {
    const paramsF = new FilterParams();
    if (e) {
      if (e.text.length < 4) {
        if (isNaN(parseInt(e.text))) {
          paramsF.addFilter('status', e.text.toUpperCase(), SearchFilter.ILIKE);
        } else {
          paramsF.addFilter('description', e.text, SearchFilter.ILIKE);
        }
      } else {
        paramsF.page = e.page;
      }
    }

    this.goodService.getStatusAll(e ? paramsF.getParams() : '').subscribe(
      res => {
        console.log(res);
        const newData = res.data.map((e: any) => {
          return {
            ...e,
            labelValue: `${e.status} - ${e.description}`,
          };
        });
        this.dataGoodStatus = new DefaultSelect(newData, res.count);
        research ? this.goodStatus.setValue(newData[0]) : '';
      },
      err => {
        this.dataGoodStatus = new DefaultSelect();
        console.log(err);
      }
    );
  }
}
