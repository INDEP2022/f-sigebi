import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ILegend } from 'src/app/core/models/catalogs/legend.model';
import { IDictationCopies } from 'src/app/core/models/ms-dictation/dictation-model';
import { IAttachedDocument } from 'src/app/core/models/ms-documents/attached-document.model';
import {
  IdatosLocales,
  IGoodJobManagement,
  ImanagementOffice,
} from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { AtachedDocumentsService } from 'src/app/core/services/ms-documents/attached-documents.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS_DOCUMENTS2 } from '../../../abandonments-declaration-trades/abandonments-declaration-trades/columns';
import { tablaModalComponent } from '../tabla-modal/tablaModal-component';
import { EXTERNOS_COLUMS_OFICIO } from '../tabla-modal/tableUserExt';
import { ListdocsComponent } from './listdocs/listdocs.component';
import { ModalPersonaOficinaComponent } from './modal-persona-oficina/modal-persona-oficina.component';
@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styles: [],
})
export class OfficeComponent extends BasePage implements OnInit {
  goodJobManagement = new Observable<IListResponse<IGoodJobManagement>>();
  numberManage = new Observable<IListResponse<IAttachedDocument>>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  filterParams1 = new BehaviorSubject<FilterParams>(new FilterParams());
  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());
  filterParamsLocal = new BehaviorSubject<FilterParams>(new FilterParams());
  comboOfficeFlayer: IGoodJobManagement[] = [];
  comboOffice: ImanagementOffice[] = [];
  objOffice: ImanagementOffice[] = [];
  options: any[];
  nrSelecttypePerson: string | number;
  nrSelecttypePerson_I: string | number;
  UserDestinatario: ISegUsers[] = [];
  UserDestinatarioDummy = { name: '', id: '' };
  IAttDocument: any[] = [];
  form: FormGroup = new FormGroup({});
  nameUserDestinatario: ISegUsers;
  verBoton: boolean = false;
  filtroPersonaExt: any[] = [];

  tipoImpresion: string;
  managementNumber_: any;
  //===================
  users$ = new DefaultSelect<ISegUsers>();
  @Input() oficnum: number | string;
  @Output() oficnumChange = new EventEmitter<number | string>();
  valLocal: IdatosLocales;
  year: number;
  users$$ = new DefaultSelect<ISegUsers>();
  users_1 = new DefaultSelect<ISegUsers>();
  //==========================================
  totalItems: number;
  settings2 = { ...this.settings };
  params = new BehaviorSubject<ListParams>(new ListParams());
  copyOficio: any[] = [];
  string_PTRN: `[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]`;
  SPECIAL_STRINGPATTERN: '[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ/s.,-()Üü“”;:]*';
  constructor(
    private fb: FormBuilder,
    private serviceOficces: GoodsJobManagementService,
    private jobsService: JobsService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabServiceReport: SiabService,
    private usersService: UsersService,
    private AtachedDocumenServ: AtachedDocumentsService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private dictationService: DictationService,
    private modalRef: BsModalRef,
    private mJobManagementService: MJobManagementService,
    private documentsService: DocumentsService,
    private token: AuthService,
    private securityService: SecurityService
  ) {
    super();

    this.settings.columns = EXTERNOS_COLUMS_OFICIO;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        add: false,
        position: 'left',
      },
    };
    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: true,
        add: false,
        position: 'left',
      },
      // selectMode: 'multi',
      columns: { ...COLUMNS_DOCUMENTS2 },
    };
  }
  validUserToolbar: any;
  ngOnInit(): void {
    this.year = new Date().getFullYear();

    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];
    this.buildForm();
    this.validUserToolbar = this.getRTdictaAarusr(
      this.token.decodeToken().preferred_username
    );
  }

  async getRTdictaAarusr(toolbar_user: any) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.user'] = `$eq:${toolbar_user}`;
      params['filter.reading'] = `$eq:S`;
      params['filter.writing'] = `$eq:S`;
      params['filter.typeNumber'] = `$eq:MODTEXTO`;
      this.dictationService.getRTdictaAarusr(params).subscribe({
        next: async (resp: any) => {
          console.log('USER', resp);
          resolve(1);
          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          resolve(0);
          this.loading = false;
          return;
        },
      });
    });
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      proceedingsNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
      ],
      managementNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
      ],
      flyerNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
      ],
      officio: [null, null],
      charge: [null, [Validators.pattern(STRING_PATTERN)]],
      addressee: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(2000)],
      ],
      RemitenteSenderUser: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(4000),
          Validators.required,
        ],
      ],
      paragraphInitial: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      paragraphFinish: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      paragraphOptional: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      descriptionSender: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      typePerson: [null, null],
      senderUser: [null, null],
      personaExt: [null, null],
      typePerson_I: [null, null],
      senderUser_I: [null, null],
      personaExt_I: [null, null],
      extPersonArray: this.fb.array([]),
    });
  }

  /*   Evento que se ejecuta para llenar los parametros con los que se va a realizar la busqueda
================================================================================================*/
  buscarOficio() {
    this.filterParamsLocal.getValue().removeAllFilters();

    if ((this.form.get('proceedingsNumber').value || '').trim().length > 0) {
      if (!(this.form.get('proceedingsNumber').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'proceedingsNumber',
            this.form.get('proceedingsNumber').value,
            SearchFilter.EQ
          );
      }
    }

    if ((this.form.get('managementNumber').value || '').trim().length > 0) {
      if (!(this.form.get('managementNumber').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'managementNumber',
            this.form.get('managementNumber').value,
            SearchFilter.EQ
          );
      }
    }

    if ((this.form.get('flyerNumber').value || '').trim().length > 0) {
      if (!(this.form.get('flyerNumber').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'flyerNumber',
            this.form.get('flyerNumber').value,
            SearchFilter.EQ
          );
      }
    }

    if ((this.form.get('officio').value || '').trim().length > 0) {
      if (!(this.form.get('officio').value.trim() === '')) {
        this.filterParamsLocal
          .getValue()
          .addFilter(
            'officio',
            this.form.get('officio').value,
            SearchFilter.EQ
          );
      }
    }

    if (this.validUserToolbar > 0) {
      this.filterParamsLocal
        .getValue()
        .addFilter(
          'deleUser',
          this.token.decodeToken().department,
          SearchFilter.EQ
        );
    } else {
      // Obtener la fecha actual
      const fechaActual = new Date();

      // Obtener el primer día del mes actual
      const primerDiaDelMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        1
      );

      // Obtener el último día del mes actual
      const ultimoDiaDelMes = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth() + 1,
        0
      );

      // Formatear las fechas como cadenas de texto en formato ISO
      const primerDiaDelMesString = primerDiaDelMes.toISOString().slice(0, 10);
      const ultimoDiaDelMesString = ultimoDiaDelMes.toISOString().slice(0, 10);

      // Mostrar los resultados
      console.log('El primer día del mes es:', primerDiaDelMesString);
      console.log('El último día del mes es:', ultimoDiaDelMesString);

      this.filterParamsLocal
        .getValue()
        .addFilter(
          'insertDate',
          `${primerDiaDelMesString}','${ultimoDiaDelMesString}`,
          SearchFilter.BTW
        );

      // this.filterParamsLocal
      //   .getValue()
      //   .addFilter(
      //     'insertDate',
      //     this.year + '-01-01' + ',' + this.year + '-12-31',
      //     SearchFilter.BTW
      //   );

      this.filterParamsLocal
        .getValue()
        .addFilter(
          'deleUser',
          this.token.decodeToken().department,
          SearchFilter.EQ
        );
    }

    if (
      this.form.get('proceedingsNumber').value ||
      this.form.get('managementNumber').value ||
      this.form.get('flyerNumber').value ||
      this.form.get('officio').value
    ) {
      this.onmanagementNumberEnter(this.filterParamsLocal);
      this.verBoton = true;
    } else {
      this.alert('info', 'Se requiere un filtro de búsqueda', '');
      // Swal.fire('Se requiere un filtro de búsqueda', '', 'info');
    }
  }
  typeOffice: any = '';
  onmanagementNumberEnter(filterParams: BehaviorSubject<FilterParams>) {
    this.serviceOficces
      .getAllOfficialDocument(filterParams.getValue().getParams())
      .subscribe({
        next: respuesta => {
          console.log('RESP', respuesta);
          if (respuesta.count > 1) {
            this.loadModal(1, filterParams);
          } else {
            console.log('Else');
            this.managementNumber_ = respuesta.data[0].managementNumber;
            this.tipoImpresion = respuesta.data[0].jobType;
            this.form
              .get('proceedingsNumber')
              .setValue(respuesta.data[0].proceedingsNumber);
            this.form
              .get('managementNumber')
              .setValue(respuesta.data[0].managementNumber);
            this.form
              .get('flyerNumber')
              .setValue(respuesta.data[0].flyerNumber);
            this.form.get('officio').setValue(respuesta.data[0].jobBy);
            this.typeOffice = respuesta.data[0].jobBy;
            this.form.get('addressee').setValue(respuesta.data[0].nomPersExt);
            this.form
              .get('RemitenteSenderUser')
              .setValue(respuesta.data[0].sender);
            const param = new ListParams();
            param.text = respuesta.data[0].sender;
            this.getUsers$(param);
            if (respuesta.data[0].cveChargeRem !== null) {
              this.getPuestoUser(respuesta.data[0].cveChargeRem);
            }
            if (respuesta.data[0].proceedingsNumber !== null) {
              this.loadbyAttachedDocuments(respuesta.data[0].managementNumber);
            }

            this.form.get('paragraphInitial').setValue(respuesta.data[0].text1);
            this.form.get('paragraphFinish').setValue(respuesta.data[0].text2);
            this.form
              .get('paragraphOptional')
              .setValue(respuesta.data[0].text3);
            this.form
              .get('descriptionSender')
              .setValue(respuesta.data[0].desSenderpa);
            this.getDocOficioGestion(respuesta.data[0].managementNumber);
            //  this.oficnumChange.emit(this.form.get('proceedingsNumber').value);
          }
        },
        error: err => {
          let error = '';
          // if (err.status === 0) {
          //   error = 'Revise su conexión de Internet.';
          // } else {
          //   error = err.message;
          // }
          // if (err.message.indexOf('registros') !== -1) {
          this.onLoadToast('warning', err.error.message, '');
          // }
          //this.onLoadToast('error', 'Error', error);
          console.log(error);
        },
      });
  }
  //=================================================================================
  //===================================================================================//
  docOficioGesti: any;
  async getDocOficioGestion(managementNumber: any) {
    const params = new ListParams();
    params['filter.managementNumber'] = `$eq:${managementNumber}`;
    this.mJobManagementService.getDocOficioGestion(params).subscribe({
      next: async (resp: any) => {
        console.log('CORRRECTO', resp);
        let arr: any = [];

        let result = resp.data.map(async (item: any) => {
          const docsss = await this.getDocsParaDictum(item.cveDocument);
          item['description'] = docsss;
          // arr.push(docsss);
        });
        Promise.all(result).then((data: any) => {
          this.IAttDocument = resp.data;
          this.loading = false;
        });
      },
      error: error => {
        console.log('MAL', error);
        this.loading = false;
      },
    });
  }

  // async docsssDicOficM(cveDocument: any) {
  //   for (let i = 0; i < Documents.length; i++) {
  //     if (cveDocument == Documents[i].key) {
  //       return Documents[i];
  //     }
  //   }
  // }

  getDocsParaDictum(data: any) {
    const params = new ListParams();
    params['filter.key'] = `$eq:${data}`;
    return new Promise((resolve, reject) => {
      this.documentsService.getDocParaDictum(params).subscribe({
        next: (resp: any) => {
          console.log('DOCS', resp);
          this.loading = false;
          resolve(resp.data[0].description);
        },
        error: error => {
          console.log('error DOCS PARA DICTUM', error.error.message);
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  docAct() {
    this.openModalDoc({
      IAttDocument: this.IAttDocument,
      typeOffice: this.typeOffice,
      arrayOfDocsCreados: this.IAttDocument,
      managementNumber: this.managementNumber_,
      rulingType: this.form.value.officio,
    });
  }

  openModalDoc(context?: Partial<ListdocsComponent>) {
    const modalRef = this.modalService.show(ListdocsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe((next: any) => {
      this.getDocOficioGestion(this.managementNumber_);
      // console.log('asda', next);
      // this.data2 = next;
    });
  }

  preDeleteDocOficioGest(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.deleteDocOficioGestion(event.managementNumber, event.cveDocument);
      }
    });
    console.log('event', event);
  }
  async deleteDocOficioGestion(managementNumber: any, cveD: any) {
    let obj = {
      managementNumber: managementNumber,
      cveDocument: cveD,
    };
    this.mJobManagementService.deleteDocOficioGestion(obj).subscribe({
      next: (resp: any) => {
        this.getDocOficioGestion(managementNumber);
        this.alert('success', 'Datos eliminados correctamente', '');
        // this.alert('success', "Datos eliminados correctamente", "tabla: DOCUM_OFICIO_GESTION")
        this.loading = false;
      },
      error: error => {
        // this.alert('error', error.error.message, 'tabla: DOCUM_OFICIO_GESTION');
        this.loading = false;
      },
    });
  }

  loadModal(resp: number, filterParams: BehaviorSubject<FilterParams>) {
    console.log('MODAL => ' + resp);
    this.openModal(resp, filterParams);
  }

  //false dictamen true oficio
  openModal(status: number, OficioOrdictamen: BehaviorSubject<FilterParams>) {
    console.log('MODAL 2=> ' + status);
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
    };
    modalConfig.initialState = {
      status,
      OficioOrdictamen,
      callback: async (next: any) => {
        console.log('next', next);

        //------------------------------------------------------
        const respuesta = JSON.parse(JSON.stringify(next));
        this.managementNumber_ = respuesta.managementNumber;
        this.typeOffice = respuesta.jobBy;
        this.tipoImpresion = respuesta.jobType;
        this.form
          .get('proceedingsNumber')
          .setValue(respuesta.proceedingsNumber);
        this.form.get('managementNumber').setValue(respuesta.managementNumber);
        this.form.get('flyerNumber').setValue(respuesta.flyerNumber);
        this.form.get('officio').setValue(respuesta.jobBy);
        this.form.get('addressee').setValue(respuesta.nomPersExt);
        this.form.get('RemitenteSenderUser').setValue(respuesta.sender);
        const param = new ListParams();
        param.text = respuesta.sender;
        this.getUsers$(param);

        if (respuesta.cveChargeRem !== null) {
          this.getPuestoUser(respuesta.cveChargeRem);
        }
        if (respuesta.proceedingsNumber !== null) {
          this.loadbyAttachedDocuments(respuesta.managementNumber);
        }

        this.form.get('paragraphInitial').setValue(respuesta.text1);
        this.form.get('paragraphFinish').setValue(respuesta.text2);
        this.form.get('paragraphOptional').setValue(respuesta.text3);
        this.form.get('descriptionSender').setValue(respuesta.desSenderpa);
        await this.getDocOficioGestion(respuesta.managementNumber);
        //----------------------------------------------------------
      },
    };
    this.modalService.show(tablaModalComponent, modalConfig);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  /*   Evento que se ejecuta para llenar los documentos asociados a el expediente
========================================================================================*/
  loadbyAttachedDocuments(doc: number | string) {
    this.filterParams1.getValue().removeAllFilters();
    this.filterParams1
      .getValue()
      .addFilter('managementNumber', doc, SearchFilter.EQ);
    this.AtachedDocumenServ.getAllFilter(
      this.filterParams1.getValue().getParams()
    ).subscribe({
      next: resp => {
        console.log('2 >=====>  ', JSON.stringify(resp.data));
        this.IAttDocument = resp.data;
      },
      error: error => {
        if (error.error.message.indexOf('registros') == -1) {
          this.onLoadToast('error', 'Error 1 ', error.error.message);
        }
        console.log(error.error.message);
      },
    });

    this.getPersonaExt_Int();
    /*  this.filterParams2.getValue().removeAllFilters();
    if (this.form.value.proceedingsNumber) {
      this.filterParams2.getValue().addFilter('managementNumber',this.form.value.proceedingsNumber,SearchFilter.EQ);
      this.getPersonaExt_Int(this.filterParams2.getValue().getParams());
      console.log("this.filterParams2.getValue().getParams() =>> " +  this.filterParams2.getValue().getParams());
    }*/
  }

  /*   Evento que se ejecuta para reiniciar la busqueda dependiendo del filtro
================================================================================================*/
  nuevaBusquedaOficio() {
    this.cleanfields();
  }

  /*    Limpia los campos y resetea loa parámetros de búsqueda 
=======================================================================*/
  cleanfields() {
    this.form.reset();
    this.verBoton = false;
    this.filterParamsLocal.getValue().removeAllFilters();
    this.IAttDocument = [];
    this.filtroPersonaExt = [];
  }

  /*       Crea el archivo que se va desplegar la información 
=======================================================================*/
  async confirm() {
    await this.updateOficioSinAlert();
    // CREAMOS DOCUMENTOS PARA M OFICIO GESTION //
    for (let i = 0; i < this.IAttDocument.length; i++) {
      let obj = {
        managementNumber: this.managementNumber_,
        cveDocument: this.IAttDocument[i].key,
        rulingType: this.IAttDocument[i].typeDictum,
      };
      this.createDocumentOficiManagement(obj);
    }
    console.log('params', this.form.value);
    if (this.tipoImpresion === 'EXTERNO') {
      await this.reporteExterno();
    } else {
      await this.reporteInterno();
    }
  }

  async updateOficioSinAlert() {
    let f = this.form;
    let obj = {
      flyerNumber: f.value.flyerNumber,
      proceedingsNumber: f.value.proceedingsNumber,
      managementNumber: f.value.managementNumber,
      sender: f.value.RemitenteSenderUser,
      nomPersExt: f.value.addressee,
      cveChargeRem: f.value.cveChargeRem,
      text1: f.value.paragraphInitial,
      text2: f.value.paragraphFinish,
      text3: f.value.paragraphOptional,
      desSenderpa: f.value.descriptionSender,
    };
    this.serviceOficces.updateOficio(obj).subscribe({
      next: response => {},
      error: responseError => {
        // if (responseError.message.indexOf('registros') == -1) {
        // this.onLoadToast('warning', responseError.message, '');
        // }
        // console.log('Entra =>  ', responseError.error.message);
      },
    });
  }

  createDocumentOficiManagement(data: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.createDocumentOficeManag(data).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async reporteInterno() {
    const params = {
      NO_OF_GES: this.form.value.managementNumber,
      DEP: 0,
      EXP: this.form.value.proceedingsNumber,
      NOMBRE_REM: this.form.value.RemitenteSenderUser,
      PUESTO_REM: this.form.value.charge,
      P_1: this.form.value.paragraphInitial,
      P_2: this.form.value.paragraphFinish,
      TIPE_OF: this.form.value.officio,
      VOLANTE: this.form.value.flyerNumber,
    };

    console.log(params);
    this.siabServiceReport.fetchReport('RGEROFGESTION', params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
    // this.cleanfields();
  }

  async reporteExterno() {
    const params = {
      no_of_ges: this.form.value.managementNumber,
    };
    console.log('params', this.form.value);
    this.siabServiceReport.fetchReport('RGEROFGESTION_EXT', params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }

  /*Se esta revisando si se va a utilizar*/
  validaCampos(event: Event) {
    alert(this.form.value.typePerson);
    alert(this.nrSelecttypePerson);
  }

  getPuestoUser(idCode: string) {
    let mensage = '';
    this.dynamicCatalogsService.getPuestovalue(idCode).subscribe({
      next: resp => {
        mensage = '';
        this.form.get('charge').setValue(resp.data.value);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        if (err.message.indexOf('registros') !== -1) {
          this.onLoadToast('error', 'Error 1 ', err.message);
        }
        //Swal.fire('No se encontró el puesto del usuario', '', 'warning');
        console.log('error Error  =>  ' + error);
      },
    });
  }

  async updateOficio() {
    let f = this.form;
    let obj = {
      flyerNumber: f.value.flyerNumber,
      proceedingsNumber: f.value.proceedingsNumber,
      managementNumber: f.value.managementNumber,
      sender: f.value.RemitenteSenderUser,
      nomPersExt: f.value.addressee,
      cveChargeRem: f.value.cveChargeRem,
      text1: f.value.paragraphInitial,
      text2: f.value.paragraphFinish,
      text3: f.value.paragraphOptional,
      desSenderpa: f.value.descriptionSender,
    };
    this.serviceOficces.updateOficio(obj).subscribe({
      next: response => {
        this.alert('success', 'Se actualizó el registro correctamene', '');
      },
      error: responseError => {
        // if (responseError.message.indexOf('registros') == -1) {
        this.onLoadToast('warning', responseError.message, '');
        // }
        // console.log('Entra =>  ', responseError.error.message);
      },
    });

    // let obj = {
    //   copyDestinationNumber: '',
    //   typeDictamination: this.form.get('officio').value,
    //   recipientCopy: this.form.get('typeDict').value,
    //   no_Of_Dicta: this.form.get('registerNumber').value,
    //   //copyDestinationNumber:this.form.get("senderUser_I").value,
    //   personExtInt: this.form.get('typePerson_I').value,
    //   namePersonExt: this.form.get('personaExt_I').value,
    //   registerNumber: this.form.get('registerNumber').value,
    // };

    // this.dictationService.updateUserByOficNum(obj).subscribe({
    //   next: resp => {
    //     this.onLoadToast('warning', 'Info', resp[0].message);
    //   },
    //   error: errror => {
    //     this.onLoadToast('error', 'Error', errror.error.message);
    //   },
    // });
  }

  async creaObjUpdate(f: FormGroup) {
    return {
      flyerNumber: f.value.flyerNumber,
      proceedingsNumber: f.value.proceedingsNumber,
      managementNumber: f.value.managementNumber,
      sender: f.value.RemitenteSenderUser,
      nomPersExt: f.value.addressee,
      cveChargeRem: f.value.cveChargeRem,
      text1: f.value.paragraphInitial,
      text2: f.value.paragraphFinish,
      text3: f.value.paragraphOptional,
      desSenderpa: f.value.descriptionSender,
    };
  }
  getDescUserPuesto(event: any) {
    let userDatos = JSON.parse(JSON.stringify(event));
    console.log('event', event);
    this.dynamicCatalogsService
      .getPuestovalue(userDatos.positionKey)
      .subscribe({
        next: resp => {
          console.log('AQUI', resp);
          // alert('  getDescUserPuesto ' + resp.data.value);
          this.form.get('charge').setValue(resp.data.value);
        },
        error: err => {
          let error = '';
          // if (err.status === 0) {
          //   error = 'Revise su conexión de Internet.';
          // } else {
          //   error = err.message;
          // }
          // if (err.message.indexOf('registros') !== -1) {
          //   this.alert('warning',
          //     'No se encontró el puesto del usuario', err.message,
          //   );
          // }
          console.log(error);
          console.log('error Error  =>  ' + error);
        },
      });
  }

  getDescUserPuesto2(event: any) {
    this.dynamicCatalogsService.getPuestovalue(event).subscribe({
      next: resp => {
        console.log('AQUI', resp);
        // alert('  getDescUserPuesto ' + resp.data.value);
        this.form.get('charge').setValue(resp.data.value);
      },
      error: err => {
        let error = '';
        // if (err.status === 0) {
        //   error = 'Revise su conexión de Internet.';
        // } else {
        //   error = err.message;
        // }
        // if (err.message.indexOf('registros') !== -1) {
        //   this.alert('warning',
        //     'No se encontró el puesto del usuario', err.message,
        //   );
        // }
        console.log(error);
        console.log('error Error  =>  ' + error);
      },
    });
  }

  /*   Evento que se ejecuta para llenar los parametros de las personas involucradas si son externos o internos
===============================================================================================================*/
  async getPersonaExt_Int() {
    this.filterParams2.getValue().removeAllFilters();
    this.filterParams2
      .getValue()
      .addFilter(
        'managementNumber',
        this.form.value.managementNumber,
        SearchFilter.EQ
      );
    this.serviceOficces
      .getPersonaExt_Int(this.filterParams2.getValue().getParams())
      .subscribe({
        next: async (resp: any) => {
          console.log('resp.data  => ');
          console.log(resp.data);
          //this.filtroPersonaExt = resp.data;

          let result = resp.data.map(async (data: any) => {
            if (data.personExtInt == 'I') {
              data['personExtInt_'] = 'INTERNO';
              data['userOrPerson'] = await this.getSenders2OfiM2___(
                data.addresseeCopy
              );
            } else if (data.personExtInt == 'E') {
              data['personExtInt_'] = 'EXTERNO';
              data['userOrPerson'] = data.nomPersonExt;
            }
          });

          Promise.all(result).then(async (data: any) => {
            this.filtroPersonaExt = resp.data;
          });

          // this.filtroPersonaExt = resp.data.map((data: any) => {
          //   const a = ""
          //   this.usuariosCCP(data)
          // });
        },
        error: err => {
          let error = '';
          // if (err.status === 0) {
          //   error = 'Revise su conexión de Internet.';
          // } else {
          //   error = err.message;
          // }
          // if (err.message.indexOf('registros') !== -1) {
          //   this.onLoadToast('error', 'Error 1 ', err.message);
          // }

          console.log(error);
          // this.onLoadToast('error', 'Error', error);
        },
      });
  }

  async getSenders2OfiM2___(user: any) {
    const params = new ListParams();
    params['filter.user'] = `$eq:${user}`;
    return new Promise((resolve, reject) => {
      this.securityService.getAllUsersTracker(params).subscribe(
        (data: any) => {
          // this.formCcpOficio.get('nombreUsuario2').setValue(data.data[0]);
          console.log('COPYY2', data);
          let result = data.data.map(async (item: any) => {
            item['userAndName'] = item.user + ' - ' + item.name;
          });

          resolve(data.data[0].userAndName);

          this.loading = false;
        },
        error => {
          resolve(null);
          // this.senders = new DefaultSelect();
        }
      );
    });
  }

  /*===========================================================
          FORMULARIO
==============================================================*/

  getDescUser(control: string, event: Event) {
    this.nameUserDestinatario = JSON.parse(JSON.stringify(event));
    //  alert(control);
    if (control === 'control_I') {
      this.form.get('personaExt_I').setValue(this.nameUserDestinatario.name);
    } else {
      this.form.get('personaExt').setValue(this.nameUserDestinatario.name);
    }
  }

  ///===========================================
  insertRegistroExtCCP(data: IDictationCopies) {
    this.dictationService.createPersonExt(data).subscribe({
      next: resp => {
        this.onLoadToast('warning', 'Info', resp);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        if (err.message.indexOf('registros') !== -1) {
          this.onLoadToast('error', 'Error 1 ', err.message);
        }
        console.log(error);
        //this.onLoadToast('error', 'Error', error);
      },
    });
  }

  showDeleteAlert(legend: ILegend) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(legend.id);
        this.alert('success', 'Borrado', '');
      }
    });
  }

  delete(id: number) {
    this.serviceOficces.deleteCopiesJobManagement(id).subscribe({
      next: resp => {
        // let arr = [];

        // for (let i = 0; i < this.copyOficio.length; i++) {
        //   if (this.copyOficio[i].id != id) {
        //     arr.push(this.copyOficio[i]);
        //   }
        // }

        // this.copyOficio = arr;
        this.onLoadToast('success', 'Se eliminó correctamente', '');
        console.log('resp  =>  ' + resp);
        this.refreshTabla();
      },
      error: err => {
        let error = '';
        // if (err.status === 0) {
        //   error = 'Revise su conexión de Internet.';
        // } else {
        //   error = err.message;
        // }
        // if (err.message.indexOf('registros') !== -1) {
        this.alert('error', err.error.message, '');
        // }
        console.log(error);
        //this.onLoadToast('error', 'Error', error);
      },
    });
  }

  openForm(legend?: ILegend) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      legend,
      callback: (next: boolean, datos: any) => {
        if (next) {
          this.seteaTabla(datos);
        }
      },
    };
    this.modalService.show(ModalPersonaOficinaComponent, modalConfig);
  }
  close() {
    this.modalRef.hide();
  }
  seteaTabla(datos: any) {
    let dato = JSON.parse(JSON.stringify(datos));
    console.log('JSON.stringify(datos)  =>  ', datos);

    let obj: any;

    if (datos.typePerson_I == 'I') {
      obj = {
        managementNumber: this.form.get('managementNumber').value,
        addresseeCopy: datos.senderUser_I,
        delDestinationCopyNumber: null,
        recordNumber: null,
        personExtInt: datos.typePerson_I,
        nomPersonExt: null,
      };
    } else if (datos.typePerson_I == 'E') {
      obj = {
        managementNumber: this.form.get('managementNumber').value,
        addresseeCopy: null,
        delDestinationCopyNumber: null,
        recordNumber: null,
        personExtInt: datos.typePerson_I,
        nomPersonExt: datos.personaExt_I,
      };
    }

    // let obj = {
    //   managementNumber: this.form.get('managementNumber').value,
    //   addresseeCopy: dato.senderUser_I,
    //   delDestinationCopyNumber: 0,
    //   personExtInt: dato.typePerson_I,
    //   nomPersonExt: dato.personaExt_I,
    //   recordNumber: this.form.get('managementNumber').value,
    // };
    console.log('resp  =>  ' + JSON.stringify(obj));
    this.serviceOficces.createCopiesJobManagement(obj).subscribe({
      next: resp => {
        console.warn(
          ' this.serviceOficces. seteaTabla =>   ' + JSON.stringify(obj)
        );

        this.refreshTabla();
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        if (err.message.indexOf('registros') !== -1) {
          this.onLoadToast('error', 'Error 1 ', err.message);
        }
        console.log('Error ' + error);
      },
    });
    this.refreshTabla();
    console.log(
      'this.filtroPersonaExt => ' + JSON.stringify(this.filtroPersonaExt)
    );
  }

  refreshTabla() {
    this.getPersonaExt_Int();
  }

  // Combo para utilizar los usuarios
  getUsers$($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers$(params).subscribe();
  }

  getAllUsers$(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        console.log('response', response);
        this.users$$ = new DefaultSelect(response.data, response.count);
        this.getDescUserPuesto2(response.data[0].positionKey);
      })
    );
  }

  getUsers_1($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers_1(params).subscribe();
  }

  getAllUsers_1(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users_1 = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users_1 = new DefaultSelect(response.data, response.count);
      })
    );
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }
  async usuariosCCP(obj: any) {
    return {
      id: obj.id,
      managementNumber: obj.managementNumber,
      addresseeCopy: obj.addresseeCopy,
      delDestinationCopyNumber: obj.delDestinationCopyNumber,
      nomPersonExt: obj.nomPersonExt,
      personExtInt: obj.personExtInt == 'I' ? 'INTERNO' : 'EXTERNO',
      recordNumber: obj.recordNumber,
      userAndName: obj.userAndName,
    };
  }

  /*   Evento que se ejecuta para llenar el combo con los destinatarios
========================================================================================*/
  loadUserDestinatario() {
    this.usersService.getUsersJob().subscribe({
      next: resp => {
        this.UserDestinatario = [...resp.data];
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }
}
