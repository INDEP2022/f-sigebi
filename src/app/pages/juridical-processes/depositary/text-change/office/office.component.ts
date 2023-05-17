import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAttachedDocument } from 'src/app/core/models/ms-documents/attached-document.model';
import {
  IGoodJobManagement,
  ImanagementOffice,
} from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { AtachedDocumentsService } from 'src/app/core/services/ms-documents/attached-documents.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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
  //===================
  users$ = new DefaultSelect<ISegUsers>();

  constructor(
    private fb: FormBuilder,
    private serviceOficces: GoodsJobManagementService,
    private jobsService: JobsService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabServiceReport: SiabService,
    private usersService: UsersService,
    private AtachedDocumenServ: AtachedDocumentsService,
    private dynamicCatalogsService: DynamicCatalogsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];
    this.loadUserDestinatario();
    this.buildForm();
    this.form.get('typePerson').valueChanges.subscribe(value => {
      if (value === 'E') {
        this.form.get('senderUser').setValue(null);
      } else {
        this.form.get('senderUser').setValue('');
      }
    });
    this.form.get('typePerson_I').valueChanges.subscribe(value => {
      if (value === 'E') {
        this.form.get('senderUser_I').setValue(null);
      }
    });
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      proceedingsNumber: [null, [Validators.required]],
      managementNumber: [null, [Validators.required]],
      flyerNumber: [null, [Validators.required]],
      officio: [null, [Validators.required]],
      charge: [null, [Validators.pattern(STRING_PATTERN)]],
      addressee: [null, [Validators.pattern(STRING_PATTERN)]],
      RemitenteSenderUser: [null, [Validators.pattern(STRING_PATTERN)]],
      paragraphInitial: [null, [Validators.pattern(STRING_PATTERN)]],
      paragraphFinish: [null, [Validators.pattern(STRING_PATTERN)]],
      paragraphOptional: [null, [Validators.pattern(STRING_PATTERN)]],
      descriptionSender: [null, [Validators.pattern(STRING_PATTERN)]],
      typePerson: [null, [Validators.required]],
      senderUser: [null, null],
      personaExt: [null, [Validators.required]],
      typePerson_I: [null, [Validators.required]],
      senderUser_I: [null, null],
      personaExt_I: [null, [Validators.required]],
    });
  }

  onmanagementNumberEnter(filterParams: BehaviorSubject<FilterParams>) {
    this.serviceOficces
      .getAllOfficialDocument(filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.warn('1: >===>>', JSON.stringify(resp));
          this.form
            .get('proceedingsNumber')
            .setValue(resp.data[0].proceedingsNumber);
          this.form
            .get('managementNumber')
            .setValue(resp.data[0].managementNumber);
          this.form.get('flyerNumber').setValue(resp.data[0].flyerNumber);
          this.form.get('officio').setValue(resp.data[0].cveManagement);
          //====================================================================================//

          this.form.get('RemitenteSenderUser').setValue(resp.data[0].sender);
          this.form.get('addressee').setValue(resp.data[0].addressee);

          this.getPuestoUser(resp.data[0].cveChargeRem);

          this.form.get('paragraphInitial').setValue(resp.data[0].text1);
          this.form.get('paragraphFinish').setValue(resp.data[0].text2);
          this.form.get('paragraphOptional').setValue(resp.data[0].text3);
          this.form.get('descriptionSender').setValue(resp.data[0].desSenderpa);
          this.loadbyAttachedDocuments();
        },
        error: err => {
          this.onLoadToast('error', 'error', err.error.message);
        },
      });
  }

  /*   Evento que se ejecuta para llenar los campos con el nombre de los destinatarios
========================================================================================*/
  getDescUser(control: string, event: Event) {
    this.nameUserDestinatario = JSON.parse(JSON.stringify(event));
    if (control === 'control') {
      this.form.get('personaExt').setValue(this.nameUserDestinatario.name);
    } else {
      this.form.get('personaExt_I').setValue(this.nameUserDestinatario.name);
    }
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

  /*   Evento que se ejecuta para llenar los parametros de las personas involucradas si son externos o internos
===============================================================================================================*/
  getPersonaExt_Int(params: _Params) {
    this.serviceOficces.getPersonaExt_Int(params).subscribe({
      next: resp => {
        this.nrSelecttypePerson = resp.data[0].personExtInt;
        this.nrSelecttypePerson_I = resp.data[1].personExtInt;
        this.form.get('typePerson').setValue(this.nrSelecttypePerson);
        this.form.get('typePerson_I').setValue(this.nrSelecttypePerson_I);

        this.form.get('personaExt').setValue(resp.data[0].nomPersonExt);
        this.form.get('personaExt_I').setValue(resp.data[0].nomPersonExt);
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
      },
    });
  }

  /*   Evento que se ejecuta para llenar los parametros con los que se va a realizar la busqueda
================================================================================================*/
  buscarOficio() {
    this.filterParamsLocal.getValue().removeAllFilters();
    if (!this.form.get('proceedingsNumber').invalid) {
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

    if (!this.form.get('managementNumber').invalid) {
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

    if (!this.form.get('flyerNumber').invalid) {
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

    if (!this.form.get('officio').invalid) {
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
    const params = {
      no_of_ges: this.form.value.managementNumber,
    };
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
    this.cleanfields();
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
}
