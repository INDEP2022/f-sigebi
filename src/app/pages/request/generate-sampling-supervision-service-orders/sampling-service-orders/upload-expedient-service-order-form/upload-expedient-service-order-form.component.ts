import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
//import { NewDocumentServiceOrderFormComponent } from '../new-document-form/new-document-form.component';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { DocumentShowComponent } from '../../../shared-request/document-show/document-show.component';
import { NewDocumentServiceOrderFormComponent } from '../new-document-service-order-form/new-document-service-order-form.component';
import { LIST_EXPEDIENTS_COLUMN } from './columns/list-expedients-columns';

var data = [
  {
    id: 1,
    noDoc: '34343',
    noRequest: '145',
    titleDocument: 'DOCUMENTO DE TRASPASO DE DATOS',
    typeDocument: 'ACLARACIÓN DE DOCUMENTO',
    author: 'ENRIQUE SEGOBIANO',
    date: '12/12/2022',
    version: '1',
  },
];

@Component({
  selector: 'app-upload-expedient-service-order-form',
  templateUrl: './upload-expedient-service-order-form.component.html',
  styleUrls: ['./upload-expedient-service-order-form.component.scss'],
})
export class UploadExpedientServiceOrderFormComponent
  extends BasePage
  implements OnInit
{
  showSearchForm: boolean = false;
  expedientForm: ModelForm<any>;
  typeDocSelected: any = [];

  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  columns = LIST_EXPEDIENTS_COLUMN;

  data: any[] = [];
  typeComponent: string = '';

  private wcontentService = inject(WContentService);

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: LIST_EXPEDIENTS_COLUMN,
    };

    this.columns.button = {
      ...this.columns.button,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick1.subscribe((data: any) => {
          console.log(data);
          this.openDetail(data);
        }),
          instance.btnclick2.subscribe((data: any) => {
            this.openDoc(data);
          });
      },
    };
    this.initForm();
    this.getTypeDocSelect();
  }

  initForm(): void {
    this.expedientForm = this.fb.group({
      texto: [null, [Validators.pattern(STRING_PATTERN)]],
      xtipoDocumento: [null],
      dDocTitle: [null, [Validators.pattern(STRING_PATTERN)]],
      xremitente: [null, [Validators.pattern(STRING_PATTERN)]],
      dDocAuthor: [null, [Validators.pattern(STRING_PATTERN)]],
      xcargoRemitente: [null, [Validators.pattern(STRING_PATTERN)]],
      dDocName: [null],
      xresponsable: [null, [Validators.pattern(STRING_PATTERN)]],
      xversion: [null],
      xcontribuyente: [null, [Validators.pattern(STRING_PATTERN)]],
      xidSolicitud: [null],
      xnoOficio: [null],
      xtipoTransferencia: [null, [Validators.pattern(STRING_PATTERN)]],
      xComments: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.setValues();
  }

  getTypeDocSelect(event?: any) {
    const params = new ListParams();
    this.wcontentService.getDocumentTypes(params).subscribe({
      next: resp => {
        this.typeDocSelected = resp.data;
      },
    });
  }

  newDocument() {
    let config: ModalOptions = {
      initialState: {
        data: this.data[0],
        typeComponent: this.typeComponent,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewDocumentServiceOrderFormComponent, config);
  }

  openDetail(event: any) {
    //this.openModal(DocumentShowComponent, 'doc-buscar', event.data);
    let config: ModalOptions = {
      initialState: {
        parameter: event,
        typeDoc: 'doc-buscar',
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DocumentShowComponent, config);
  }

  openDoc(data: any) {
    this.wcontentService.obtainFile(data.dDocName).subscribe(data => {
      console.log(data);
      let blob = this.dataURItoBlob(data);
      let file = new Blob([blob], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.openPrevPdf(fileURL);
      /*const linkSource =
            'data:application/pdf;base64,' + this.parameter.urlDocument;
          const downloadLink = document.createElement('a');
          const fileName = `${this.parameter.dDocName}.pdf`;

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();*/
    });
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

  search() {
    let form = this.expedientForm.getRawValue();
    let body: any = {};
    for (const key in form) {
      if (form[key] != null) {
        body[key] = form[key];
      }
    }

    this.wcontentService.getDocumentos(body).subscribe({
      next: resp => {
        resp.data.map((item: any) => {
          const desp = this.typeDocSelected.find(
            (x: any) => x.ddocType == item.xtipoDocumento
          );
          item['typeDescription'] = desp.ddescription;
        });

        this.paragraphs = resp.data;
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  setValues() {
    if (this.typeComponent == 'sample-request') {
      this.expedientForm.controls['xidSolicitud'].setValue(
        this.data[0].requestId
      );
    }
  }
}
