import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { NewDocumentComponent } from '../new-document/new-document.component';
import { DOC_REQUEST_TAB_COLUMNS } from './doc-request-tab-columns';
import { SeeInformationComponent } from './see-information/see-information.component';

interface searchTable {
  noDoc: string;
  noReq: string;
  docTit: string;
  docType: string;
  author: string;
  dateCrea: string;
}

@Component({
  selector: 'app-doc-request-tab',
  templateUrl: './doc-request-tab.component.html',
  styleUrls: ['./doc-request-tab.component.scss'],
})
export class DocRequestTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @ViewChild('myTemplate', { static: true }) template: TemplateRef<any>;
  @ViewChild('myTemplate', { static: true, read: ViewContainerRef })
  container: ViewContainerRef;
  @Input() typeDoc = '';
  @Input() displayName: string = '';
  title: string = '';
  showSearchForm: boolean = false;
  selectDocType = new DefaultSelect<any>();
  docRequestForm: ModelForm<any>;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsTypeDoc = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: LocalDataSource = new LocalDataSource();
  columns = DOC_REQUEST_TAB_COLUMNS;
  parameter: any;
  type: string = '';
  selectRegDelegation = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectTransfe = new DefaultSelect<any>();
  idRequest: number = 0;
  totalItems: number = 0;
  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    private modalRef: BsModalRef,
    private activatedRoute: ActivatedRoute,
    private wContentService: WContentService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.idRequest = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.setTypeColumn();
    this.getDocType(new ListParams());
    this.typeDoc = this.type ? this.type : this.typeDoc;
    if (this.typeDoc === 'doc-request') {
      this.container.createEmbeddedView(this.template);
    }
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

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  ngOnChanges(changes: SimpleChanges): void {
    let onChangeCurrentValue = changes['typeDoc'].currentValue;
    this.typeDoc = onChangeCurrentValue;
    this.setTitle(onChangeCurrentValue);
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
      noRequest: [{ value: this.idRequest, disabled: true }],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      regDelega: [null],
      state: [null],
      tranfe: [null],
    });
  }

  getData() {
    this.loading = true;
    this.wContentService.findDocumentBySolicitud(this.idRequest).subscribe({
      next: async (data: any) => {
        const info = data.data.map(async (items: any) => {
          const filter: any = await this.filterGoodDoc([items.xtipoDocumento]);
          items.xtipoDocumento = filter[0].ddescription;
        });

        Promise.all(info).then(x => {
          this.paragraphs.load(data.data);
          this.totalItems = this.paragraphs.count();
          this.loading = false;
        });
      },
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

  getDocType(params: ListParams) {
    this.wContentService.getDocumentTypes(params).subscribe(data => {
      this.selectDocType = new DefaultSelect(data.data, data.count);
    });
  }

  search(): void {
    const tipoRelevante = this.docRequestForm.get('docType').value;
    const titleDocument = this.docRequestForm.get('docTitle').value;
    const contribuyente = this.docRequestForm.get('contributor').value;
    const author = this.docRequestForm.get('author').value;
    const remitente = this.docRequestForm.get('sender').value;
    const senderCharge = this.docRequestForm.get('senderCharge').value;

    if (tipoRelevante) {
      this.paragraphs.getElements().then(data => {
        const filter = data.filter((items: any) => {
          if (items.xtipoDocumento == tipoRelevante) return items;
        });

        if (filter.length > 0) {
          this.onLoadToast(
            'success',
            'Documentos encontrados correctamente',
            ''
          );
          this.paragraphs.load(filter);
        } else {
          this.onLoadToast('warning', 'Documentos no encontrados', '');
        }
      });
    }

    if (contribuyente) {
      this.paragraphs.getElements().then(data => {
        const filter = data.filter((items: any) => {
          if (items.xcontribuyente == contribuyente) return items;
        });

        if (filter.length > 0) {
          this.onLoadToast(
            'success',
            'Documentos encontrados correctamente',
            ''
          );
          this.paragraphs.load(filter);
        } else {
          this.onLoadToast('warning', 'Documentos no encontrados', '');
        }
      });
    }

    if (titleDocument) {
      this.paragraphs.getElements().then(data => {
        const filter = data.filter((items: any) => {
          if (items.ddocTitle == titleDocument) return items;
        });

        if (filter.length > 0) {
          this.onLoadToast(
            'success',
            'Documentos encontrados correctamente',
            ''
          );
          this.paragraphs.load(filter);
        } else {
          this.onLoadToast('warning', 'Documentos no encontrados', '');
        }
      });
    }

    if (author) {
      this.paragraphs.getElements().then(data => {
        const filter = data.filter((items: any) => {
          if (items.dDocAuthor == author) return items;
        });

        if (filter.length > 0) {
          this.onLoadToast(
            'success',
            'Documentos encontrados correctamente',
            ''
          );
          this.paragraphs.load(filter);
        } else {
          this.onLoadToast('warning', 'Documentos no encontrados', '');
        }
      });
    }

    if (remitente) {
      this.paragraphs.getElements().then(data => {
        const filter = data.filter((items: any) => {
          if (items.xremitente == remitente) return items;
        });

        if (filter.length > 0) {
          this.onLoadToast(
            'success',
            'Documentos encontrados correctamente',
            ''
          );
          this.paragraphs.load(filter);
        } else {
          this.onLoadToast('warning', 'Documentos no encontrados', '');
        }
      });
    }

    if (senderCharge) {
      this.paragraphs.getElements().then(data => {
        const filter = data.filter((items: any) => {
          if (items.xcargoRemitente == senderCharge) return items;
        });

        if (filter.length > 0) {
          this.onLoadToast(
            'success',
            'Documentos encontrados correctamente',
            ''
          );
          this.paragraphs.load(filter);
        } else {
          this.onLoadToast('warning', 'Documentos no encontrados', '');
        }
      });
    }
  }

  cleanForm(): void {
    this.docRequestForm.reset();
    this.getData();
  }

  openDetail(data: any): void {
    this.openModalInformation(data, 'detail');
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

  close() {
    this.modalRef.hide();
  }

  openNewDocument() {
    const idrequest = this.idRequest;
    let typeDoc = 'doc-request';
    let config: ModalOptions = {
      initialState: {
        idrequest,
        typeDoc,
        callback: (next: boolean) => {
          if (next == true) {
            this.onLoadToast('success', 'Documento Guardado correctamente', '');
            this.getData();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewDocumentComponent, config);
  }

  private openModalInformation(data: any, typeInfo: string) {
    let config: ModalOptions = {
      initialState: {
        data,
        typeInfo,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SeeInformationComponent, config);
  }

  getRegDelegation(event: any) {}

  getState(event: any) {}

  getTransfe(event: any) {}

  setTypeColumn() {
    /*if (this.displayName === 'validateEyeVisitResult') {
      this.columns.noReq.title = 'No. Expediente';
    } else {
      if (this.typeDoc === 'request-assets') {
        this.columns.noReq.title = 'No. Bien';
      } else {
        this.columns.noReq.title = 'No. Solicitud';
      }
    } */
  }

  setTitle(value: string) {
    switch (value) {
      case 'doc-request':
        this.title = 'Solicitudes';
        break;
      case 'doc-expedient':
        this.title = 'Expedientes';
        break;
      case 'request-expedient':
        this.title = '';
        break;
      default:
        break;
    }
  }
}
