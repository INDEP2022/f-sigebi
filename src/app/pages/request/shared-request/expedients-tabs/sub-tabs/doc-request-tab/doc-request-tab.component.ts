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
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
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
  @Input() updateInfo: boolean = true;
  @Input() displayName: string = '';
  title: string = '';
  showSearchForm: boolean = false;
  selectDocType = new DefaultSelect<any>();
  docRequestForm: ModelForm<any>;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsTypeDoc = new BehaviorSubject<ListParams>(new ListParams());
  paramsRegDel = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: LocalDataSource = new LocalDataSource();
  columns = DOC_REQUEST_TAB_COLUMNS;
  parameter: any;
  type: string = '';
  selectRegDelegation = new DefaultSelect<IDelegation>();
  selectState = new DefaultSelect<any>();
  selectTransfe = new DefaultSelect<any>();
  idRequest: number = 0;
  totalItems: number = 0;
  formLoading: boolean = false;
  allDataDocReq: any[] = [];
  typesDocuments: any = [];
  idDelegation: number = 0;
  idState: string = '';
  statusTask: any = '';
  task: any;
  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    private modalRef: BsModalRef,
    private activatedRoute: ActivatedRoute,
    private wContentService: WContentService,
    private sanitizer: DomSanitizer,
    private regDelService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stateOfRepublicService: StateOfRepublicService,
    private requestService: RequestService
  ) {
    super();
    this.idRequest = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    // DISABLED BUTTON - FINALIZED //
    this.task = JSON.parse(localStorage.getItem('Task'));
    this.statusTask = this.task.status;
    console.log('statustask', this.statusTask);

    this.prepareForm();
    this.getRegDelegation(new ListParams());
    this.getState(new ListParams());
    this.getTransfe(new ListParams());
    this.getDocType(new ListParams());
    this.typeDoc = this.type ? this.type : this.typeDoc;
    if (this.typeDoc === 'doc-request') {
      this.container.createEmbeddedView(this.template);
    }
    this.settings = {
      ...TABLE_SETTINGS,
      actions: {
        delete: true,
        edit: true,
        columnTitle: 'Acciones',
        position: 'right',
      },

      edit: {
        editButtonContent:
          '<i class="fa fa-file text-primary mx-2" > Detalle</i>',
      },
      delete: {
        deleteButtonContent: '<i  class="fa fa-eye text-info mx-2"> Ver</i>',
      },
      columns: DOC_REQUEST_TAB_COLUMNS,
    };

    /*this.columns.button = {
      ...this.columns.button,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick1.subscribe((data: any) => {
          this.openDetail(data);
        }),
        instance.btnclick2.subscribe((data: any) => {
          this.openDoc(data.dDocName);
        });
      },
    }; */

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData(data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let onChangeCurrentValue = changes['typeDoc'].currentValue;
    let updateInfo = changes['updateInfo']?.currentValue;
    this.typeDoc = onChangeCurrentValue;
    this.setTitle(onChangeCurrentValue);
  }

  prepareForm(): void {
    this.docRequestForm = this.fb.group({
      id: [null],
      text: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      docType: [null],
      docTitle: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
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
      noOfice: [null, Validators.maxLength(70)],
      senderCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],
      comment: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      noRequest: [null],
      responsible: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],

      /* Solicitud Transferencia */
      regDelega: [null],
      state: [null],
      tranfe: [null],
    });

    this.docRequestForm.get('noRequest').setValue(this.idRequest);
  }

  getData(params: ListParams) {
    this.loading = true;
    this.getInfoRequest();
    this.docRequestForm.get('noRequest').setValue(this.idRequest);
    const idSolicitud: Object = {
      xidSolicitud: this.idRequest,
    };
    this.wContentService
      .getDocumentos(idSolicitud, params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: async data => {
          console.log('docs', data);
          const transferent = await this.getInfoRequest();
          if (transferent == 1) {
            const filterDoc = data.data.filter((item: any) => {
              if (
                item.dDocType == 'Document' &&
                item.xidTransferente == 1 &&
                item.xidBien == '         '
              ) {
                return item;
              }
            });

            const info = filterDoc.map(async (items: any) => {
              const filter: any = await this.filterGoodDoc([
                items.xtipoDocumento,
              ]);
              if (items?.xdelegacionRegional) {
                const regionalDelegation = await this.getRegionalDelegation(
                  items?.xdelegacionRegional
                );
                items['delegationName'] = regionalDelegation;
              }
              if (items?.xidTransferente) {
                const transferent = await this.getTransferent(
                  items?.xidTransferente
                );
                items['transferentName'] = transferent;
              }
              /*if (items?.xestado) {
                const state = await this.getStateDoc(items?.xestado);
                items['stateName'] = state;
              } */
              items.xtipoDocumento = filter[0]?.ddescription;
              return items;
            });

            Promise.all(info).then(x => {
              this.allDataDocReq = x;
              this.paragraphs.load(x);
              this.totalItems = this.paragraphs.count();
              this.loading = false;
            });
          }

          if (transferent != 1) {
            const filterDoc = data.data.filter((item: any) => {
              if (item.dDocType == 'Document' && item.xidBien == '         ') {
                return item;
              }
            });
            const info = filterDoc.map(async (items: any) => {
              const filter: any = await this.filterGoodDoc([
                items.xtipoDocumento,
              ]);
              if (items?.xdelegacionRegional) {
                const regionalDelegation = await this.getRegionalDelegation(
                  items?.xdelegacionRegional
                );
                items['delegationName'] = regionalDelegation;
              }
              if (items?.xidTransferente) {
                const transferent = await this.getTransferent(
                  items?.xidTransferente
                );
                items['transferentName'] = transferent;
              }
              /*if (items?.xestado) {
                const state = await this.getStateDoc(items?.xestado);
                items['stateName'] = state;
              } */
              items.xtipoDocumento = filter[0]?.ddescription;
              return items;
            });

            Promise.all(info).then(x => {
              this.allDataDocReq = x;
              this.paragraphs.load(x);
              this.totalItems = this.paragraphs.count();
              this.loading = false;
            });
          }
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  getInfoRequest() {
    return new Promise((resolve, reject) => {
      this.requestService.getById(this.idRequest).subscribe({
        next: response => {
          resolve(response.transferenceId);
        },
        error: error => {},
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
        .pipe(takeUntil(this.$unSubscribe))
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

  getRegionalDelegation(id?: number) {
    return new Promise((resolve, reject) => {
      this.regDelService
        .getById(id)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            resolve(data?.description);
          },
          error: error => {},
        });
    });
  }

  getStateDoc(id: number) {
    return new Promise((resolve, reject) => {
      this.stateOfRepublicService
        .getById(id)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            resolve(data?.descCondition);
          },
          error: error => {
            this.loading = false;
          },
        });
    });
  }

  getTransferent(id: number) {
    return new Promise((resolve, reject) => {
      this.transferentService
        .getById(id)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            resolve(data?.nameTransferent);
          },
          error: error => {},
        });
    });
  }

  getDocType(params: ListParams) {
    this.wContentService
      .getDocumentTypes(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (resp: any) => {
          this.typesDocuments = resp.data; //= new DefaultSelect(resp.data, resp.length);
        },
      });
  }

  search(): void {
    const typeDocument = this.docRequestForm.get('docType').value;
    const titleDocument = this.docRequestForm.get('docTitle').value;
    const typeTrasf = this.docRequestForm.get('typeTrasf').value;
    const dDocName = this.docRequestForm.get('dDocName').value;
    const contribuyente = this.docRequestForm.get('contributor').value;
    const author = this.docRequestForm.get('author').value;
    const noOfice = this.docRequestForm.get('noOfice').value;
    const remitente = this.docRequestForm.get('sender').value;
    const senderCharge = this.docRequestForm.get('senderCharge').value;
    const noRequest = this.docRequestForm.get('noRequest').value;
    const comment = this.docRequestForm.get('comment').value;
    const responsible = this.docRequestForm.get('responsible').value;
    const regDelega = this.docRequestForm.get('regDelega').value;
    const state = this.docRequestForm.get('state').value;
    const tranfe = this.docRequestForm.get('tranfe').value;
    if (
      noRequest &&
      !typeDocument &&
      !titleDocument &&
      !noOfice &&
      !dDocName &&
      !contribuyente &&
      !responsible &&
      !author &&
      !comment &&
      !remitente &&
      !senderCharge &&
      !regDelega &&
      !state &&
      !tranfe
    ) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(params => this.getData(params));
    }

    if (typeDocument) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xtipoDocumento == typeDocument) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (titleDocument) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.ddocTitle == titleDocument) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (dDocName) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.dDocName == dDocName) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (typeTrasf) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xtipoTransferencia == typeTrasf) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (contribuyente) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xcontribuyente == contribuyente) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (author) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.dDocAuthor == author) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (remitente) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xremitente == remitente) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (noOfice) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xnoOficio == noOfice) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (senderCharge) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xcargoRemitente == senderCharge) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (comment) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xcomments == comment) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (responsible) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xresponsable == responsible) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (regDelega && !state && !tranfe) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xdelegacionRegional == regDelega) return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (regDelega && state && !tranfe) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xestado == state && items.xdelegacionRegional == regDelega)
          return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (regDelega && state && tranfe) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (
          items.xestado == state &&
          items.xdelegacionRegional == regDelega &&
          items.xdelegacionRegional &&
          items.xidTransferente == tranfe
        )
          return items;
      });

      if (filter.length > 0) {
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }
  }

  cleanForm(): void {
    this.docRequestForm.reset();
    this.docRequestForm.get('noRequest').patchValue(this.idRequest);
    this.allDataDocReq = [];
    this.paragraphs.load([]);
    this.totalItems = 0;
    // this.loading = false;
    // this.getData(new ListParams());
  }

  openDetail(data: any): void {
    this.openModalInformation(data, 'detail');
  }

  openDoc(data: any): void {
    this.wContentService
      .obtainFile(data.dDocName)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
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
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    const idRequest = this.idRequest;
    let typeDoc = 'doc-request';
    config.initialState = {
      idRequest,
      typeDoc,
      callback: (data: boolean) => {
        if (data) {
          this.formLoading = true;
          setTimeout(() => {
            this.getData(new ListParams());
            this.formLoading = false;
          }, 7000);
        }
      },
    };

    this.modalService.show(NewDocumentComponent, config);
  }

  private openModalInformation(data: any, typeInfo: string) {
    let config: ModalOptions = {
      initialState: {
        data,
        typeInfo,
        callback: (next: boolean) => {
          if (next) this.getData(new ListParams());
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SeeInformationComponent, config);
  }

  getRegDelegation(params: ListParams) {
    this.regDelService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.selectRegDelegation = new DefaultSelect(data.data, data.count);
        },
        error: error => {},
      });
  }

  getState(params: ListParams) {
    this.stateOfRepublicService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        this.selectState = new DefaultSelect(data.data, data.count);
      });
  }

  getTransfe(params: ListParams) {
    this.transferentService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        this.selectTransfe = new DefaultSelect(data.data, data.count);
      });
  }

  setTitle(value: string) {
    switch (value) {
      case 'doc-request':
        this.title = 'Solicitud';
        break;
      case 'doc-expedient':
        this.title = 'Expedientes';
        break;
      case 'request-expedient':
        this.title = 'Solicitud';
        break;
      default:
        break;
    }
  }
}
