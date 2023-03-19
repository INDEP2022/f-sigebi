import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IWContent } from 'src/app/core/models/ms-wcontent/wcontent.model';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss'],
})
export class DocumentFormComponent extends BasePage implements OnInit {
  documentForm: FormGroup = new FormGroup({});
  wcontent: ModelForm<IWContent>;
  typesDocuments = new DefaultSelect();
  transferents = new DefaultSelect();
  states = new DefaultSelect();
  parameter: any;
  typeDoc: string;
  regionalDelegacionName: string = '';
  idRegDelegation: number = null;
  file: File = null;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private wcontentService: WContentService,
    private delegationStateService: DelegationStateService,
    private transferentService: TransferenteService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.parameter, this.typeDoc);
    this.prepareForm();
    this.getDocType(new ListParams());
    this.setRegionalDelegacion();
    this.setByTypeDocument();
    this.reactiveFormCalls();
  }

  prepareForm() {
    this.documentForm = this.fb.group({
      xtipoDocumento: [null, [Validators.required]],
      document: [null, [Validators.required]],
      ddocTitle: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      xidSolicitud: [null],
      xidExpediente: [null],
      //numberGestion: [5296016],
      noSIAB: [null],
      xresponsable: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xdelegacionRegional: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xcontribuyente: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xestado: [null],
      numberOffice: [null],
      xidTransferente: [null],
      //numberProgramming: [5397],
      xremitente: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      //programmingFolio: ['R-METROPOLITANA-SAT-5397-OS'],
      xcargoRemitente: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xcomments: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
    });
  }

  setByTypeDocument() {
    if (this.typeDoc === 'doc-expediente') {
      this.documentForm.controls['xidExpediente'].setValue(
        this.parameter.recordId
      );
    } else if (this.typeDoc === 'doc-solicitud') {
      this.documentForm.controls['xidSolicitud'].setValue(
        this.parameter.recordId
      );
    }
  }

  getDocumentSelect(typeDocument: ListParams) {}

  getTransferents(params: ListParams) {
    params['filter.status'] = `$eq:${1}`;
    params['filter.nameTransferent'] = `$ilike:${params.text}`;
    this.transferentService.getAll(params).subscribe({
      next: resp => {
        this.transferents = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getState(params: ListParams) {
    let id = this.parameter.regionalDelegation.id;
    params['filter.regionalDelegation'] = `$eq:${id}`;
    this.delegationStateService.getAll(params).subscribe({
      next: resp => {
        let result = resp.data
          .map((x: any) => {
            return x.stateCode;
          })
          .filter((x: any) => x != undefined);

        this.states = new DefaultSelect(result, result.length);
      },
    });
  }

  setRegionalDelegacion() {
    this.documentForm.controls['xdelegacionRegional'].setValue(
      this.parameter.regionalDelegation.id
    );
    this.regionalDelegacionName = this.parameter.regionalDelegation.description;

    this.getState(new ListParams());
  }

  getDocType(params: ListParams) {
    this.wcontentService.getDocumentTypes(params).subscribe({
      next: (resp: any) => {
        this.typesDocuments = new DefaultSelect(resp.data, resp.length);
      },
    });
  }

  uploadFile(event: any) {
    console.log(event.target.files[0]);
    this.file = event.target.files[0];
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro que deseas crear un nuevo documento?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        const doctype = this.documentForm.controls['xtipoDocumento'].value;
        const docName = 'Reporte_' + doctype + this.formatDate() + '.pdf';
        let body: any = {};

        body['ddocTitle'] = this.documentForm.controls['ddocTitle'].value;
        body['ddocAuthor'] = '';
        body['ddocType'] = '';
        body['ddocCreator'] = '';
        body['ddocName'] = docName;
        body['dID'] = '';
        body['dSecurityGroup'] = 'Public';
        body['dDocAccount'] = '';
        body['dInDate'] = '';
        body['dDocId'] = '';
        body['dDocId'] = '';
        body['dDocId'] = '';

        /* this.wcontentService.addDocumentToContent(docName,'pdf',this.file).subscribe({
          next:resp => {

          }
        }) */

        this.onLoadToast('success', 'Documento creado correctamente', '');

        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }

  formatDate() {
    const date = new Date();

    return date.getFullYear() + '' + date.getMonth() + '' + date.getDate();
  }

  getDate() {
    const date = new Date();
  }
  reactiveFormCalls() {
    this.documentForm.controls['xestado'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.getTransferents(new ListParams());
        }
      }
    );
  }
}
