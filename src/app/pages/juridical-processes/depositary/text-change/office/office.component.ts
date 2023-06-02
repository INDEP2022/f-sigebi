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
import { _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ILegend } from 'src/app/core/models/catalogs/legend.model';
import { IDictationCopies } from 'src/app/core/models/ms-dictation/dictation-model';
import { IAttachedDocument } from 'src/app/core/models/ms-documents/attached-document.model';
import {
  ICopiesJobManagementDto,
  IdatosLocales,
  IGoodJobManagement,
  ImanagementOffice,
} from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { AtachedDocumentsService } from 'src/app/core/services/ms-documents/attached-documents.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { EXTERNOS_COLUMS } from '../tabla-modal/tableUserExt';
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
  IAttDocument: IAttachedDocument[] = [];
  form: FormGroup = new FormGroup({});
  nameUserDestinatario: ISegUsers;
  verBoton: boolean = false;
  filtroPersonaExt: ICopiesJobManagementDto[] = [];

  tipoImpresion: string;

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

  params = new BehaviorSubject<ListParams>(new ListParams());

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
    private modalRef: BsModalRef
  ) {
    super();

    this.settings.columns = EXTERNOS_COLUMS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'left',
      },
    };
  }

  ngOnInit(): void {
    this.year = new Date().getFullYear();

    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];

    this.loadUserDestinatario();
    this.buildForm();
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
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

  onmanagementNumberEnter(filterParams: BehaviorSubject<FilterParams>) {
    this.serviceOficces
      .getAllOfficialDocument(filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.warn('OFICIO 1: >===>> ', JSON.stringify(resp));

          this.tipoImpresion = resp.data[0].jobType;

          this.form
            .get('proceedingsNumber')
            .setValue(resp.data[0].proceedingsNumber);
          this.form
            .get('managementNumber')
            .setValue(resp.data[0].managementNumber);
          this.form.get('flyerNumber').setValue(resp.data[0].flyerNumber);
          this.form.get('officio').setValue(resp.data[0].jobBy);
          //====================================================================================//
          this.form.get('addressee').setValue(resp.data[0].addressee);
          this.form.get('RemitenteSenderUser').setValue(resp.data[0].sender);
          const param = new ListParams();
          param.text = resp.data[0].sender;
          console.log(
            'resp.data[0].sender => ' + JSON.stringify(resp.data[0].sender)
          );
          this.getUsers$(param);
          this.getPuestoUser(resp.data[0].cveChargeRem);
          this.form.get('paragraphInitial').setValue(resp.data[0].text1);
          this.form.get('paragraphFinish').setValue(resp.data[0].text2);
          this.form.get('paragraphOptional').setValue(resp.data[0].text3);
          this.form.get('descriptionSender').setValue(resp.data[0].desSenderpa);
          this.loadbyAttachedDocuments();
          this.oficnumChange.emit(this.form.get('proceedingsNumber').value);
        },
        error: err => {
          this.onLoadToast('error', 'error', err.error.message);
        },
      });
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

  /*   Evento que se ejecuta para llenar los documentos asociados a el expediente
========================================================================================*/
  loadbyAttachedDocuments() {
    this.filterParams1.getValue().removeAllFilters();
    this.filterParams1
      .getValue()
      .addFilter(
        'proceedingsNumber',
        this.form.value.proceedingsNumber,
        SearchFilter.EQ
      );
    this.AtachedDocumenServ.getAllFilter(
      this.filterParams1.getValue().getParams()
    ).subscribe({
      next: resp => {
        console.log('2 >=====>  ', JSON.stringify(resp.data));
        this.IAttDocument = resp.data;
      },
      error: error => {
        this.onLoadToast('error', 'Error', error.error.message);
      },
    });

    this.filterParams2.getValue().removeAllFilters();
    if (this.form.value.proceedingsNumber) {
      this.filterParams2
        .getValue()
        .addFilter(
          'proceedingsNumber',
          this.form.value.proceedingsNumber,
          SearchFilter.EQ
        );
      this.getPersonaExt_Int(this.filterParams2.getValue().getParams());
    }
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
    /*
  Se oculto hast que definamos el endopint para la consulta */
    this.filterParamsLocal
      .getValue()
      .addFilter(
        'insertDate',
        this.year + '-01-01' + ',' + this.year + '-12-31',
        SearchFilter.BTW
      );

    this.onmanagementNumberEnter(this.filterParamsLocal);
    this.verBoton = true;
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
  }

  /*       Crea el archivo que se va desplegar la información 
=======================================================================*/
  public confirm() {
    if (this.tipoImpresion === 'EXTERNO') {
      this.reporteInterno();
    } else {
      this.reporteExterno();
    }
  }

  reporteInterno() {
    const params = {
      no_of_ges: this.form.value.managementNumber,
    };

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
    this.cleanfields();
  }

  reporteExterno() {
    const params = {
      PNOOFICIO: this.form.value.expedientNumber,
      PTIPODIC: this.form.value.typeDict,
    };
    this.siabServiceReport.fetchReport('RGENABANDEC', params).subscribe({
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
    this.dynamicCatalogsService.getPuestovalue(idCode).subscribe({
      next: resp => {
        this.form.get('charge').setValue(resp.data.value);
      },
      error: err => {
        this.form.get('charge').setValue('');
        this.onLoadToast('error', 'Error', err.error.message);
      },
    });
  }

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
        this.users$$ = new DefaultSelect(response.data, response.count);
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

  updateOficio() {
    this.serviceOficces.updateOficio(this.creaObjUpdate(this.form)).subscribe({
      next: response => {
        this.onLoadToast(
          'success',
          'se actualizo el registro de manera correcta',
          JSON.stringify(response.data)
        );
      },
      error: responseError => {
        console.log('Entra =>  ', responseError.error.message);
        this.onLoadToast('error', 'Error', responseError.error.message);
      },
    });

    let obj = {
      copyDestinationNumber: '',
      typeDictamination: this.form.get('typeDict').value,
      recipientCopy: this.form.get('typeDict').value,
      no_Of_Dicta: this.form.get('registerNumber').value,
      //copyDestinationNumber:this.form.get("senderUser_I").value,
      personExtInt: this.form.get('typePerson_I').value,
      namePersonExt: this.form.get('personaExt_I').value,
      registerNumber: this.form.get('registerNumber').value,
    };

    this.dictationService.updateUserByOficNum(obj).subscribe({
      next: resp => {
        this.onLoadToast('warning', 'Info', resp[0].message);
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
      },
    });
  }

  creaObjUpdate(f: FormGroup) {
    return {
      flyerNumber: f.value.flyerNumber,
      proceedingsNumber: f.value.proceedingsNumber,
      managementNumber: f.value.managementNumber,
      cveManagement: f.value.officio,
      sender: f.value.RemitenteSenderUser,
      addressee: f.value.addressee,
      charge: f.value.cveChargeRem,
      text1: f.value.paragraphInitial,
      text2: f.value.paragraphFinish,
      text3: f.value.paragraphOptional,
      desSenderpa: f.value.descriptionSender,
    };
  }
  getDescUserPuesto(event: Event) {
    let userDatos = JSON.parse(JSON.stringify(event));

    this.dynamicCatalogsService
      .getPuestovalue(userDatos.positionKey)
      .subscribe({
        next: resp => {
          // alert('  getDescUserPuesto ' + resp.data.value);
          this.form.get('charge').setValue(resp.data.value);
        },
        error: err => {
          this.form.get('charge').setValue('');
          this.onLoadToast('error', 'Error', err.error.message);
        },
      });
  }

  /*   Evento que se ejecuta para llenar los parametros de las personas involucradas si son externos o internos
===============================================================================================================*/
  getPersonaExt_Int(params: _Params) {
    this.serviceOficces.getPersonaExt_Int(params).subscribe({
      next: resp => {
        this.filtroPersonaExt = resp.data;

        console.log('(((      params => ' + JSON.stringify(params) + +')))');
        console.log('getPersonaExt_Int => ' + JSON.stringify(resp.data));
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
      },
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
  ///===========================================
  insertRegistroExtCCP(data: IDictationCopies) {
    this.dictationService.createPersonExt(data).subscribe({
      next: resp => {
        this.onLoadToast('warning', 'Info', resp);
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
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
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.serviceOficces.deleteCopiesJobManagement(id).subscribe({
      next: resp => {
        console.log('resp  =>  ' + resp);
        this.refreshTabla();
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
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
    console.log('JSON.stringify(datos)  =>  ' + JSON.stringify(datos));
    let obj = {
      managementNumber: this.form.get('managementNumber').value,
      addresseeCopy: dato.senderUser_I,
      delDestinationCopyNumber: 0,
      personExtInt: dato.typePerson_I,
      nomPersonExt: dato.personaExt_I,
      recordNumber: this.form.get('managementNumber').value,
    };
    console.log('resp  =>  ' + JSON.stringify(obj));
    this.serviceOficces.createCopiesJobManagement(obj).subscribe({
      next: resp => {
        console.warn(
          ' this.serviceOficces. seteaTabla =>   ' + JSON.stringify(obj)
        );

        this.refreshTabla();
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
      },
    });
    this.refreshTabla();
    console.log(
      'this.filtroPersonaExt => ' + JSON.stringify(this.filtroPersonaExt)
    );
  }

  refreshTabla() {
    this.filterParams2
      .getValue()
      .addFilter(
        'proceedingsNumber',
        this.form.value.proceedingsNumber,
        SearchFilter.EQ
      );

    this.getPersonaExt_Int(this.filterParams2.getValue().getParams());
  }
}
