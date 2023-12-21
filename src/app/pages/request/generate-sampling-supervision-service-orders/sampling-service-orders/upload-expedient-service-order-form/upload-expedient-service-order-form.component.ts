import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
//import { NewDocumentServiceOrderFormComponent } from '../new-document-form/new-document-form.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DOC_GOODS_COLUMNS } from '../../../shared-request/expedients-tabs/sub-tabs/doc-request-tab/doc-request-tab-columns';
import { SeeInformationComponent } from '../../../shared-request/expedients-tabs/sub-tabs/doc-request-tab/see-information/see-information.component';
import { NewDocumentServiceOrderFormComponent } from '../new-document-service-order-form/new-document-service-order-form.component';

@Component({
  selector: 'app-upload-expedient-service-order-form',
  templateUrl: './upload-expedient-service-order-form.component.html',
  styleUrls: ['./upload-expedient-service-order-form.component.scss'],
})
export class UploadExpedientServiceOrderFormComponent
  extends BasePage
  implements OnInit
{
  formLoading: boolean = false;
  showSearchForm: boolean = true;
  docRequestForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  allDocumentos: any[] = [];
  request: string = '';
  paragraphs: any[] = [];
  totalItems: number = 0;
  statusTask: any;
  paramsTypeDoc = new BehaviorSubject<ListParams>(new ListParams());
  process: string = '';
  typesDocuments: any = [];
  @Input() typeDoc = '';
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private wcontentService: WContentService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: {
        delete: true,
        edit: true,
        columnTitle: 'Acciones',
        position: 'right',
      },

      edit: {
        editButtonContent: '<i class="fa fa-file text-primary mx-2 ml-2" ></i>',
      },
      delete: {
        deleteButtonContent: '<i  class="fa fa-eye text-info mx-2" ></i>',
      },
      columns: DOC_GOODS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.initForm();
    this.getDocType(new ListParams());
    this.getDocuemntByGood();
  }

  getDocType(params: ListParams) {
    this.wcontentService.getDocumentTypes(params).subscribe({
      next: (resp: any) => {
        this.typesDocuments = resp.data; //= new DefaultSelect(resp.data, resp.length);
      },
    });
  }

  initForm(): void {
    this.docRequestForm = this.fb.group({
      id: [null],
      text: [null, [Validators.pattern(STRING_PATTERN)]],
      docType: [null],
      docTitle: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      dDocName: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      typeTrasf: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      contributor: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      author: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      sender: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      noOfice: [null, [Validators.maxLength(60)]],
      senderCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      comment: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      noRequest: [null],
      responsible: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      noSiab: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],

      /* Solicitud Transferencia */
      regDelega: [null],
      state: [null],
      tranfe: [null],
    });
  }

  search(): void {
    const typeDoc = this.docRequestForm.get('docType').value;
    const docTitle = this.docRequestForm.get('docTitle').value;
    const dDocName = this.docRequestForm.get('dDocName').value;
    const contributor = this.docRequestForm.get('contributor').value;
    const author = this.docRequestForm.get('author').value;
    const sender = this.docRequestForm.get('sender').value;
    const noOfice = this.docRequestForm.get('noOfice').value;
    const senderCharge = this.docRequestForm.get('senderCharge').value;
    const comment = this.docRequestForm.get('comment').value;
    const responsible = this.docRequestForm.get('responsible').value;
    const regDelega = this.docRequestForm.get('regDelega').value;
    const state = this.docRequestForm.get('state').value;
    const tranfe = this.docRequestForm.get('tranfe').value;
    const noSiab = this.docRequestForm.get('noSiab').value;
    if (
      !typeDoc &&
      !docTitle &&
      !contributor &&
      !author &&
      !sender &&
      !noOfice &&
      !senderCharge &&
      !comment &&
      !dDocName &&
      !responsible &&
      !regDelega &&
      !state &&
      !tranfe &&
      !noSiab
    ) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getDocuemntByGood());
    }
    if (typeDoc) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.xtipoDocumento == typeDoc) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (docTitle) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.ddocTitle == docTitle) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (contributor) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.xcontribuyente == contributor) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (author) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.dDocAuthor == author) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (sender) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.xremitente == sender) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (noOfice) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.xnoOficio == noOfice) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (senderCharge) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.xcargoRemitente == senderCharge) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (comment) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.xcomments == comment) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (dDocName) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.dDocName == dDocName) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (responsible) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.xresponsable == responsible) return item;
      });

      if (filter.length == 0) {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
        this.loading = false;
      } else {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (regDelega && !state && !tranfe) {
      const filter = this.allDocumentos.filter((items: any) => {
        if (items.xdelegacionRegional == regDelega) return items;
      });

      if (filter.length > 0) {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
      } else {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
      }
    }

    if (regDelega && state && !tranfe) {
      const filter = this.allDocumentos.filter((items: any) => {
        if (items.xestado == state && items.xdelegacionRegional == regDelega)
          return items;
      });

      if (filter.length > 0) {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
      } else {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
      }
    }

    if (regDelega && state && tranfe) {
      const filter = this.allDocumentos.filter((items: any) => {
        if (
          items.xestado == state &&
          items.xdelegacionRegional == regDelega &&
          items.xdelegacionRegional &&
          items.xidTransferente == tranfe
        )
          return items;
      });

      if (filter.length > 0) {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
      } else {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
      }
    }

    if (noSiab) {
      const filter = this.allDocumentos.filter((items: any) => {
        if (items.xidSIAB == noSiab) return items;
      });

      if (filter.length > 0) {
        this.onLoadToast(
          'success',
          'Información',
          'Documento encontrado correctamente'
        );
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
      } else {
        this.alertInfo(
          'warning',
          'Información',
          'No se encontraron registros'
        ).then();
      }
    }
  }

  getDocuemntByGood() {
    this.loading = true;
    const filter: Object = {
      //xidBien: this.idGood,
      xidSolicitud: this.request,
    };
    this.docRequestForm.get('noRequest').setValue(this.request);
    this.wcontentService.getDocumentos(filter).subscribe(data => {
      this.loading = true;
      const info = data.data.filter((doc: any) => {
        if (doc.dDocType == 'Document') return doc;
      });

      const typeDoc = info.map(async (items: any) => {
        const filter: any = await this.filterGoodDoc([items.xtipoDocumento]);
        items.xtipoDocumento = filter[0]?.ddescription;
        return items;
      });

      Promise.all(typeDoc).then(info => {
        if (info.length == 0) {
          this.alertInfo(
            'warning',
            'Atención',
            'No se encontraron documentos'
          ).then(question => {
            if (question.isConfirmed) {
              this.loading = false;
            }
          });
        } else {
          this.paragraphs = info;
          this.allDocumentos = this.paragraphs;
          this.totalItems = this.paragraphs.length;
          this.loading = false;
        }
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

      this.wcontentService
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
  cleanForm(): void {
    this.docRequestForm.reset();
    this.getDocuemntByGood();
  }

  openNewDocument() {
    const idRequest = this.request;

    let config = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    };

    config.initialState = {
      process: this.process,
      typeDoc: 'sampling-assets',
      idRequest,
      callback: (next: boolean) => {
        if (next) {
          this.formLoading = true;
          setTimeout(() => {
            this.getDocuemntByGood();
            this.formLoading = false;
          }, 7000);
        }
      },
    };
    this.modalService.show(NewDocumentServiceOrderFormComponent, config);
  }
  close() {
    this.modalRef.hide();
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

  openDoc(data: any): void {
    this.wcontentService.obtainFile(data.dDocName).subscribe(data => {
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
}
