import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentFormComponent } from '../../../shared-request/document-form/document-form.component';
import { DocumentShowComponent } from '../../../shared-request/document-show/document-show.component';
import { DOCUMENTS_LIST_COLUMNS } from './documents-list-columns';

@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.scss'],
})
export class DocumentsListComponent extends BasePage implements OnInit {
  documentsData: any[] = [];
  showForm: boolean = false;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  documentForm: FormGroup = new FormGroup({});
  typeDocuments = new DefaultSelect();
  tranferences = new DefaultSelect();
  regDelegations = new DefaultSelect();
  states = new DefaultSelect();
  //parametro del dato seleccionados
  parameter: any;
  //tipo de documentos
  typeDoc: string;
  request: IRequest;
  regDelgaId: number | string = null;
  stateId: number = null;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private bsChildModalRef: BsModalRef,
    private wcontetService: WContentService,
    private regDelegationService: RegionalDelegationService,
    private delegationStateService: DelegationStateService,
    private transferentService: TransferenteService
  ) {
    super();
    this.settings.actions.delete = true;

    this.settings = {
      ...this.settings,
      columns: DOCUMENTS_LIST_COLUMNS,
      edit: { editButtonContent: '<i class="fa fa fa-file"></i>' },
      delete: {
        deleteButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
        confirmDelete: false,
      },
    };
    this.settings.actions['position'] = 'left';
  }

  ngOnInit(): void {
    this.prepareForm();
    this.request = this.parameter as IRequest;
    console.log(this.request);
    this.getTypeDocumentSelect(new ListParams());
    this.getRegionalDelegatioin(new ListParams());
    //establece los campos por el tipo de documento
    this.setTypeDocument();
    //buscar
    this.search();
    this.formReactiveCalls();
  }

  prepareForm() {
    this.documentForm = this.fb.group({
      texto: [null, [Validators.pattern(STRING_PATTERN)]],
      xtipoDocumento: [null],
      dDocTitle: [null, [Validators.pattern(STRING_PATTERN)]],
      xDelegacionRegional: [null],
      xresponsable: [null, [Validators.pattern(STRING_PATTERN)]],
      dDocAuthor: [null, [Validators.pattern(STRING_PATTERN)]],
      xestado: [null],
      xcontribuyente: [null, [Validators.pattern(STRING_PATTERN)]],
      ddocName: [null], //ver
      xidTransferente: [null],
      xtipoTransferencia: [null, [Validators.pattern(STRING_PATTERN)]],
      xidExpediente: [null, [Validators.pattern(STRING_PATTERN)]],
      xnoOficio: [null, [Validators.pattern(STRING_PATTERN)]],
      xremitente: [null, [Validators.pattern(STRING_PATTERN)]],
      xcargoRemitente: [null, [Validators.pattern(STRING_PATTERN)]],
      xComments: [null, [Validators.pattern(STRING_PATTERN)]],

      noSiab: [null],
      noGestion: [5296016],
    });
  }

  setTypeDocument() {
    if (this.typeDoc === 'doc-expediente') {
      this.documentForm.controls['xidExpediente'].setValue(
        this.parameter.recordId
      );
    }
  }

  search() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }

  getData() {
    this.loading = true;
    const form = this.documentForm.getRawValue();
    this.wcontetService.getDocumentos(form).subscribe({
      next: resp => {
        let result = resp.data.map(async (item: any) => {
          const typeDocument = await this.getTypeDocument(item.xtipoDocumento);
          item['typeDocumentName'] = typeDocument;
        });

        Promise.all(result).then(data => {
          console.log(data);
          this.documentsData = resp.data;
          this.loading = false;
        });
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  //añadir documentos
  uploadFiles() {
    this.openModal(DocumentFormComponent, this.typeDoc, this.request);
  }

  getTypeDocument(id: string) {
    return new Promise((resolve, reject) => {
      if (id) {
        let params = new ListParams();
        params['filter.ddocType'] = `$eq:${id}`;
        this.wcontetService.getDocumentTypes(params).subscribe({
          next: (resp: any) => {
            resolve(resp.ddescription);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getTypeDocumentSelect(params: ListParams) {
    params['filter.ddescription'] = `$ilike:${params.text}`;
    this.wcontetService.getDocumentTypes(params).subscribe({
      next: (resp: any) => {
        this.typeDocuments = new DefaultSelect(resp.data, resp.length);
      },
    });
  }

  close() {
    this.bsChildModalRef.hide();
  }

  //ver detalle del documento
  showDocument(event: any) {
    const expedient = event.data;
    this.openModal(DocumentShowComponent, this.typeDoc, expedient);
  }

  //ver documento
  viewDocument(event: any) {
    const docName = event.data.dDocName;
    this.wcontetService.obtainFile(docName).subscribe({
      next: resp => {
        const linkSource = 'data:application/pdf;base64,' + resp;
        const downloadLink = document.createElement('a');
        const fileName = `${docName}.pdf`;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      },
    });
  }

  getRegionalDelegatioin(params: ListParams) {
    this.regDelegationService.getAll(params).subscribe({
      next: resp => {
        this.regDelegations = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getState(params: ListParams) {
    params['filter.regionalDelegation'] = `$eq:${this.regDelgaId}`;
    this.delegationStateService.getAll(params).subscribe({
      next: resp => {
        let state = resp.data.map(x => x.stateCode).filter(x => x != undefined);
        console.log(state);
        this.states = new DefaultSelect(state, state.length);
      },
    });
  }

  getTranferences(params: ListParams) {
    this.transferentService.getByIdState(this.stateId).subscribe({
      next: (resp: any) => {
        this.tranferences = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  confirm() {}

  openModal(component: any, typedoc?: string, parameters?: any) {
    let config: ModalOptions = {
      initialState: {
        parameter: parameters,
        typeDoc: typedoc,
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);

    /*this.bsModalRef.content.event.subscribe((res: any) => {
      this.matchLevelFraction(res);
    });*/
  }

  formReactiveCalls() {
    this.documentForm.controls['xDelegacionRegional'].valueChanges.subscribe(
      (data: any) => {
        this.regDelgaId = data;
        this.getState(new ListParams());
      }
    );

    this.documentForm.controls['xestado'].valueChanges.subscribe(data => {
      this.stateId = data;
      this.getTranferences(new ListParams());
    });
  }
}
