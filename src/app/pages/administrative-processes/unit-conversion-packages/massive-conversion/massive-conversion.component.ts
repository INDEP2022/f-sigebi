import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
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
import { LocalDataSource } from 'ng2-smart-table';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IpackageValidGood } from 'src/app/core/models/catalogs/Ipackage-valid-good';
import {
  IFoliovInvoice,
  IPackage,
  IPackageInfo,
} from 'src/app/core/models/catalogs/package.model';
import { IPerUser } from 'src/app/core/models/expedient/expedient.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
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
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  modalRef: BsModalRef;
  loadingText: string = '';
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
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  columnFilters: any = [];
  generateFo = true;
  packageNumber: string = '';
  chValidateGood = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  goodsList: any;
  VALIDA_VAL24: string;

  //VARIABLES PARA PAQUETES
  dataPackage = new DefaultSelect();
  statusPackage = new DefaultSelect([
    { name: 'Proyecto', value: 'P' },
    { name: 'Validado', value: 'V' },
    { name: 'Autorizado', value: 'A' },
    { name: 'Cerrado', value: 'C' },
    { name: 'Aplicado', value: 'S' },
    { name: 'Cancelado', value: 'X' },
  ]);

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private router: Router,
    private serviceUser: UsersService,
    private lotService: LotService,
    private goodService: GoodService,
    private documentService: DocumentsService,
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
    private unitConversionDataService: UnitConversionPackagesDataService
  ) {
    super();

    //Tabla de PREVISUALIZACIÓN DE DATOS
    this.settings = {
      ...this.settings,
      rowClassFunction: (row: { data: { available: any } }) =>
        row.data.available ? 'bg-success text-white' : 'bg-dark text-white',
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

  get goodStatus() {
    return this.form.get('goodStatus');
  }

  get measurementUnit() {
    return this.form.get('measurementUnit');
  }

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

  get dataPrevisualization() {
    return this.unitConversionDataService.dataPrevisualization;
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
      status: [null, [Validators.required]],
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
      measurementUnit: [null, [Validators.required]],
      transferent: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],

      //Pestaña de "ESCANEO"
      scanFolio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],

      //Pestaña de "PÁRRAFOS"
      paragraph1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraph2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //Párrrafo inicial
      paragraph3: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //Párrrafo final
    });

    //Formulario "NUEVO BIEN"
    this.form2 = this.fb.group({
      numberGood: [null, [Validators.required]],
      record: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      amount: [null, [Validators.required]],
      unit: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.required]],
      check: [false],
    });
  }
  //Datos de usuario logueado
  getDataUser() {
    const user =
      localStorage.getItem('username') == 'sigebiadmon'
        ? localStorage.getItem('username')
        : localStorage.getItem('username').toLocaleUpperCase();
    const routeUser = `?filter.name=$eq:${user}`;
    this.userService.getAllSegUsers(routeUser).subscribe(
      res => {
        const resJson = JSON.parse(JSON.stringify(res.data[0]));
        console.log(resJson.usuario.delegationNumber);
        this.dataUser.delegation = resJson.usuario.delegationNumber;
        const paramsF = new FilterParams();
        paramsF.addFilter('id', resJson.usuario.delegationNumber);
        this.delegationService.getFiltered(paramsF.getParams()).subscribe(
          res => {
            console.log(res['data'][0]['description']);
            this.dataUser.desDelegation = res['data'][0]['description'];
          },
          err => {
            console.log(err);
          }
        );
      },
      err => {}
    );
  }

  //Llenar valores por el no. paquete
  fillDataByPackage() {
    this.noPackage.valueChanges.subscribe(res => {
      console.log(res);
      if (res != null) {
        //Seteo de la primera parte
        this.cvePackage.setValue(res.cvePackage);
        this.descriptionPackage.setValue(res.description);
        this.packageType.setValue(res.typePackage);
        this.amountKg.setValue(res.amount);
        this.status.setValue(res.statuspack.toString().toLocaleUpperCase());
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
        this.delegation.setValue(res.numberDelegation);
        this.goodClassification.setValue(res.numberClassifyGood);
        this.targetTag.setValue(res.numberLabel);
        this.goodStatus.setValue(res.status);
        this.measurementUnit.setValue(res.unit);
        this.transferent.setValue(res.numbertrainemiaut);
        this.warehouse.setValue(res.numberStore);
        //Parrafos
        this.paragraph1.setValue(res.paragraph1);
        this.paragraph2.setValue(res.paragraph2);
        this.paragraph3.setValue(res.paragraph3);
        //Traer los bienes de pack_det
        this.unitConversionDataService.updatePrevisualizationData.next(true);
        this.validateButtons(res.statuspack.toString().toLocaleUpperCase());
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
        this.dataPackage = new DefaultSelect(res.data);
      },
      err => {
        console.log(err);
      }
    );
  }

  checkPer() {
    const paramsF = new FilterParams();
    paramsF.addFilter('screenKey', 'FMTOPAQUETE_0001');
    paramsF.addFilter('readingPermission', 'S');
    paramsF.addFilter('writingPermission', 'S');
    paramsF.addFilter(
      'user',
      localStorage.getItem('username') == 'sigebiadmon'
        ? localStorage.getItem('username')
        : localStorage.getItem('username').toLocaleUpperCase()
    );
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

    this.dynamicCatalogService.getPerUser(model).subscribe(
      res => {
        const resPer = res['data'][0]['otvalor'].split('-');
        const gPer = this.generalPermissions;
        gPer.Proyecto = resPer[0] == 'P' ? true : false;
        gPer.Validar = resPer[1] == 'V' ? true : false;
        gPer.Autorizar = resPer[2] == 'A' ? true : false;
        gPer.Cerrar = resPer[3] == 'C' ? true : false;
        gPer.Cancelar = resPer[4] == 'X' ? true : false;
      },
      err => {
        console.log(err);
      }
    );
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
          data: this.goodErrors,
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

    this.modalRef.content.onSentGoods.subscribe((result: any) => {
      this.modalEvent(result);
    });
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
    this.data.load(dataRes);
    this.totalItems = this.data.count();
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
        unit: response.data[0].unit,
        status: response.data[0].status,
      });
    });
  }

  showConfirmAlert() {
    if (!this.form.valid) {
      Swal.fire(`Faltan datos necesarios para validar ${this.form}`);
      return;
    }

    this.alertQuestion(
      'info',
      'Confirmación',
      '¿Está seguro de que el Paquete ya ha sido validado?'
    ).then(question => {
      if (question.isConfirmed) {
        this.verifyGoods();
        if (!this.chValidateGood) {
          Swal.fire('Existe inconsistencia en los bienes...', 'A', 'error');
        } else {
          let currentDate = new Date();
          let formattedDate = currentDate.toISOString().substring(0, 10);

          let packageUpdate: Partial<IPackage> = {
            numberPackage: this.form.value.package,
            statuspack: 'V',
            dateValid: formattedDate,
            useValid: 'USER',
          };

          this.updatePackage(packageUpdate, 'V');
        }
      }
    });
  }

  showAutorizateAlert() {
    if (!this.form.valid) {
      Swal.fire(`Existe inconsistencia en los bienes ${this.form}`);
      return;
    }

    this.alertQuestion(
      'info',
      'Confirmación',
      '¿Está seguro de que el Paquete ya ha sido autorizado?'
    ).then(question => {
      if (question.isConfirmed) {
        let lnuInvoiceUnoversal = 0;
        if (this.form.get('packageType').value != 3) {
          const newParams = new ListParams();
          newParams['filter.id'] = this.form.get('scanFolio').value;
          newParams['filter.scanStatus'] = 'ESCANEADO';

          const documentPromise = new Promise<void>((resolve, reject) => {
            this.documentService.getAll(newParams).subscribe(
              response => {
                if (response.data.length > 0) {
                  lnuInvoiceUnoversal = 1;
                }
                resolve();
              },
              error => {
                reject(error);
              }
            );
          });

          documentPromise
            .then(() => {
              if (
                lnuInvoiceUnoversal > 0 &&
                this.form.get('status').value == 'V'
              ) {
                this.verifyGoods();
                if (!this.chValidateGood) {
                  Swal.fire(
                    'Existe inconsistencia en los bienes...',
                    'A',
                    'error'
                  );
                } else {
                  let currentDate = new Date();
                  let formattedDate = currentDate
                    .toISOString()
                    .substring(0, 10);
                  let packageUpdate: Partial<IPackage> = {
                    numberPackage: this.form.value.package,
                    status: 'A',
                    dateValid: formattedDate,
                  };

                  this.updatePackage(packageUpdate, 'A');
                }
              }
            })
            .catch(error => {
              Swal.fire('Error', 'Error Al Validar el Paquete', 'error');
            });
        } else if (this.form.get('packageType').value == 3) {
          let lnuInvoiceUnoversal = 1;

          if (lnuInvoiceUnoversal > 0 && this.form.get('status').value == 'V') {
            this.verifyGoods();
            if (!this.chValidateGood) {
              Swal.fire('Existe inconsistencia en los bienes...', 'A', 'error');
            } else {
              let currentDate = new Date();
              let formattedDate = currentDate.toISOString().substring(0, 10);
              let packageUpdate: Partial<IPackage> = {
                numberPackage: this.form.value.package,
                statuspack: 'A',
                dateValid: formattedDate,
              };

              this.updatePackage(packageUpdate, 'A');
            }
          }
        }
      }
    });
  }

  updatePackage(packageUpdate: Partial<IPackage>, status: string) {
    this.packageGoodService
      .updatePaqDestinationEnc(packageUpdate.numberPackage, packageUpdate)
      .subscribe(
        response => {
          let statusMessage = '';

          switch (status) {
            case 'V':
              statusMessage = 'Validado';
              break;
            case 'A':
              statusMessage = 'Autorizado';
              break;
            case 'C':
              statusMessage = 'Cierre';
              break;
            default:
              statusMessage = '';
              break;
          }

          if (statusMessage !== '') {
            Swal.fire(statusMessage, '', 'success');
          }

          this.form.patchValue({
            status: status,
          });

          this.validateButtons(status);
        },
        error => {
          Swal.fire('Error', 'Error al validar el paquete', 'error');
        }
      );
  }

  showCloseAlert() {
    // Validar que todos los campos estén diligenciados
    if (this.form.get('packageType').value != 3) {
      if (this.form.get('scanFolio').value === null) {
        Swal.fire('Se debe tener el folio de escaneo', '', 'error');
      } else {
        this.alertQuestion(
          'info',
          'Confirmación',
          '¿Está seguro en cerrar el Paquete?'
        ).then(async question => {
          if (question.isConfirmed)
            if (this.form.get('amountKg').value <= 0) {
              Swal.fire(
                'Debe ingresar previamente la cantidad convertida.',
                '',
                'error'
              );
              // this.form.get('quantity').markAsTouched();
              ////this.pubValidaGoods();
            } else {
              if (this.chValidateGood == true) {
                Swal.fire(
                  'Existe inconsistencia en los bienes...',
                  'A',
                  'error'
                );
              } else {
                let res = await this.data.getAll();
                let goods = res.map((good: { numberGood: any }) => {
                  return good.numberGood;
                });
                let closeData = {
                  packageNumber: this.form.value.package,
                  packageUnit: this.form.value.measurementUnit,
                  packageStatus: this.form.value.status,
                  packageType: this.form.value.packageType,
                  user: 'sigebiadmon',
                  screenKey: 'FMTOPAQUETE',
                  amount: this.form.value.amountKg,
                  goodNumberArray: goods,
                  goodClasifNumber: this.form.value.goodClassification,
                };

                let currentDate = new Date();
                let formattedDate = currentDate.toISOString().substring(0, 10);
                this.goodProcessService
                  .packageClose(closeData)
                  .subscribe(response => {
                    this.updatePackage(
                      {
                        numberPackage: this.form.value.package,
                        statuspack: 'C',
                        dateValid: formattedDate,
                      },
                      'C'
                    );
                  });
              }
            }
        });
      }
    }
  }

  async verifyGoods() {
    console.log(this.data['data']);
    console.log('Sí');
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
      } else if (this.packageType.value == 3 && this.warehouse.value == null) {
        this.alert('warning', 'Debe ingresar el Almacén', '');
      } else {
        //Validacion de bienes
        if (this.data['data'].length > 0) {
          const check = document.getElementById(
            'checkGood'
          ) as HTMLInputElement;
          check.checked = true;
          const ch_bienes_ok = 1;
          this.VALIDA_VAL24 = 'S';
          for (const data of this.data['data']) {
            const resp = await this.validateGoods(data);
            const available = JSON.parse(JSON.stringify(resp)).res;
            const message = JSON.parse(JSON.stringify(resp)).msg;
            console.log(JSON.parse(JSON.stringify(resp)).res);
          }
        } else {
          this.alert('warning', 'No hay Bienes que verificar', '');
        }
      }
    }
  }

  validateGoods(good: any) {
    return new Promise((resolve, reject) => {
      const noPack = this.noPackage.value;
      let lv_DESC_ERROR = '';
      if (noPack.numberDelegation != good.bienes.delegationNumber) {
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
        noPack.typePackage != 3 &&
        noPack.numberStore != good.bienes.storeNumber
      ) {
        console.log({
          valpack: noPack.numberStore,
          valgood: good.bienes.storeNumber,
          good: good.bienes.goodId,
        });
        // resolve({ res: false, msg: 'store' });
        lv_DESC_ERROR +=
          (lv_DESC_ERROR.length > 0 ? '/' : '') + 'En el Almacén del bien.';
      }
      if (noPack.typePackage == 3) {
        /* if (this.VALIDA_VAL24 == 'S') {
        lv_valida = 'S';
        this.VALIDA_VAL24 = 'N';
        const check = document.getElementById(
          'checkGood'
        ) as HTMLInputElement;
        check.checked = false;
      }
      if (lv_valida != good.bienes.val24) {
        console.log({
          valpack: lv_valida,
          valgood: good.bienes.val24,
          good: good.bienes.goodId,
        });
      }else if(good.bienes.val24 == null){
        console.log('Es nulo')
      }*/
        resolve({ res: false, msg: 'break' });
      }
      if (lv_DESC_ERROR.length > 0) {
        resolve({ res: false, msg: lv_DESC_ERROR });
      } else {
        resolve({ res: true, msg: '' });
      }
    });
  }

  pubValidaGoods(val24: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let IpackageValidGoods: IpackageValidGood = {
        pAlmacenNumber: this.warehouse.value,
        pDelegationNumber: this.delegation.value,
        pGoodClasifNumber: this.goodClassification.value,
        pEtiquetaNumber: this.targetTag.value,
        pPaqueteNumber: this.noPackage.value.numberPackage,
        pStatus: this.goodStatus.value,
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
      amountGood: this.form2.get('amount').value,
      goodFatherNumber: this.form2.get('numberGood').value,
      delegationNumber: this.form.get('delegation').value,
      descGood: this.form2.get('description').value,
      statusGood: this.form2.get('status').value,
      packageNumber: this.form.get('package').value,
      proceedingNumber: this.form2.get('record').value,
      unitGood: this.form2.get('unit').value,
    };

    this.massiveGoodService.pubExport(iPackage).subscribe(
      response => {
        this.convertAndDownloadExcel(response.base64File, response.fileName);
        Swal.fire('Exito', 'Se genero el archivo excel', 'success');
      },
      error => {
        Swal.fire('Error', 'Error Al generar el archivo excel', 'error');
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

  cancelPackage() {
    this.alertQuestion(
      'warning',
      'Cancelar',
      '¿Desea cancelar este paquete?'
    ).then(question => {
      if (question.isConfirmed) {
        let data = {
          goodNumber: this.form2.get('numberGood').value,
          packageNumber: this.form.get('package').value,
          user: 'DR_SIGEBI',
          toolbarUsername: 'DR_SIGEBI',
          statusPaq: this.form.get('status').value,
          parentGoodNumber: this.form2.get('numberGood').value,
          status: this.form2.get('status').value,
        };
        this.lotService.pubCancelPackage(data).subscribe(
          response => {
            Swal.fire('Exito', 'Se cancelo el paquete', 'success');
          },
          error => {
            Swal.fire('Error', 'Error Al cancelar el paquete', 'error');
          }
        );
      }
    });
  }

  getUsername() {
    const user =
      localStorage.getItem('username') == 'sigebiadmon'
        ? localStorage.getItem('username')
        : localStorage.getItem('username').toLocaleUpperCase();
    return user;
  }

  downloadReport() {
    let params: any = {};
    params['NO_PAQUETE'] = this.form.get('package').value;

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
    if (!this.generalPermissions.Proyecto) {
      this.alert(
        'warning',
        'No cuenta con privilegios',
        'No cuenta con privilegios para guardar un nuevo paquete'
      );
    } else if (this.packageType.value == null) {
      this.alert('warning', 'Debe especificar el tipo de paquete', '');
    } else if (this.delegation.value == null) {
      this.alert('warning', 'Debe ingresar la coordinación que administra', '');
    } else if (this.goodClassification.value == null) {
      this.alert('warning', 'Debe ingresar el Clasificador', '');
    } else if (this.targetTag.value == null) {
      this.alert('warning', 'Debe ingresar la Etiqueta de destino', '');
    } else if (this.goodStatus.value == null) {
      this.alert('warning', 'Debe ingresar el Estatus', '');
    } else if (this.transferent.value == null) {
      this.alert('warning', 'Debe ingresar la Transferente', '');
    } else if (this.packageType.value != 3) {
      if (this.warehouse.value == null) {
        this.alert('warning', 'Debe ingresar el Almacén', '');
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
    paramsF.addFilter('id', this.transferent.value);
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
            let edo = JSON.parse(JSON.stringify(res));
            console.log(edo);
            const paramsF2 = new FilterParams();
            paramsF2.addFilter('numberDelegation2', this.delegation.value);
            paramsF2.addFilter('stageedo', edo.stagecreated);
            this.rNomenclaService.getRNomencla(paramsF2.getParams()).subscribe(
              res => {
                v_administra = JSON.parse(
                  JSON.stringify(res['data'][0])
                ).delegation;

                const resJson = JSON.parse(JSON.stringify(res.data[0]));
                const paramsF3 = new FilterParams();
                paramsF3.addFilter('stageedo', edo.stagecreated);
                paramsF3.addFilter3(
                  'numberDelegation2',
                  this.dataUser.delegation
                );
                this.rNomenclaService
                  .getRNomencla(paramsF3.getParams())
                  .subscribe(
                    res => {
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
                        }
                      );
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
          });
      },
      err => {
        console.log(err);
        v_clave = 'XXX';
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
      numberClassifyGood: this.goodClassification.value,
      numberLabel: this.targetTag.value,
      unit: this.measurementUnit.value,
      numberStore: null,
      numberRecord: null,
      status: this.goodStatus.value,
      numbertrainemiaut: this.transferent.value,
      dateValid: null,
      dateauthorize: null,
      dateClosed: null,
      dateApplied: null,
      cvePackage: this.cvePackage.value,
      dateCancelled: null,
      InvoiceUniversal: 0,
      paragraph1: null,
      paragraph2: null,
      paragraph3: null,
      numberDelegation: this.delegation.value,
      useElaboration: user,
      useValid: null,
      useauthorize: null,
      useClosed: null,
      useApplied: null,
      useCancelled: null,
      numberGoodFather: 0,
      nbOrigin: '',
    };
    console.log(model);
    this.status.setValue('P');
    this.fecElab.setValue(format(new Date(), 'yyyy-MM-dd'));
    this.userElab.setValue(user);

    this.packageGoodService.insertPaqDestionarioEnc(model).subscribe(
      res => {
        console.log(res);
        this.alert('success', 'Se creo nuevo paquete', '');
      },
      err => {
        console.log(err);
      }
    );
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
      }
    } else if (status == 'C') {
      if (this.generalPermissions.Cancelar) {
        vBtn.PB_CANCELA = true;
      }
    }
  }

  //Cargar bienes
  selectGoods() {
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      class: 'modal-lg modal-dialog-centered',
    };
    this.modalService.show(MassiveConversionSelectGoodComponent, modalConfig);
  }
}
