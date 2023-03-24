import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DOC_REQUEST_TAB_COLUMNS } from '../../doc-request-tab/doc-request-tab-columns';
import { SeeInformationComponent } from '../../doc-request-tab/see-information/see-information.component';
import { NewDocumentComponent } from '../../new-document/new-document.component';

@Component({
  selector: 'app-doc-expedient-tab',
  templateUrl: './doc-expedient-tab.component.html',
  styles: [],
})
export class DocExpedientTabComponent extends BasePage implements OnInit {
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
  paragraphs: any[] = [];
  columns = DOC_REQUEST_TAB_COLUMNS;
  parameter: any;
  type: string = '';
  selectRegDelegation = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectTransfe = new DefaultSelect<any>();
  idRequest: number = 0;
  idExpedient: number = 0;
  paramsTypeDoc = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    private modalRef: BsModalRef,
    private activatedRoute: ActivatedRoute,
    private wContentService: WContentService,
    private sanitizer: DomSanitizer,
    private requestService: RequestService
  ) {
    super();
    this.idRequest = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    console.log(this.typeDoc);
    this.typeDoc = this.type ? this.type : this.typeDoc;
    if (this.typeDoc === 'doc-request') {
      //hacer visible la vista principal y no el ng-template
      this.container.createEmbeddedView(this.template);
    }
    this.prepareForm();
    this.setTypeColumn();
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
    this.getRequestData();
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
      noRequest: [{ value: 157, disabled: true }],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],

      /* Solicitud Transferencia */
      regDelega: [null],
      state: [null],
      tranfe: [null],
    });
  }

  getRequestData() {
    this.requestService.getById(this.idRequest).subscribe(data => {
      this.idExpedient = data.recordId;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData());
    });
  }

  getData() {
    const body = {
      xidSolicitud: this.idRequest,
      xidExpediente: this.idExpedient,
    };

    this.wContentService.getDocumentos(body).subscribe({
      next: async (data: any) => {
        const filterTypeDoc = data.data.filter((items: any) => {
          return items.xtipoDocumento;
        });

        const info = filterTypeDoc.map(async (items: any) => {
          const filter: any = await this.filterGoodDoc([items.xtipoDocumento]);
          items.xtipoDocumento = filter[0].ddescription;
        });

        Promise.all(info).then(x => {
          this.paragraphs = data.data;
          this.totalItems = this.paragraphs.length;
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
      console.log('aclareaciones', types);
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

  getDocType(event: any) {}

  search(): void {}

  cleanForm(): void {
    this.docRequestForm.reset();
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
    let typeDoc = 'doc-expedient';
    const idExpedient = this.idExpedient;
    //console.log(this.typeDoc);

    let config: ModalOptions = {
      initialState: {
        idrequest,
        idExpedient,
        typeDoc,
        callback: (next: boolean) => {
          if (next) this.getData();
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
