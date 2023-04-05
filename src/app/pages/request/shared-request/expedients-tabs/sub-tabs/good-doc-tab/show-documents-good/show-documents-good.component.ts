import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DOC_REQUEST_TAB_COLUMNS } from '../../doc-request-tab/doc-request-tab-columns';
import { SeeInformationComponent } from '../../doc-request-tab/see-information/see-information.component';
import { NewDocumentComponent } from '../../new-document/new-document.component';

@Component({
  selector: 'app-show-documents-good',
  templateUrl: './show-documents-good.component.html',
  styles: [],
})
export class ShowDocumentsGoodComponent extends BasePage implements OnInit {
  columns = DOC_REQUEST_TAB_COLUMNS;
  @Input() typeDoc = '';
  showSearchForm: boolean = true;
  docRequestForm: ModelForm<any>;
  selectDocType = new DefaultSelect<any>();
  selectRegDelegation = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectTransfe = new DefaultSelect<any>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsTypeDoc = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  idGood: number;
  idRequest: number = 0;
  totalItems: number = 0;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private wContentService: WContentService,
    private sanitizer: DomSanitizer,
    private typeRelevantService: TypeRelevantService
  ) {
    super();

    this.settings = { ...TABLE_SETTINGS, actions: false };
    this.settings.columns = DOC_REQUEST_TAB_COLUMNS;

    this.columns.button = {
      ...this.columns.button,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick1.subscribe((data: any) => {
          this.openDetail(data);
        }),
          instance.btnclick2.subscribe((data: any) => {
            this.openDoc(data.dDocName);
          });
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDocType(new ListParams());
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocuemntByGood());
  }

  prepareForm(): void {
    this.docRequestForm = this.fb.group({
      id: [null],
      text: [null, [Validators.pattern(STRING_PATTERN)]],
      docType: [null],
      docTitle: [null, [Validators.pattern(STRING_PATTERN)]],
      typeTrasf: [null, [Validators.pattern(STRING_PATTERN)]],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      author: [null, [Validators.pattern(STRING_PATTERN)]],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      noOfice: [null],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      comment: [null, [Validators.pattern(STRING_PATTERN)]],
      noRequest: [{ value: 157, disabled: true }],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],

      /* Solicitud Transferencia */
      regDelega: [null],
      state: [null],
      tranfe: [null],
    });
  }

  getDocuemntByGood() {
    this.loading = true;
    const filter: Object = {
      xidBien: this.idGood,
      xidSolicitud: this.idRequest,
    };

    this.wContentService.getDocumentos(filter).subscribe(data => {
      this.loading = true;
      const info = data.data.filter((doc: any) => {
        if (doc.dDocType == 'Document') return doc;
      });

      const typeDoc = info.map(async (items: any) => {
        const filter: any = await this.filterGoodDoc([items.xtipoDocumento]);
        items.xtipoDocumento = filter[0].ddescription;
        return items;
      });

      Promise.all(typeDoc).then(info => {
        this.paragraphs = info;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      });
    });
  }

  filterGoodDoc(typeDocument: any[]) {
    return new Promise((resolve, reject) => {
      const types = typeDocument.map((id: any) => {
        const data = {
          id: id,
        };

        return data;
      });

      this.wContentService
        .getDocumentTypes(this.paramsTypeDoc.getValue())
        .subscribe(data => {
          const filter = data.data.filter(type => {
            const index = types.findIndex(
              (_type: any) => _type.id == type.ddocType
            );
            return index < 0 ? false : true;
          });

          resolve(filter);
        });
    });
  }

  getGoodType(goodTypeId: number) {
    return new Promise((resolve, reject) => {
      if (goodTypeId !== null) {
        this.typeRelevantService.getById(goodTypeId).subscribe({
          next: (data: any) => {
            resolve(data.description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  openDetail(data: any): void {
    this.openModalInformation(data, 'detail');
  }

  private openModalInformation(data: any, typeInfo: string) {
    let config: ModalOptions = {
      initialState: {
        data,
        typeInfo,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SeeInformationComponent, config);
  }

  getDocType(params: ListParams) {
    this.wContentService.getDocumentTypes(params).subscribe(data => {
      this.selectDocType = new DefaultSelect(data.data, data.count);
    });
  }

  getRegDelegation(event: any) {}

  getState(event: any) {}

  getTransfe(event: any) {}

  search(): void {
    const typeDoc = this.docRequestForm.get('docType').value;
    const docTitle = this.docRequestForm.get('docTitle').value;
    const contributor = this.docRequestForm.get('contributor').value;
    const author = this.docRequestForm.get('author').value;
    const sender = this.docRequestForm.get('sender').value;
    const noOfice = this.docRequestForm.get('noOfice').value;
    const senderCharge = this.docRequestForm.get('senderCharge').value;
    const comment = this.docRequestForm.get('comment').value;

    if (typeDoc) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.xtipoDocumento == typeDoc) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
      } else {
        this.onLoadToast('success', 'Documento encontrado correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (docTitle) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.ddocTitle == docTitle) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
      } else {
        this.onLoadToast('success', 'Documento encontrado correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (contributor) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.xcontribuyente == contributor) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
      } else {
        this.onLoadToast('success', 'Documento encontrado correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (author) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.ddocTitle == author) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
      } else {
        this.onLoadToast('success', 'Documento encontrado correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (sender) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.xremitente == sender) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
      } else {
        this.onLoadToast('success', 'Documento encontrado correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (noOfice) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.xnoOficio == noOfice) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
      } else {
        this.onLoadToast('success', 'Documento encontrado correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (senderCharge) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.xcargoRemitente == senderCharge) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
      } else {
        this.onLoadToast('success', 'Documento encontrado correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (comment) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.xcomments == comment) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
      } else {
        this.onLoadToast('success', 'Documento encontrado correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }
  }

  openDoc(docName: string): void {
    this.wContentService.obtainFile(docName).subscribe(data => {
      let blob = this.dataURItoBlob(data);
      let file = new Blob([blob], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.openPrevPdf(fileURL);
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

  openNewDocument() {
    const idRequest = this.idRequest;
    const idGood = this.idGood;

    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      idRequest,
      typeDoc: 'good',
      idGood,
      callback: (next: boolean) => {
        if (next) {
          this.paragraphs = [];
          this.getDocuemntByGood();
        }
      },
    };
    this.modalService.show(NewDocumentComponent, config);
  }

  close() {
    this.modalRef.hide();
  }

  cleanForm(): void {
    this.docRequestForm.reset();
    this.getDocuemntByGood();
  }
}
