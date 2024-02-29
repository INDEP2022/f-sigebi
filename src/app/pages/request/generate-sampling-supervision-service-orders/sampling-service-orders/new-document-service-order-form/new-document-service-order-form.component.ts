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
  requestId: string = '';

  //datos pasados por el modal
  data: any = null;
  typeComponent: string = '';
  isDisable: boolean = false;
  idRequest: string = '';

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
    this.delegId = Number(this.authService.decodeToken().department);
    this.requestId = this.idRequest;
    this.initForm();

    this.getTypeDocSelect(new ListParams());
    this.getRegionalDelegationSelect(new ListParams());
    this.getStateSelect(new ListParams(), this.delegId);
    this.getTypeTranferSelect(new ListParams());
  }

  ngOnChanges(changes: SimpleChanges): void {}

  initForm(): void {
    this.documentForm = this.fb.group({
      xtipoDocumento: [null],
      noDoc: [null],
      dDocTitle: [null, [Validators.pattern(STRING_PATTERN)]],
      xidSolicitud: [{ value: null, disabled: true }],
      xresponsable: [null],

      xcontribuyente: [null, [Validators.pattern(STRING_PATTERN)]],
      xDelegacionRegional: [
        { value: '', disabled: this.isDisable },
        [Validators.required],
      ],
      xnoOficio: [null],
      xestado: [null],
      xNoProgramacion: [null],
      xidTransferente: [null, [Validators.required]],
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
    this.documentForm.get('xDelegacionRegional').setValue(this.delegId);
  }

  selectFile(event: any): void {
    this.fileToUpload = event.target.files[0];
    let size = this.fileToUpload.size / 1000000;
    this.sizeMessage = size > 10 ? true : false;
    if (this.sizeMessage) {
      this.inputFile.nativeElement.value = '';
      return;
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

    this.transferenteSevice.getAll(params).subscribe({
      next: response => {
        this.typeTranferSelected = new DefaultSelect(
          response.data,
          response.count
        );
      },
      error: () => {
        this.typeTranferSelected = new DefaultSelect();
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
      error: () => {
        this.regionalDelegationSelected = new DefaultSelect();
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
    (form.xidSolicitud = this.idRequest),
      (form.xdelegacionRegional = this.delegId),
      (form.xnivelRegistroNSBDB = 'bien'),
      (form.xidTransferente = this.documentForm.get('xidTransferente').value),
      (form.xestado = this.documentForm.get('xestado').value),
      delete form.noDoc;
    const extension = '.pdf';
    const docName = form.dDocTitle;
    const file = this.fileToUpload;
    const jsonStrinfy = JSON.stringify(form);

    this.wcontentService
      .addDocumentToContent(docName, extension, jsonStrinfy, file, extension)
      .subscribe({
        next: () => {
          this.alert('success', 'Correcto', 'Documento guardado correctamente');
          this.modalRef.content.callback(true);
          this.close();
        },
        error: () => {
          this.onLoadToast(
            'warning',
            'Acción Invalida',
            'No fue posible guardar el documento'
          );
        },
      });
  }
}
