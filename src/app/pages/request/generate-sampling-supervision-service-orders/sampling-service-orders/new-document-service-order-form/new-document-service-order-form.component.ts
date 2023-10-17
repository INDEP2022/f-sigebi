import {
  Component,
  ElementRef,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import Swal from 'sweetalert2';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';

@Component({
  selector: 'app-new-document-form',
  templateUrl: './new-document-service-order-form.component.html',
  styleUrls: ['./new-document-service-order-form.component.scss'],
})
export class NewDocumentServiceOrderFormComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef;
  documentForm: ModelForm<any>;
  fileToUpload: File | null = null;
  sizeMessage: boolean = false;
  delegId: number = null;

  typeDocSelected: any = [];
  stateSelected = new DefaultSelect();
  typeTranferSelected = new DefaultSelect();
  regionalDelegationSelected = new DefaultSelect();
  requestId: number = null;

  //datos pasados por el modal
  data: any = null;
  typeComponent: string = '';
  isDisable: boolean = false;

  private wcontentService = inject(WContentService);
  //private delegationService = inject(DelegationService);
  private regDelegSercice = inject(RegionalDelegationService);
  private transferenteSevice = inject(TransferentesSaeService);
  private delegationStateService = inject(DelegationStateService);
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeComponent);
    /*if (this.typeComponent === 'verify-noncompliance') {
      this.isDisable = false;
    }*/
    this.delegId = +this.authService.decodeToken().department;
    this.requestId = this.data.requestId;
    this.initForm();

    this.getTypeDocSelect(new ListParams());
    this.getRegionalDelegationSelect(new ListParams());
    this.getStateSelect(new ListParams(), this.delegId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  initForm(): void {
    this.documentForm = this.fb.group({
      xtipoDocumento: [null],
      noDoc: [null],
      dDocTitle: [null, [Validators.pattern(STRING_PATTERN)]],
      xidSolicitud: [{ value: null, disabled: true }],
      xresponsable: [null],

      xcontribuyente: [null, [Validators.pattern(STRING_PATTERN)]],
      xDelegacionRegional: [{ value: '', disabled: this.isDisable }],
      xnoOficio: [null],
      xestado: [null],
      xNoProgramacion: [null],
      xidTransferente: [null],
      xFolioProgramacion: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      xremitente: [null, [Validators.pattern(STRING_PATTERN)]],
      xComments: [null, [Validators.pattern(STRING_PATTERN)]],
      xcargoRemitente: [null, [Validators.pattern(STRING_PATTERN)]],
      xidExpediente: [null, [Validators.pattern(STRING_PATTERN)]],
      xidBien: [null, [Validators.pattern(STRING_PATTERN)]],
      xIdSIAB: [null, [Validators.pattern(STRING_PATTERN)]],
      //author: [null],
      //version: [null],
    });

    this.documentForm.controls['xidSolicitud'].setValue(this.requestId);
    this.documentForm.controls['xDelegacionRegional'].setValue(this.delegId);
  }

  selectFile(event: any): void {
    this.fileToUpload = event.target.files[0];
    let size = this.fileToUpload.size / 1000000;
    this.sizeMessage = size > 10 ? true : false;
    if (this.sizeMessage) {
      this.inputFile.nativeElement.value = '';
      return;
    } else {
      console.log(this.fileToUpload);
    }
  }

  getTypeDocSelect(event: any) {
    this.wcontentService.getDocumentTypes(new ListParams()).subscribe({
      next: resp => {
        this.typeDocSelected = resp.data;
      },
    });
  }

  getStateSelect(params: ListParams, delegation?: number) {
    params['filter.regionalDelegation'] = `$eq:${delegation}`;
    params['sortBy'] = 'keyState:ASC';
    this.delegationStateService.getAll(params).subscribe({
      next: resp => {
        const state = resp.data
          .map((item: any) => {
            return item.stateCode;
          })
          .filter(x => x != undefined);

        this.stateSelected = new DefaultSelect(state, resp.count);
      },
    });
  }

  changeState(event: any) {
    if (event == undefined) {
      this.typeTranferSelected = new DefaultSelect();
      this.documentForm.get('xidTransferente').setValue(null);
    } else {
      this.getTypeTranferSelect(new ListParams(), event.id);
    }
  }

  getTypeTranferSelect(params: ListParams, stateId?: number) {
    params['filter.transferent.nameTransferent'] = `$ilike:${params.text}`;
    params['sortBy'] = 'nameTransferent:ASC';
    this.transferenteSevice
      .getStateByTransferentKey(stateId, params)
      .subscribe({
        next: resp => {
          console.log(resp.data);
          const result = resp.data
            .map((item: any) => {
              return item.transferent;
            })
            .filter(x => x != undefined);
          this.typeTranferSelected = new DefaultSelect(result, resp.count);
        },
      });
  }

  getRegionalDelegationSelect(params: ListParams) {
    this.regDelegSercice.getAll(params).subscribe({
      next: resp => {
        this.regionalDelegationSelected = new DefaultSelect(
          resp.data,
          resp.count
        );
      },
    });
  }

  changeRegDele(event: any) {
    if (event == undefined) {
      this.regionalDelegationSelected = new DefaultSelect();
      this.documentForm.get('xDelegacionRegional').setValue(null);
      this.stateSelected = new DefaultSelect();
      this.documentForm.get('xestado').setValue(null);
      this.getRegionalDelegationSelect(new ListParams());
      this.typeTranferSelected = new DefaultSelect();
      this.documentForm.get('xidTransferente').setValue(null);
    } else {
      this.getStateSelect(new ListParams(), event.id);
    }
  }

  close(): void {
    this.modalRef.hide();
  }

  save() {
    const form = this.documentForm.getRawValue();
    form.dInDate = new Date();
    form.dSecurityGroup = 'Public';
    form.xidcProfile = 'NSBDB_Gral';
    form.ddocAuthor = this.authService.decodeToken().username;
    delete form.noDoc;
    const extension = '.pdf';
    const docName = form.dDocTitle;
    const file = this.fileToUpload;
    const jsonStrinfy = JSON.stringify(form);

    this.wcontentService
      .addDocumentToContent(docName, extension, jsonStrinfy, file, extension)
      .subscribe({
        next: resp => {
          this.messageSuccess();
          this.close();
        },
        error: error => {
          console.log(error);
          this.onLoadToast('error', '');
        },
      });
    console.log(form);
  }

  messageSuccess() {
    const message = 'Documento agregado exitosamente';
    Swal.fire({
      icon: undefined,
      title: 'Información',
      text: message,
      confirmButtonColor: '#9D2449',
      confirmButtonText: 'Aceptar',
      footer: '',
      allowOutsideClick: false,
    });
  }
}
