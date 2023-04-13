import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
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
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentFormComponent } from '../../../shared-request/document-form/document-form.component';
import { DocumentShowComponent } from '../../../shared-request/document-show/document-show.component';
import {
  DOCUMENTS_LIST_COLUMNS,
  DOCUMENTS_LIST_EST_COLUMNS,
  DOCUMENTS_LIST_REQ_COLUMNS,
} from './documents-list-columns';

@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.scss'],
})
export class DocumentsListComponent extends BasePage implements OnInit {
  documentsData: any[] = [];
  showForm: boolean = false;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  documentForm: FormGroup = new FormGroup({});
  typeDocuments: any = []; // = new DefaultSelect();
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
    private transferentService: TransferenteService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings.actions.delete = true;
    this.settings = {
      ...this.settings,
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
    this.getTypeDocumentSelect(new ListParams());
    this.getRegionalDelegatioin(new ListParams());
    //establece los campos por el tipo de documento
    this.setTypeDocument();
    //establece las columnas
    this.settingColumns();
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
      xidSolicitud: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(13)],
      ],
      xidBien: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(13)],
      ],
      xnoOficio: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xremitente: [null, [Validators.pattern(STRING_PATTERN)]],
      xcargoRemitente: [null, [Validators.pattern(STRING_PATTERN)]],
      xComments: [null, [Validators.pattern(STRING_PATTERN)]],

      xidSIAB: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
    });
  }

  setTypeDocument() {
    if (this.typeDoc === 'doc-expediente') {
      this.documentForm.controls['xidExpediente'].setValue(
        this.parameter.recordId
      );
    } else if (this.typeDoc === 'doc-solicitud') {
      this.documentForm.controls['xidSolicitud'].setValue(this.parameter.id);
    } else if (this.typeDoc === 'doc-bien') {
      this.documentForm.controls['xidBien'].setValue(this.parameter.goodId);
    }
  }

  settingColumns() {
    if (this.typeDoc === 'doc-expediente') {
      this.settings.columns = DOCUMENTS_LIST_COLUMNS;
    } else if (this.typeDoc === 'doc-solicitud') {
      this.settings.columns = DOCUMENTS_LIST_REQ_COLUMNS;
    } else if (this.typeDoc === 'doc-bien') {
      this.settings.columns = DOCUMENTS_LIST_EST_COLUMNS;
    }
  }

  search() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      /*if (this.typeDoc !== 'doc-bien') {*/
      this.getData();
      /*} else {
        this.getGoodData();
      }*/
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
          this.documentsData = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        });
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  //obtener los files del bien
  getGoodData() {
    this.loading = true;
    const form = this.documentForm.getRawValue();
    this.wcontetService.getImgGood(form).subscribe({
      next: resp => {
        let result = resp.data.map(async (item: any) => {
          const typeDocument = await this.getTypeDocument(item.xtipoDocumento);
          item['typeDocumentName'] = typeDocument;
        });

        Promise.all(result).then(data => {
          this.documentsData = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        });
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  //añadir documentos
  uploadFiles() {
    this.openModal(DocumentFormComponent, this.typeDoc, '', this.parameter);
  }

  getTypeDocument(id: string) {
    return new Promise((resolve, reject) => {
      if (id) {
        let params = new ListParams();
        //params['filter.ddocType'] = `$eq:${id}`;
        this.wcontetService.getDocumentTypes(params).subscribe({
          next: (resp: any) => {
            const result = resp.data.filter((x: any) => {
              return x.ddocType === id;
            });
            resolve(result[0].ddescription);
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
        this.typeDocuments = resp.data; //new DefaultSelect(resp.data, resp.length);
      },
    });
  }

  close() {
    this.bsChildModalRef.hide();
  }

  //ver detalle del documento
  showDocument(event: any) {
    const data = event.data;
    const typeDoc = this.typeDoc;
    const docName = event.data.dDocName;

    // let config: ModalOptions = {
    //       initialState: {

    //         typeDoc,
    //         docName,
    //         callback: (next: boolean) => {},
    //       },
    //       class: 'modal-lg modal-dialog-centered',
    //       ignoreBackdropClick: true,
    //     };
    //     this.bsChildModalRef = this.modalService.show(DocumentShowComponent, config );
    this.openModal(DocumentShowComponent, typeDoc, docName, data);
  }

  //ver documento
  viewDocument(event: any) {
    const docName = event.data.dDocName;
    let linkDoc1: string = `http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=Etiqueta_INAI.jasper&idSolicitud=43717`;

    this.wcontetService.obtainFile(docName).subscribe(data => {
      let blob = this.dataURItoBlob(data);
      let file = new Blob([blob], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.openPrevPdf(fileURL);
    });

    /*let config: ModalOptions = {
      initialState: {
        linkDoc1,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ViewDocumentsComponent, config);

    this.wcontetService.obtainFile(docName).subscribe({
      next: resp => {
        console.log('respuesta al traer archivos: ', resp);
        let linkSource = '';
        let downloadLink = null;
        let fileName = '';
        if (this.typeDoc !== 'doc-bien') {
          linkSource = 'data:application/pdf;base64,' + resp;
          downloadLink = document.createElement('a');
          fileName = `${docName}.pdf`;
        } else {
          linkSource = 'data:image/png;base64,' + resp;
          downloadLink = document.createElement('a');
          fileName = `${docName}.png`;
        }

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      },
    });*/
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  openPrevPdf(pdfUrl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
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

  openModal(
    component: any,
    typedoc?: string,
    docName?: string,
    parameters?: any
  ) {
    let config: ModalOptions = {
      initialState: {
        parameter: parameters,
        typeDoc: typedoc,
        docName: docName,
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
