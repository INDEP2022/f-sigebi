import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IJuridicalDocumentManagementParams } from 'src/app/pages/juridical-processes/file-data-update/interfaces/file-data-update-parameters';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FlyersService } from '../services/flyers.service';
import {
  IDataGoodsTable,
  RELATED_DOCUMENTS_COLUMNS_GOODS,
} from './related-documents-columns';
import {
  MANAGEMENTOFFICESTATUSSEND,
  PARAMETERSALEC,
  TEXT1,
  TEXT1Abandono,
  TEXT2,
} from './related-documents-message';
import { RelatedDocumentsService } from './services/related-documents.service';

@Component({
  selector: 'app-related-documents',
  templateUrl: './related-documents.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: 0;
        padding-top: 0;
      }
      .disabled[disabled] {
        color: red;
      }
    `,
  ],
})
export class RelatedDocumentsComponent extends BasePage implements OnInit {
  managementForm: FormGroup;
  select = new DefaultSelect();
  justificacion = new DefaultSelect();
  goodTypes = new DefaultSelect();
  cities = new DefaultSelect();
  senders = new DefaultSelect();
  ClasifSubTypeGoods = new DefaultSelect();
  dataGoodFilter: IGood[] = [];
  dataGood: IDataGoodsTable[] = [];
  dataGoodTable: LocalDataSource = new LocalDataSource();
  pantalla = (option: boolean) =>
    `${
      option == true
        ? '"Oficio de Gestión por Dictamen"'
        : '"Oficio Gestión Relacionados"'
    }.`;
  pantallaOption: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsGestionDictamen: IJuridicalDocumentManagementParams = {
    volante: null,
    expediente: null,
    doc: null,
    tipoOf: null,
    sale: '',
    bien: '',
    pGestOk: null,
    pNoTramite: null,
    pDictamen: null,
  };
  se_refiere_a = {
    A: 'Se refiere a todos los bienes',
    B: 'Se refiere a algun(os) bien(es) del expediente',
    C: 'No se refiere a nigun bien asegurado, decomisado o abandonado',
    D: 'd',
  };
  se_refiere_a_Disabled = {
    A: false,
    B: false,
    C: false,
    D: false,
  };
  variables = {
    dictamen: '',
    b: '',
    d: '',
    dictaminacion: '',
    clasif: '',
    clasif2: '',
    delito: '',
    todos: '',
    doc_bien: '',
    proc_doc_dic: '',
  };
  pantallaActual: string = '';
  disabledRadio: boolean = false;
  oficioGestion: IMJobManagement;
  disabledAddresse: boolean = false;
  screenKeyManagement: string = 'FACTADBOFICIOGEST';
  screenKeyRelated: string = '';
  screenKey: string = '';
  notificationData: INotification;
  loadingGoods: boolean = false;

  constructor(
    private fb: FormBuilder,
    private flyerService: FlyersService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceRelatedDocumentsService: RelatedDocumentsService
  ) {
    super();
    RELATED_DOCUMENTS_COLUMNS_GOODS.seleccion = {
      ...RELATED_DOCUMENTS_COLUMNS_GOODS.seleccion,
      onComponentInitFunction: this.onClickSelect,
    };
    RELATED_DOCUMENTS_COLUMNS_GOODS.improcedente = {
      ...RELATED_DOCUMENTS_COLUMNS_GOODS.improcedente,
      onComponentInitFunction: this.onClickImprocedente,
    };
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...RELATED_DOCUMENTS_COLUMNS_GOODS },
    };
  }

  onClickSelect(event: any) {
    event.toggle.subscribe((data: any) => {
      console.log(data);
      data.row.seleccion = data.toggle;
    });
  }

  onClickImprocedente(event: any) {
    console.log(event);
    event.toggle.subscribe((data: any) => {
      console.log(data);
      data.row.improcedente = data.toggle;
    });
  }

  ngOnInit(): void {
    this.setInitVariables();
    this.prepareForm();
    this.pantallaActual = this.route.snapshot.paramMap.get('id');
    if (!this.pantallaActual) {
      this.router.navigateByUrl('/pages/');
      return;
    } else {
      if (this.pantallaActual == '2' || this.pantallaActual == '1') {
        this.setDataParams();
        this.pantallaOption = this.flyerService.getPantallaOption(
          this.pantallaActual
        );
        let params = this.flyerService.getParams(true);
        console.log(params, this.pantallaOption, this.pantallaActual);
        this.paramsGestionDictamen.sale = 'C';
        // if (params['parametros']) {
        if (this.pantallaOption) {
          this.screenKey = this.screenKeyManagement;
          // this.getDictationByWheel();
          // Pantalla dictamen
          this.initComponentDictamen();
        } else {
          this.screenKey = this.screenKeyRelated;
          // Pantalla relacionados
        }
        // } else {
        //   this.alert(
        //     'warning',
        //     'No existen parámetros para la pantalla',
        //     'Sin parametros'
        //   );
        // }
      } else {
        this.alertInfo(
          'warning',
          'Opción no disponible',
          'Esta pantalla no existe en el sistema.'
        ).then(() => {
          this.router.navigateByUrl('/pages/');
        });
      }
    }
  }

  setInitVariables() {
    this.paramsGestionDictamen = {
      expediente: 32440,
      volante: 1558043,
      pDictamen: '10',
      pNoTramite: 1044254,
      tipoOf: 'EXTERNO',
      bien: 'N',
      sale: 'D',
      doc: 'N',
      pGestOk: null,
    };
    // {
    //   volante: 1557802,
    //   expediente: 619252,
    //   doc: null,
    //   tipoOf: null,
    //   sale: '',
    //   bien: '',
    //   pGestOk: null,
    //   pNoTramite: null,
    //   pDictamen: null,
    // };
    this.variables = {
      dictamen: '',
      b: '',
      d: '',
      dictaminacion: '',
      clasif: '',
      clasif2: '',
      delito: '',
      todos: '',
      doc_bien: '',
      proc_doc_dic: '',
    };
    this.notificationData = null;
  }

  setDataParams() {
    let paramsData = this.serviceRelatedDocumentsService.getParams(
      this.pantallaActual
    );
    if (paramsData != false && paramsData) {
      if (this.pantallaActual == '1') {
        // this.paramsGestionDictamen = paramsData;
      } else {
        console.log(paramsData);
      }
    }
    console.log(paramsData, this.paramsGestionDictamen);
    this.managementForm
      .get('noVolante')
      .setValue(this.paramsGestionDictamen.volante);
    this.managementForm
      .get('noExpediente')
      .setValue(this.paramsGestionDictamen.expediente);
    this.managementForm
      .get('tipoOficio')
      .setValue(this.paramsGestionDictamen.tipoOf);
    this.managementForm.updateValueAndValidity();
  }

  prepareForm() {
    this.managementForm = this.fb.group({
      noVolante: [null, [Validators.required, Validators.maxLength(11)]],
      noExpediente: [null, [Validators.required, Validators.maxLength(11)]],
      tipoOficio: [null, [Validators.required, Validators.maxLength(20)]],
      relacionado: [
        { value: '', disabled: true },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(15)],
      ],
      numero: [{ value: '', disabled: true }, [Validators.maxLength(40)]],
      cveGestion: [null],
      noRemitente: [null],
      remitente: [null],
      noDestinatario: [null],
      destinatario: [null],
      noCiudad: [null],
      ciudad: [null],
      claveOficio: [null],
      parrafoInicial: [null, Validators.pattern(STRING_PATTERN)],
      tipoTexto: [null],
      justificacion: [null, Validators.pattern(STRING_PATTERN)],
      justificacionDetalle: [null],
      noOficio: [null],
      subtipo: [null],
      goodTypes: [null],
      improcedente: [false],
      // indPDoctos: [null],
      noBienes: [null],
      // bienes: [null],
      noBienes2: [null],
      // bienes2: [null],
      noDocumento: [null],
      // documento: [null],
      noDocumento2: [null],
      // documento2: [null],
      parrafoFinal: [null, Validators.pattern(STRING_PATTERN)],
      text3: [null, Validators.pattern(STRING_PATTERN)],
      // parrafoAusencia: [null, Validators.pattern(STRING_PATTERN)],
      fechaAcuse: [{ value: '', disabled: true }],
      ccp: [null],
      ccp2: [null],
      ccp3: [null],
      ccp4: [null],
      ccp5: [null],
      ccp6: [null],
    });
  }

  initComponentDictamen() {
    this.getNotificationData();
    // if (
    //   this.managementForm.get('numero').value ||
    //   this.managementForm.get('numero').value == '0' ||
    //   this.managementForm.get('numero').value == 0
    // ) {
    //   this.validOficioGestion();
    // } else {
    //   this.alert(
    //     'warning',
    //     'No existe un valor para Número de Gestión',
    //     'Sin valor'
    //   );
    // }
  }

  async validOficioGestion() {
    const params = new FilterParams();
    params.addFilter(
      'managementNumber',
      this.managementForm.get('numero').value
    );
    params.addFilter('jobBy', 'POR DICTAMEN');
    await this.flyerService.getMOficioGestion(params.getParams()).subscribe({
      next: res => {
        console.log(res);
        if (res.count == 0) {
          // this.getDictationByWheel();
        } else {
          this.oficioGestion = res.data[0];
          this.setDataOficioGestion();
          // Se tiene el registro
          this.initFormFromImages();
        }
      },
      error: err => {
        console.log(err);
        // this.getDictationByWheel();
      },
    });
  }

  setDataOficioGestion() {
    this.managementForm.get('tipoOficio').setValue(this.oficioGestion.jobType);
    this.managementForm.get('relacionado').setValue(this.oficioGestion.jobBy);
    this.managementForm
      .get('numero')
      .setValue(this.oficioGestion.managementNumber);
    this.managementForm
      .get('cveGestion')
      .setValue(this.oficioGestion.cveManagement);
    // Set remitente, destinatario y ciudad
    this.managementForm
      .get('parrafoInicial')
      .setValue(this.oficioGestion.text1);
    this.managementForm.get('parrafoFinal').setValue(this.oficioGestion.text2);
    this.managementForm.get('text3').setValue(this.oficioGestion.text3);
    this.managementForm
      .get('justificacionDetalle')
      .setValue(this.oficioGestion.justification);
    this.managementForm
      .get('justificacion')
      .setValue(this.oficioGestion.justification);
  }

  reviewParametersGestion() {
    if (this.paramsGestionDictamen.sale == 'C') {
      // A, B, D
      if (this.se_refiere_a.C == this.managementForm.get('tipoOficio').value) {
        return true;
      } else {
        return false;
      }
    } else if (this.paramsGestionDictamen.sale == 'D') {
      // C
      if (this.se_refiere_a.C == this.managementForm.get('tipoOficio').value) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  async getDictationByWheel() {
    if (
      this.managementForm.get('noVolante').invalid ||
      this.managementForm.get('noExpediente').invalid
    ) {
      return;
    }
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('wheelNumber', this.managementForm.get('noVolante').value);
    params.addFilter(
      'expedientNumber',
      this.managementForm.get('noExpediente').value
    );
    await this.flyerService
      .getNotificationByFilter(params.getParams())
      .subscribe({
        next: res => {
          console.log(res);
        },
        error: err => {
          console.log(err);
        },
      });
  }

  initFormFromImages() {
    // SET VARIABLES
    console.log('set vars');
  }

  validOficioEXTERNO() {
    if (
      this.managementForm.get('tipoOficio').value == 'EXTERNO' // &&
      // this.paramsGestionDictamen.pllamo != 'ABANDONO'
    ) {
      this.managementForm
        .get('parrafoInicial')
        .setValue(TEXT1(this.managementForm.get('noOficio').value));
      this.managementForm.get('parrafoFinal').setValue(TEXT2);
    } else if (
      this.managementForm.get('tipoOficio').value == 'EXTERNO' // &&
      // this.paramsGestionDictamen.pllamo == 'ABANDONO'
    ) {
      this.managementForm.get('parrafoInicial').setValue(TEXT1Abandono);
      this.managementForm.get('parrafoFinal').setValue('SASASASASAS');
    } else {
      this.disabledRadio = true;
    }
  }

  changeSender() {
    if (this.managementForm.get('tipoOficio').value == 'EXTERNO') {
      this.managementForm.get('destinatario').disable();
      this.managementForm.get('destinatario').updateValueAndValidity();
      this.disabledAddresse = true;
    } else if (this.managementForm.get('tipoOficio').value == 'INTERNO') {
      this.managementForm.get('destinatario').enable();
      this.managementForm.get('destinatario').updateValueAndValidity();
      this.disabledAddresse = false;
    } else {
      this.managementForm.get('destinatario').enable();
      this.managementForm.get('destinatario').updateValueAndValidity();
      this.disabledAddresse = false;
    }
  }

  changeTextType() {
    let textRespone = this.serviceRelatedDocumentsService.changeTextType(
      this.managementForm.get('tipoTexto').value,
      this.managementForm.get('noOficio').value
    );
    this.managementForm.get('parrafoInicial').setValue(textRespone.text1);
    this.managementForm.get('parrafoFinal').setValue(textRespone.text2);
  }

  changeOffice() {
    if (this.paramsGestionDictamen.sale == 'C') {
      this.alertInfo('warning', PARAMETERSALEC, '');
      return;
    }
    if (this.oficioGestion.statusOf == 'ENVIADO') {
      this.alertInfo('warning', MANAGEMENTOFFICESTATUSSEND, '');
      return;
    }
    if (this.oficioGestion.managementNumber) {
      // /api/v1/m-job-management por numero de gestion
      // ### si tiene registros se eliminan  --- y se hace LIP_COMMIT_SILENCIOSO;
      this.getGoodsJobManagement();
      // /api/v1/document-job-management por numero de gestion
      // ### si tiene registros se eliminan  --- y se hace LIP_COMMIT_SILENCIOSO;  ---  y setea VARIABLES.D en S
      ///
      /// se refiere a --- activa opcion A y B
      ///
      this.se_refiere_a_Disabled.A = false;
      this.se_refiere_a_Disabled.B = false;
    }
    if (this.paramsGestionDictamen.sale == 'D') {
      this.se_refiere_a_Disabled.C = false;
    } else {
      this.se_refiere_a_Disabled.C = true;
    }
    // y setea VARIABLES.B en N
  }

  async getGoodsJobManagement() {
    if (this.oficioGestion.managementNumber) {
      const params = new FilterParams();
      params.removeAllFilters();
      params.addFilter('managementNumber', this.oficioGestion.managementNumber);
      await this.flyerService.getMOficioGestion(params.getParams()).subscribe({
        next: res => {
          console.log(res);
          if (res.count != 0) {
            this.managementForm.get('tipoOficio').setValue('D');
          }
          this.getDocumentsJobManagement();
        },
        error: err => {
          console.log(err);
          this.getDocumentsJobManagement();
        },
      });
    } else {
      this.alertInfo(
        'warning',
        'No existe el Número de Gestión: ' +
          this.oficioGestion.managementNumber,
        ''
      );
    }
  }

  async getDocumentsJobManagement() {
    // if (this.oficioGestion.managementNumber) {
    //   const params = new FilterParams();
    //   params.removeAllFilters();
    //   params.addFilter('managementNumber', this.oficioGestion.managementNumber);
    //   await this.flyerService
    //     .getGoodsJobManagement(params.getParams())
    //     .subscribe({
    //       next: res => {
    //         console.log(res);
    //         if (res.count != 0) {
    //           this.variables.d = 'S';
    //         }
    //         this.getGoods();
    //       },
    //       error: err => {
    //         this.getGoods();
    //         console.log(err);
    //       },
    //     });
    // } else {
    //   this.alertInfo(
    //     'warning',
    //     'No existe el Número de Gestión: ' +
    //       this.oficioGestion.managementNumber,
    //     ''
    //   );
    // }
  }

  // INCIDENCIAS 675 Y 681 --- INTEGRADO
  async getGoods() {
    this.loadingGoods = true;
    this.dataGood = [];
    let objBody: any = {
      screenKey: this.screenKey,
    };
    // Validar con tipos de notificaciones
    if (
      this.managementForm.get('goodTypes').value == '' ||
      this.managementForm.get('goodTypes').value == 'null' ||
      this.managementForm.get('goodTypes').value == null
    ) {
      // Por expediente
      objBody['fileNumber'] = this.notificationData.expedientNumber;
    } else {
      // Por número de clasificación
      objBody['clasifGoodNumber'] = this.managementForm.get('goodTypes').value;
    }
    await this.flyerService
      .getGoodSearchGoodByFileAndClasif(
        objBody,
        objBody,
        objBody['fileNumber'] ? 'file' : ''
      )
      .subscribe({
        next: res => {
          console.log(res);
          // this.dataGood = res.data;
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            if (element) {
              this.dataGood.push({
                goodId: element.goodId,
                description: element.description,
                quantity: element.quantity,
                identifier: element.identifier,
                status: element.status,
                desEstatus: '',
                seleccion: false,
                improcedente: false,
                disponible: true,
              });
            }
          }
          this.reviewGoodData(this.dataGood[0], 0, res.count);
        },
        error: err => {
          console.log(err);
        },
      });
  }

  reviewGoodData(dataGoodRes: IDataGoodsTable, count: number, total: number) {
    this.getGoodStatusDescription(dataGoodRes, count, total);
  }

  // AGREGAR UN FOR PARA LOS BIENES
  async getGoodStatusDescription(
    dataGoodRes: IDataGoodsTable,
    count: number,
    total: number
  ) {
    const params = new ListParams();
    params['filter.status'] = '$eq:' + dataGoodRes.status;
    console.log(params, this.dataGood);
    await this.flyerService.getGoodStatusDescription(params).subscribe({
      next: res => {
        console.log(res);
        console.log('params, ', this.dataGood);
        this.dataGood[count].desEstatus = res.data[0].description;
        this.getAvailableGood(this.dataGood[count], count, total);
      },
      error: err => {
        console.log(err);
        console.log('params, ', this.dataGood);
        this.dataGood[count].desEstatus = 'Error al cargar la descripción.';
        this.getAvailableGood(this.dataGood[count], count, total);
      },
    });
  }

  changeImprocedente(event: any) {
    this.dataGood.forEach(element => {
      if (element.disponible) {
        element.improcedente = event.checked;
        element.seleccion = false;
      }
    });
    this.dataGoodTable.load(this.dataGood);
    this.dataGoodTable.refresh();
  }

  async getAvailableGood(
    dataGoodRes: IDataGoodsTable,
    count: number,
    total: number
  ) {
    if (this.oficioGestion) {
      await this.flyerService
        .getGoodsJobManagementByIds({
          goodNumber: dataGoodRes.goodId,
          managementNumber: this.oficioGestion.managementNumber,
        })
        .subscribe({
          next: res => {
            console.log(res);
            if (res.count > 0) {
              this.dataGood[count].disponible = false;
            }
            this.validStatusGood(this.dataGood[count], count, total);
          },
          error: err => {
            console.log(err);
            this.dataGood[count].disponible = true;
            this.validStatusGood(this.dataGood[count], count, total);
          },
        });
    } else {
      this.dataGood[count].disponible = true;
      this.validStatusGood(this.dataGood[count], count, total);
    }
  }

  async validStatusGood(
    dataGoodRes: IDataGoodsTable,
    count: number,
    total: number
  ) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('goodNumber', dataGoodRes.goodId);
    await this.flyerService
      .getGoodExtensionsFields(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log(res);
          if (res.data[0].managementJob == '1') {
            this.dataGood[count].seleccion = true;
            this.dataGood[count].improcedente = false;
          } else if (res.data[0].managementJob == '2') {
            this.dataGood[count].seleccion = false;
            this.dataGood[count].improcedente = true;
          } else {
            this.dataGood[count].seleccion = false;
            this.dataGood[count].improcedente = false;
          }
          count++;
          if (total > count) {
            this.reviewGoodData(this.dataGood[count], count, total);
          } else if (total == count) {
            this.dataGoodTable.load(this.dataGood);
            this.dataGoodTable.refresh();
            this.loadingGoods = false;
          }
        },
        error: err => {
          console.log(err);
          this.dataGood[count].seleccion = false;
          this.dataGood[count].improcedente = false;
          count++;
          if (total > count) {
            this.reviewGoodData(this.dataGood[count], count, total);
          } else if (total == count) {
            this.dataGoodTable.load(this.dataGood);
            this.dataGoodTable.refresh();
            this.loadingGoods = false;
          }
        },
      });
  }

  async getNotificationData() {
    if (
      this.paramsGestionDictamen.volante ||
      this.paramsGestionDictamen.expediente
    ) {
      const params = new FilterParams();
      params.removeAllFilters();
      params.addFilter('wheelNumber', this.paramsGestionDictamen.volante);
      if (this.paramsGestionDictamen.expediente) {
        params.addFilter(
          'expedientNumber',
          this.paramsGestionDictamen.expediente
        );
      }
      await this.flyerService
        .getNotificationByFilter(params.getParams())
        .subscribe({
          next: res => {
            console.log(res);
            this.notificationData = res.data[0];
            this.setDataNotification();
          },
          error: err => {
            console.log(err);
          },
        });
    } else {
      this.alertInfo(
        'warning',
        'No existe el Número de Expediente: ' +
          this.paramsGestionDictamen.expediente +
          ' ni el Número de Volante: ' +
          this.paramsGestionDictamen.volante +
          ' para consultar la información.',
        ''
      );
    }
  }

  setDataNotification() {
    this.managementForm
      .get('noOficio')
      .setValue(this.notificationData.officeExternalKey);
    this.managementForm
      .get('fechaAcuse')
      .setValue(this.notificationData.desKnowingDate);
    this.getGoods();
  }

  /**
   * Data Selects
   */

  // INCIDENCIA 726 ---   ### CARGAR SUBTIPOS
  /**
   * Obtener el listado de Clasif --- Sub Tipo --- Ssub tipo --- Sssubtipo
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  async getClasifSubTypeGoods(paramss: ListParams) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('clasifGood', paramss['search'], SearchFilter.LIKE);
    await this.flyerService
      .getClasifSubTypeGoods(this.notificationData.expedientNumber)
      .subscribe({
        next: res => {
          this.goodTypes = new DefaultSelect(
            res.data.map(i => {
              i.clasifGood =
                i.clasifGoodNumber +
                ' -- ' +
                i.subtypeDesc +
                ' -- ' +
                i.ssubtypeDesc +
                ' -- ' +
                i.sssubtypeDesc;
              return i;
            })
          );
        },
        error: err => {
          console.log(err);
          this.goodTypes = new DefaultSelect();
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al consultar los subtipos'
          );
        },
      });
  }

  /**
   * INCIDENCIA 581 --- CORRECTO
   * @returns
   */
  getJustification(paramsData: ListParams) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('type', 3, SearchFilter.NOT);
    params.addFilter('clarifications', paramsData['search'], SearchFilter.LIKE);
    let subscription = this.flyerService
      .getJustificacion(params.getFilterParams())
      .subscribe({
        next: data => {
          console.log(data);
          this.justificacion = new DefaultSelect(
            data.data.map(i => {
              i.clarifications = '#' + i.id + ' -- ' + i.clarifications;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: err => {
          this.justificacion = new DefaultSelect();
          console.log(err);
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al consultar las Justificaciones'
          );
          subscription.unsubscribe();
        },
      });
  }

  /**
   * Obtener el listado de Ciudad de acuerdo a los criterios de búsqueda
   * @param paramsData Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getCityByDetail(paramsData: ListParams) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('nameCity', paramsData['search'], SearchFilter.LIKE);
    let subscription = this.flyerService
      .getCityBySearch(params.getFilterParams())
      .subscribe({
        next: data => {
          this.cities = new DefaultSelect(
            data.data.map(i => {
              i.nameCity = '#' + i.idCity + ' -- ' + i.nameCity;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: error => {
          this.cities = new DefaultSelect();
          this.onLoadToast('error', 'Error', error.error.message);
          subscription.unsubscribe();
        },
      });
  }

  /**
   * Obtener el listado de Remitente
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getSenderByDetail(params: ListParams) {
    params.take = 20;
    params['order'] = 'DESC';
    let subscription = this.flyerService.getSenderUser(params).subscribe({
      next: data => {
        console.log(data);
        this.senders = new DefaultSelect(
          data.data.map(i => {
            i.userDetail.name =
              '#' + i.userDetail.id + ' -- ' + i.userDetail.name;
            return i.userDetail;
          }),
          data.count
        );
        subscription.unsubscribe();
      },
      error: error => {
        this.senders = new DefaultSelect();
        this.onLoadToast('error', 'Error', error.error.message);
        subscription.unsubscribe();
      },
    });
  }

  public send(): void {
    this.loading = true;
    // const pdfurl =
    //   `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGENADBNUMEFISICO.pdf?PARAMFORM=NO&DESTYPE=` +
    //   this.managementForm.controls['screenKey'].value +
    //   `&NO_OF_GES=` +
    //   this.managementForm.controls['numero'].value +
    //   `&TIPO_OF=` +
    //   this.managementForm.controls['tipoOficio'].value +
    //   `&VOLANTE=` +
    //   this.managementForm.controls['noVolante'].value +
    //   `&EXP=` +
    //   this.managementForm.controls['noExpediente'].value +
    //   `&ESTAT_DIC=` +
    //   this.oficioGestion.statusOf;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.managementForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }
}
