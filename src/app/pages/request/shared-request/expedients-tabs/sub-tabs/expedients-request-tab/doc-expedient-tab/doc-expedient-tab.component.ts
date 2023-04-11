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
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
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
  paramsDelReg = new BehaviorSubject<ListParams>(new ListParams());
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
  delegationId: number = 0;
  stateId: string = '';
  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    private modalRef: BsModalRef,
    private activatedRoute: ActivatedRoute,
    private wContentService: WContentService,
    private sanitizer: DomSanitizer,
    private requestService: RequestService,
    private delRegService: RegionalDelegationService,
    private stateService: DelegationStateService,
    private transferentService: TransferenteService
  ) {
    super();
    this.idRequest = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.typeDoc = this.type ? this.type : this.typeDoc;
    if (this.typeDoc === 'doc-request') {
      //hacer visible la vista principal y no el ng-template
      this.container.createEmbeddedView(this.template);
    }
    this.prepareForm();
    this.getRegDelegation(new ListParams());
    this.getDocType(new ListParams());
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
      comment: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      noRequest: [null],
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
      this.docRequestForm.get('noRequest').setValue(this.idExpedient);
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
          if (items.dDocType == 'Document') return items;
        });

        const info = filterTypeDoc.map(async (items: any) => {
          const filter: any = await this.filterGoodDoc([items.xtipoDocumento]);
          items.xtipoDocumento = filter[0].ddescription;
          return items;
        });

        Promise.all(info).then(x => {
          console.log('filterTypeDoc', x);
          this.paragraphs = x;
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
    const typeDoc = this.docRequestForm.get('docType').value;
    const delegation = this.docRequestForm.get('regDelega').value;
    const state = this.docRequestForm.get('state').value;
    const transf = this.docRequestForm.get('tranfe').value;
    const titleDoc = this.docRequestForm.get('docTitle').value;
    const sender = this.docRequestForm.get('sender').value;
    const author = this.docRequestForm.get('author').value;
    const contributor = this.docRequestForm.get('contributor').value;
    const noOfice = this.docRequestForm.get('noOfice').value;
    const senderCharge = this.docRequestForm.get('senderCharge').value;
    const comment = this.docRequestForm.get('comment').value;
    const responsible = this.docRequestForm.get('responsible').value;
    const noRequest = this.docRequestForm.get('noRequest').value;

    if (!noRequest) {
      this.onLoadToast(
        'warning',
        'Debes asociar un expediente a la solicitud',
        ''
      );
    }
    if (
      noRequest &&
      !typeDoc &&
      !delegation &&
      !state &&
      !transf &&
      !titleDoc &&
      !sender &&
      !author &&
      !contributor &&
      !noOfice &&
      !senderCharge &&
      !comment &&
      !responsible
    ) {
      this.getRequestData();
    }
    //filtrando por el tipo de documento//
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

    //Filtrando por la delegación regional//
    if (delegation && state == null) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.xdelegacionRegional == delegation) return item;
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

    //Filtrando por estado
    if (state && delegation && transf == null) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.xestado == state && item.xdelegacionRegional == delegation)
          return item;
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

    //Filtrando por transferente//
    if (transf && state && delegation) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (
          item.xestado == state &&
          item.xdelegacionRegional == delegation &&
          item.xidTransferente == transf
        )
          return item;
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

    if (titleDoc) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.ddocTitle == titleDoc) return item;
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

    if (responsible) {
      this.loading = true;
      const filter = this.paragraphs.filter(item => {
        if (item.xresponsable == responsible) return item;
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

  cleanForm(): void {
    this.docRequestForm.reset();
    this.getRequestData();
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
    const idRequest = this.idRequest;
    let typeDoc = 'doc-expedient';
    const idExpedient = this.idExpedient;
    //console.log(this.typeDoc);

    let config: ModalOptions = {
      initialState: {
        idRequest,
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

  getRegDelegation(params: ListParams) {
    this.paramsDelReg;
    this.delRegService.getAll(this.paramsDelReg.getValue()).subscribe({
      next: data => {
        this.selectRegDelegation = new DefaultSelect(data.data, data.count);
      },
      error: error => {},
    });
  }

  delegationSelect(delegation: IDelegation) {
    this.delegationId = delegation.id;
    this.getState(new ListParams());
  }

  getState(params: ListParams) {
    params['filter.regionalDelegation'] = this.delegationId;
    this.stateService.getAll(params).subscribe(data => {
      const filterStates = data.data.filter(_states => {
        return _states.stateCode;
      });

      const states = filterStates.map(items => {
        return items.stateCode;
      });
      this.selectState = new DefaultSelect(states, data.count);
    });
  }

  stateSelect(state: IStateOfRepublic) {
    this.stateId = state.id;
    this.getTransfe(new ListParams());
  }

  getTransfe(params: ListParams) {
    this.transferentService.getByIdState(this.stateId).subscribe({
      next: data => {
        console.log('d', data);
        this.selectTransfe = new DefaultSelect(data.data, data.count);
      },
      error: error => {},
    });
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
