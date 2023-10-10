import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { NewDocumentFormComponent } from '../new-document-form/new-document-form.component';
import { LIST_EXPEDIENTS_COLUMN } from './columns/list-expedients-columns';

var data = [
  {
    id: 1,
    dDocName: '34343',
    xidBien: 'rerere',
    dDocTitle: 'DOCUMENTO DE TRASPASO DE DATOS',
    xtipoTransferencia: 'ACLARACIÓN DE DOCUMENTO',
    dDocAuthor: 'ENRIQUE SEGOBIANO',
    date: '12/12/2022',
    version: '1',
  },
];

@Component({
  selector: 'app-upload-expedient-service-order-form',
  templateUrl: './upload-expedient-form.component.html',
  styleUrls: ['./upload-expedient-form.component.scss'],
})
export class UploadExpedientFormComponent extends BasePage implements OnInit {
  showSearchForm: boolean = false;
  expedientForm: ModelForm<any>;
  typeDocSelected: any = []; //new DefaultSelect();

  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  columns = LIST_EXPEDIENTS_COLUMN;

  good: any[] = [];
  typeComponent: string = '';

  private readonly wcontentService = inject(WContentService);
  private readonly sanitizer = inject(DomSanitizer);

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('good', this.good);
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
          this.openDetail();
        }),
          instance.btnclick2.subscribe((data: any) => {
            this.openDoc(data);
          });
      },
    };
    this.initForm();
    //this.paragraphs = data;
    this.getTypeDocSelect();
    this.expedientForm.get('xidBien').setValue(this.good[0].goodId);
    //this.expedientForm.get('xidBien').setValue(9548719);
  }

  initForm(): void {
    this.expedientForm = this.fb.group({
      texto: [null, [Validators.pattern(STRING_PATTERN)]],
      xtipoDocumento: [null],
      dDocTitle: [null, [Validators.pattern(STRING_PATTERN)]],
      xtipoTransferencia: [null, [Validators.pattern(STRING_PATTERN)]],
      xComments: [null, [Validators.pattern(STRING_PATTERN)]],
      dDocAuthor: [null, [Validators.pattern(STRING_PATTERN)]],
      xremitente: [null, [Validators.pattern(STRING_PATTERN)]],
      dDocName: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      xcargoRemitente: [null, [Validators.pattern(STRING_PATTERN)]],
      version: [null],
      xresponsable: [null, [Validators.pattern(STRING_PATTERN)]],
      xidBien: [{ value: null, disabled: true }],
      xcontribuyente: [null, [Validators.pattern(STRING_PATTERN)]],
      xIdSIAB: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      xnoOficio: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
    });
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
        data: this.good,
        typeComponent: this.typeComponent,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewDocumentFormComponent, config);
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

  openDetail() {}

  openDoc(data: any) {
    this.wcontentService
      .obtainFile(data.dDocName)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        let blob = this.dataURItoBlob(data);
        let file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.openPrevPdf(fileURL);
      });
  }

  close() {
    this.modalRef.hide();
  }

  search() {
    const expedient = this.expedientForm.getRawValue();
    this.wcontentService.getDocumentos(expedient).subscribe({
      next: resp => {
        console.log(resp);
        this.paragraphs = resp.data;
        this.totalItems = resp.data.length;
      },
    });
  }
}
