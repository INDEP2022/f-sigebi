import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAttachedDocument } from 'src/app/core/models/ms-documents/attached-document.model';
import {
  IGoodJobManagement,
  ImanagementOffice,
} from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { AtachedDocumentsService } from 'src/app/core/services/ms-documents/attached-documents.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styles: [],
})
export class OfficeComponent extends BasePage implements OnInit {
  goodJobManagement = new Observable<IListResponse<IGoodJobManagement>>();
  numberManage = new Observable<IListResponse<IAttachedDocument>>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  comboOfficeFlayer: IGoodJobManagement[] = [];
  comboOffice: ImanagementOffice[] = [];
  objOffice: ImanagementOffice[] = [];
  options: any[];
  nrSelecttypePerson: string;
  nrSelecttypePerson_I: string;
  UserDestinatario: ISegUsers[] = [];
  IAttDocument: IAttachedDocument[] = [];
  form: FormGroup = new FormGroup({});
  nameUserDestinatario: ISegUsers;

  constructor(
    private fb: FormBuilder,
    private serviceOficces: GoodsJobManagementService,
    private jobsService: JobsService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabServiceReport: SiabService,
    private usersService: UsersService,
    private AtachedDocumenServ: AtachedDocumentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadUserDestinatario();
    this.buildForm();
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'S', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];
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
      numberGestion: [null, [Validators.required]],
      flywheel: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      officio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphInitial: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphFinish: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphOptional: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionSender: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typePerson: [null, [Validators.required]],
      senderUser: [null, [Validators.required]],
      personaExt: [null, [Validators.required]],
      typePerson_I: [null, [Validators.required]],
      senderUser_I: [null, [Validators.required]],
      personaExt_I: [null, [Validators.required]],
      key: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      document: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      key_I: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      document_I: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });
  }

  public confirm() {
    const params = {
      no_of_ges: this.form.value.proceedingsNumber,
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
  }

  onmanagementNumberEnter() {
    this.filterParams.getValue().removeAllFilters;
    this.filterParams
      .getValue()
      .addFilter(
        'managementNumber',
        this.form.get('managementNumber').value,
        SearchFilter.EQ
      );
    this.serviceOficces
      .getAllOfficialDocument(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          console.warn(resp);
          console.warn(
            '>>>>>===>==>=>=>=>=>==>=>=>>=>=>=>==>=>=>=>=>=>==>=>=>=>='
          );
          this.form.get('proceedingsNumber').value;
          this.form
            .get('numberGestion')
            .setValue(resp.data[0].proceedingsNumber);
          this.form.get('flywheel').setValue(resp.data[0].flyerNumber);
          this.form.get('officio').setValue(resp.data[0].cveManagement);
          this.form.get('senderUser').setValue(resp.data[0].sender);
          this.form.get('addressee').setValue(resp.data[0].addressee);
          this.form.get('charge').setValue(resp.data[0].cveChargeRem);
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

  onNumberGestionEnter() {}
  onFlywheelEnter() {}
  onOfficioEnter() {}
  cleanFilters() {
    this.form.get('numberGestion').setValue('');
    this.form.get('flywheel').setValue('');
    this.form.get('officio').setValue('');
    this.form.get('senderUser').setValue('');
    this.form.get('addressee').setValue('');
    this.form.get('charge').setValue('');
    this.form.get('paragraphInitial').setValue('');
    this.form.get('paragraphFinish').setValue('');
    this.form.get('paragraphOptional').setValue('');
  }

  validaCampos(event: Event) {
    alert(this.form.value.typePerson);
    alert(this.nrSelecttypePerson);
  }
  getDescUser(control: string, event: Event) {
    this.nameUserDestinatario = JSON.parse(JSON.stringify(event));
    if (control === 'control') {
      this.form.get('personaExt').setValue(this.nameUserDestinatario.name);
    } else {
      this.form.get('personaExt_I').setValue(this.nameUserDestinatario.name);
    }
  }

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

  loadbyAttachedDocuments() {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams
      .getValue()
      .addFilter(
        'managementNumber',
        this.form.value.managementNumber,
        SearchFilter.EQ
      );
    this.AtachedDocumenServ.getAllFilter(
      this.filterParams.getValue().getParams()
    ).subscribe({
      next: resp => {
        this.IAttDocument = resp.data;
      },
      error: error => {
        console.log(error.error.message);
      },
    });
  }
}
