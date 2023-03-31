import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IJuridicalDocumentManagementParams } from 'src/app/pages/juridical-processes/file-data-update/interfaces/file-data-update-parameters';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FlyersService } from '../services/flyers.service';
import {
  RELATED_DOCUMENTS_COLUMNS,
  RELATED_DOCUMENTS_EXAMPLE_DATA,
} from './related-documents-columns';
import { TEXT1, TEXT1Abandono, TEXT2 } from './related-documents-message';
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
  cities = new DefaultSelect();
  senders = new DefaultSelect();
  data = RELATED_DOCUMENTS_EXAMPLE_DATA;
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

  constructor(
    private fb: FormBuilder,
    private flyerService: FlyersService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceRelatedDocumentsService: RelatedDocumentsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...RELATED_DOCUMENTS_COLUMNS },
    };
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
          this.getDictationByWheel();
          // // Pantalla dictamen
          // this.initComponentDictamen();
        } else {
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
    // {
    //   parametros: null,
    //   p_gest_ok: null,
    //   p_no_tramite: null,
    //   tipo_of: null,
    //   sale: null,
    //   doc: null,
    //   bien: null,
    //   volante: '1557802',
    //   expediente: '619252',
    //   pllamo: null,
    //   p_dictamen: null,
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
  }

  setDataParams() {
    this.managementForm
      .get('noVolante')
      .setValue(this.paramsGestionDictamen.volante);
    this.managementForm
      .get('noExpediente')
      .setValue(this.paramsGestionDictamen.expediente);
  }

  prepareForm() {
    this.managementForm = this.fb.group({
      noVolante: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      tipoOficio: [null],
      relacionado: [null, Validators.pattern(STRING_PATTERN)],
      numero: [],
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
      justificacion: [null],
      justificacionDetalle: [null],
      noOficio: [null],
      subtipo: [null],
      indPDoctos: [null],
      noBienes: [null],
      bienes: [null],
      noBienes2: [null],
      bienes2: [null],
      noDocumento: [null],
      documento: [null],
      noDocumento2: [null],
      documento2: [null],
      parrafoFinal: [null, Validators.pattern(STRING_PATTERN)],
      text3: [null, Validators.pattern(STRING_PATTERN)],
      parrafoAusencia: [null, Validators.pattern(STRING_PATTERN)],
      ccp: [null],
      ccp2: [null],
      ccp3: [null],
      ccp4: [null],
      ccp5: [null],
      ccp6: [null],
    });
  }

  initComponentDictamen() {
    if (
      this.managementForm.get('numero').value ||
      this.managementForm.get('numero').value == '0' ||
      this.managementForm.get('numero').value == 0
    ) {
      this.validOficioGestion();
    } else {
      this.alert(
        'warning',
        'No existe un valor para Número de Gestión',
        'Sin valor'
      );
    }
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

  /**
   * INCIDENCIA 581
   * @returns
   */
  getJustification(params: ListParams) {
    // params.take = 20;
    // params['order'] = 'DESC';
    // let subscription = this.flyerService
    //   .getStatusBySearch(params)
    //   .subscribe(
    //     data => {
    //       this.justificacion = new DefaultSelect(
    //         data.data.map(i => {
    //           i.description = '#' + i.id + ' -- ' + i.description;
    //           return i;
    //         }),
    //         data.count
    //       );
    //       subscription.unsubscribe();
    //     },
    //     err => {
    //       this.onLoadToast(
    //         'error',
    //         'Error',
    //         err.status === 0 ? ERROR_INTERNET : err.error.message
    //       );
    //       subscription.unsubscribe();
    //     },
    //     () => {
    //       subscription.unsubscribe();
    //     }
    //   );
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
  }

  /**
   * Data Selects
   */

  /**
   * Obtener el listado de Ciudad de acuerdo a los criterios de búsqueda
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getCityByDetail(params: ListParams) {
    console.log(params);
    params.take = 20;
    params['order'] = 'DESC';
    console.log(params);
    let subscription = this.flyerService.getCityBySearch(params).subscribe({
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
        this.onLoadToast('error', 'Error', error.error.message);
        subscription.unsubscribe();
      },
    });
  }

  /**
   * Obtener el listado de Ciudad de acuerdo a los criterios de búsqueda
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getSenderByDetail(params: ListParams) {
    params.take = 20;
    params['order'] = 'DESC';
    console.log(params);
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
        this.onLoadToast('error', 'Error', error.error.message);
        subscription.unsubscribe();
      },
    });
  }
}
