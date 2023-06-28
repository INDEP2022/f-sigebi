import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { MassiveConversionPermissionsComponent } from '../massive-conversion-permissions/massive-conversion-permissions.component';
import { COLUMNS } from './columns';

import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IpackageValidGood } from 'src/app/core/models/catalogs/Ipackage-valid-good';
import {
  IPackage,
  IPackageInfo,
} from 'src/app/core/models/catalogs/package.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { MassiveConversionErrorsModalComponent } from '../massive-conversion-erros-list/massive-conversion-errors-modal/massive-conversion-errors-modal.component';
import { MassiveConversionModalGoodComponent } from '../massive-conversion-modal-good/massive-conversion-modal-good.component';
interface ValidaButton {
  PB_VALIDA: boolean;
  PB_AUTORIZA: boolean;
  PB_CERRAR: boolean;
  PB_CANCELA: boolean;
}

@Component({
  selector: 'app-massive-conversion',
  templateUrl: './massive-conversion.component.html',
  styles: [],
})
export class MassiveConversionComponent extends BasePage implements OnInit {
  modalRef: BsModalRef;

  validaButton: ValidaButton = {
    PB_VALIDA: false,
    PB_AUTORIZA: false,
    PB_CERRAR: false,
    PB_CANCELA: false,
  };
  descData: {
    descDelegation: string;
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
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private packageGoodService: PackageGoodService,
    private bsModalRef: BsModalRef,
    private router: Router,
    private goodService: GoodService,
    private documentService: DocumentsService,
    private goodProcessService: GoodprocessService,
    private massiveGoodService: MassiveGoodService
  ) {
    super();

    //Tabla de PREVISUALIZACIÓN DE DATOS
    this.settings = {
      ...this.settings,
      actions: { add: false, delete: false, edit: false },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods());
    this.prepareForm();
  }
  generate() {}

  private prepareForm(): void {
    this.form = this.fb.group({
      //Primer form
      package: [null, [Validators.required]],
      packageType: ['', [Validators.required]],
      amountKg: [null, [Validators.required]],
      status: [null, [Validators.required]],

      //Segundo form
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

  add() {
    //this.openModal();
  }

  generateFoli() {}

  goToGoodTracker() {
    this.bsModalRef.hide();
    this.router.navigate(['/pages/general-processes/goods-tracker'], {
      queryParams: { origin: 'FACTADBUBICABIEN' },
    });
  }

  emitDelegation(delegation: any) {
    console.log(delegation, 'delegacion');
    this.descData.descDelegation = delegation;
  }

  edit(data: any) {
    //this.openModal({ edit: true, paragraph });
  }

  viewModal(type: string, size?: string) {
    const modals: Record<string, any> = {
      error: {
        config: {
          data: this.goodErrors,
        },
        component: MassiveConversionErrorsModalComponent,
      },
      good: {
        config: {
          data: this.form.value,
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
  }

  validateButtons(status: string) {
    console.log(status);
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
  }

  receiveInfo(information: any) {
    const {
      numberPackage,
      typePackage,
      amount,
      statuspack,
      unit,
      status,
      numberStore,
      InvoiceUniversal,
      cat_etiqueta_bien,
      numberDelegation,
      numberClassifyGood,
      trial785,
      numbertrainemiaut,
      paragraph1,
      paragraph2,
      paragraph3,
      dateApplied,
      dateCapture,
      dateCaptureHc,
      dateClosed,
      dateCancelled,
      useElaboration,
      useValid,
      useauthorize,
      useClosed,
      useApplied,
      useCancelled,
      numberGoodFather,
    } = information;
    this.form.patchValue({
      package: numberPackage,
      packageType: typePackage,
      amountKg: amount,
      status: statuspack,
      measurementUnit: unit,
      goodStatus: status,
      warehouse: numberStore,
      scanFolio: InvoiceUniversal,
      targetTag: cat_etiqueta_bien.labelNumber,
      delegation: numberDelegation,
      goodClassification: numberClassifyGood,
      trial785,
      transferent: numbertrainemiaut,
      paragraph1,
      paragraph2,
      paragraph3,
    });
    ///// Asignacion de fechas
    this.dates.elaborationDate = dateApplied;
    this.dates.validationDate = dateCapture;
    this.dates.authorizationDate = dateCaptureHc;
    this.dates.closingDate = dateClosed;
    this.dates.cancellationDate = dateCancelled;
    /////
    if (numberGoodFather) this.chargeForm2(numberGoodFather);
    if (InvoiceUniversal) this.generateFo = false;
    //Validacion de usuarios
    this.users.elaborationUSU = useElaboration;
    this.users.validationUSU = useValid;
    this.users.authorizationUSU = useauthorize;
    this.users.closingUSU = useClosed;
    this.users.applicationUSU = useApplied;
    this.users.cancellationUSU = useCancelled;
    ///////
    this.validateButtons(statuspack);
    this.packageNumber = numberPackage;
    this.getGoods();
  }
  // Aquí puedes realizar las acciones necesarias con la información recibida

  getGoods() {
    if (!this.packageNumber) return;
    this.loading = true;
    const newParams = new ListParams();
    newParams['filter.id'] = this.packageNumber;
    this.params.getValue()['filter.id'] = this.packageNumber;
    this.packageGoodService
      .getPaqDestinationDet(this.params.getValue())
      .subscribe(
        response => {
          this.goodsList = response.data;
          let dataMap = response.data.map((item: any) => {
            return {
              numberGood: item.numberGood,
              description: item.bienes.description,
              record: item.numberRecord,
              originalUnit: item.bienes.unit,
              originalAmount: item.amount,
            };
          });
          this.totalItems = response.count || 0;
          this.data.load(dataMap);
          this.loading = false;
        },
        error => (this.loading = false)
      );
  }

  chargeForm2(noGoodFather: string) {
    let params = new ListParams();
    params['filter.id'] = noGoodFather;
    this.goodService.getAll(params).subscribe(response => {
      console.log(response);
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
                  console.log('invoice universal 417');
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
              console.log('invoice universal 428' + lnuInvoiceUnoversal);

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

          console.log('invoice universal 428' + lnuInvoiceUnoversal);

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
    console.log(this.form.value);
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
              console.log(this.chValidateGood);
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
                console.log(goods);
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

  async pubValidaFilters(): Promise<boolean> {
    const fields = [
      {
        name: 'delegation',
        message: 'Debe ingresar la Coordinación que administra...',
      },
      {
        name: 'goodClassification',
        message: 'Debe ingresar el Clasificador...',
      },
      { name: 'targetTag', message: 'Debe ingresar la Etiqueta de destino...' },
      { name: 'goodStatus', message: 'Debe ingresar el Estatus...' },
      { name: 'transferent', message: 'Debe ingresar la Transferente...' },
      { name: 'warehouse', message: 'Debe ingresar el Almacén...' },
    ];

    for (const field of fields) {
      if (this.form.get(field.name).value === null) {
        await Swal.fire(field.message, 'A', 'error');
        return false;
      }
    }

    return true;
  }

  async verifyGoods() {
    await this.pubValidaFilters();
    await this.pubValidaGoods();
  }
  pubValidaGoods(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let IpackageValidGoods: IpackageValidGood = {
        pAlmacenNumber: this.form.get('warehouse').value,
        pDelegationNumber: this.form.get('delegation').value,
        pGoodClasifNumber: this.form.get('goodClassification').value,
        pEtiquetaNumber: this.form.get('targetTag').value,
        pPaqueteNumber: this.form.get('package').value,
        pStatus: this.form.get('goodStatus').value,
        pTypePaquete: this.form.get('packageType').value,
        pValidVal24: 21,
      };

      console.log('Linea 537', IpackageValidGoods);

      this.packageGoodService.pubValidGood(IpackageValidGoods).subscribe(
        response => {
          this.goodErrors = response.data;
          if (this.goodErrors.length > 0) {
            this.chValidateGood = false;
            Swal.fire('Existe inconsistencia en los bienes...', 'A', 'error');
          } else {
            this.chValidateGood = true;
            Swal.fire('Validación de bienes correcta...', 'A', 'success');
          }

          resolve(true); // Resuelve la promesa con valor `true`
        },
        error => {
          Swal.fire('Error', 'Error Al Validar los bienes', 'error');
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
        console.log(response);
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

  openPermissions(data: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: false,
    };
    this.modalService.show(MassiveConversionPermissionsComponent, modalConfig);
  }
}
