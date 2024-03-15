import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { isNullOrEmpty } from 'src/app/pages/request/request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
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
  @Input() typeModule?: string = '';
  @Input() requestId?: number = null; // se pasa desde el padre en algunos componentes
  title: string = '';
  showSearchForm: boolean = false;
  selectDocType = new DefaultSelect<any>();
  docRequestForm: ModelForm<any>;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsTypeDoc = new BehaviorSubject<ListParams>(new ListParams());
  paramsRegDel = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: LocalDataSource = new LocalDataSource();
  paragraphs1: any[] = [];
  docRequest: any[] = [];
  docExpedient: any[] = [];
  columns = DOC_REQUEST_TAB_COLUMNS;
  parameter: any;
  type: string = '';
  selectRegDelegation = new DefaultSelect<IDelegation>();
  selectState = new DefaultSelect<any>();
  selectTransfe = new DefaultSelect<any>();
  idRequest: number = 0;
  recordId: number = 0;
  requestInfo: IRequest;
  totalItems: number = 0;
  formLoading: boolean = false;
  allDataDocReq: any[] = [];
  typesDocuments: any = [];
  idDelegation: number = 0;
  idState: string = '';
  statusTask: any = '';
  task: any;
  process: string = '';

  @Output() onChange = new EventEmitter<any>();

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
    private requestService: RequestService,
    private route: ActivatedRoute
  ) {
    super();
    this.idRequest = this.idRequest
      ? this.idRequest
      : (this.activatedRoute.snapshot.paramMap.get('id') as unknown as number);
  }

  ngOnInit(): void {
    this.task = JSON.parse(localStorage.getItem('Task'));
    this.statusTask = this.task?.status;
    this.process = this.route.snapshot.paramMap.get('process');

    this.prepareForm();
    this.getRegDelegation(new ListParams());
    this.getState(new ListParams());
    this.getTransfe(new ListParams());
    this.getDocType(new ListParams());
    this.typeDoc = this.type ? this.type : this.typeDoc;
    if (this.typeDoc === 'doc-request' || this.typeDoc === 'doc-expedient') {
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
        editButtonContent: '<i class="fa fa-file text-primary mx-2" > </i>',
      },
      delete: {
        deleteButtonContent: '<i  class="fa fa-eye text-info mx-2"> </i>',
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
  }

  getInfoRequest() {
    this.requestService.getById(this.idRequest).subscribe({
      next: response => {
        this.recordId = response.recordId;
        this.requestInfo = response;
        this.docRequestForm.get('recordId').setValue(response.recordId);
        this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
          this.getData(data);
        });
      },
      error: error => {},
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.idRequest = this.idRequest || this.requestId;
    if (
      this.typeModule != '' &&
      this.typeModule == 'doc-complementary' &&
      !this.idRequest
    ) {
      this.idRequest = this.activatedRoute.snapshot.paramMap.get(
        'request'
      ) as unknown as number;
    }

    this.getInfoRequest();

    if (!isNullOrEmpty(changes['typeDoc'])) {
      let onChangeCurrentValue = changes['typeDoc'].currentValue;
      this.typeDoc = onChangeCurrentValue;
      this.setTitle(onChangeCurrentValue);
    }

    //let updateInfo = changes['updateInfo']?.currentValue;
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
      recordId: [null],
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
  private data: any[][] = [];

  getData(params: ListParams, filter: any = {}) {
    this.loading = true;
    this.docRequestForm.get('noRequest').setValue(this.requestInfo.id);

    filter.xidSolicitud = this.requestInfo.id;

    this.wContentService
      .getDocumentos(filter, params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: async res => {
          this.data = [];
          if (
            this.typeDoc == 'doc-request' ||
            this.typeDoc == 'request-expedient'
          ) {
            if (this.requestInfo.transferenceId == 1) {
              const filterDoc = res.data.filter((item: any) => {
                if (
                  item.dDocType == 'Document'
                  //VALIDAR FILTRO COMMENT
                  //&&
                  //item.xidBien == '         '
                ) {
                  return item;
                }
              });
              const info = filterDoc.map(async (items: any) => {
                const typedoc = this.typesDocuments.filter(
                  x => parseInt(x.ddocType) == parseInt(items.xtipoDocumento)
                );

                /*if (items?.xdelegacionRegional) {
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
                if (items?.xestado) {
                const state = await this.getStateDoc(items?.xestado);
                items['stateName'] = state;
              } */
                if (isNullOrEmpty(items.xfecha)) {
                  items.xfecha = moment.utc(items.dInDate);
                }
                items.xtipoDocumentoId = items.xtipoDocumento + '';
                items.xtipoDocumento = typedoc[0]?.ddescription;
                return items;
              });
              if (this.data.length == 0) {
                Promise.all(info).then(data => {
                  this.docRequest =
                    res.data.length > 10 ? this.setPaginate([...data]) : data;
                  this.totalItems = data.length;

                  this.loading = false;
                  this.allDataDocReq = this.docRequest; // Asigna los datos a allDataDocReq
                  this.onChanges();
                  //this.paragraphs.load(x);
                });
                return;
              } else {
                this.selectPage();
                this.loading = false;
              }
            }

            if (this.requestInfo.transferenceId != 1) {
              const filterDoc = res.data.filter((item: any) => {
                if (
                  item.dDocType == 'Document'
                  //&&
                  //item.xidBien == '         '
                ) {
                  return item;
                }
              });
              const info = filterDoc.map(async (items: any) => {
                const typedoc = this.typesDocuments.filter(
                  x => parseInt(x.ddocType) == parseInt(items.xtipoDocumento)
                );

                /*if (items?.xdelegacionRegional) {
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
              }*/
                /*if (items?.xestado) {
                const state = await this.getStateDoc(items?.xestado);
                items['stateName'] = state;
              } */
                if (isNullOrEmpty(items.xfecha)) {
                  items.xfecha = moment.utc(items.dInDate);
                }
                items.xtipoDocumentoId = items.xtipoDocumento + '';
                items.xtipoDocumento = typedoc[0]?.ddescription;
                return items;
              });
              if (this.data.length == 0) {
                Promise.all(info).then(data => {
                  this.docRequest =
                    res.data.length > 10 ? this.setPaginate([...data]) : data;
                  this.totalItems = data.length;
                  this.loading = false;
                  this.allDataDocReq = this.docRequest; // Asigna los datos a allDataDocReq
                  this.onChanges();
                  //this.paragraphs.load(x);
                });
                return;
              } else {
                this.selectPage();
                this.loading = false;
              }
            }
          }

          if (
            this.typeDoc == 'doc-expedient' ||
            this.typeDoc == 'request-assets'
          ) {
            if (
              this.requestInfo.transferenceId != 1 &&
              this.requestInfo.recordId
            ) {
              const filterDoc = res.data.filter((item: any) => {
                if (
                  item.dDocType == 'Document' &&
                  item.xidBien == '         ' &&
                  item.xidExpediente == this.requestInfo.recordId
                ) {
                  return item;
                }
              });
              const info = filterDoc.map(async (items: any) => {
                const typedoc = this.typesDocuments.filter(
                  x => parseInt(x.ddocType) == parseInt(items.xtipoDocumento)
                );

                /*if (items?.xdelegacionRegional) {
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
              }*/
                /*if (items?.xestado) {
                const state = await this.getStateDoc(items?.xestado);
                items['stateName'] = state;
              } */
                if (isNullOrEmpty(items.xfecha)) {
                  items.xfecha = moment.utc(items.dInDate);
                }
                items.xtipoDocumentoId = parseInt(items.xtipoDocumento);
                items.xtipoDocumento = typedoc[0]?.ddescription;
                return items;
              });
              if (this.data.length == 0) {
                Promise.all(info).then(data => {
                  this.docExpedient =
                    res.data.length > 10 ? this.setPaginate([...data]) : data;
                  this.totalItems = data.length;
                  this.loading = false;
                  this.allDataDocReq = this.docRequest; // Asigna los datos a allDataDocReq
                  this.onChanges();
                  //this.paragraphs.load(x);
                });
                return;
              } else {
                this.selectPageEx();
                this.loading = false;
              }
            }

            if (
              this.requestInfo.transferenceId != 1 &&
              this.requestInfo.recordId
            ) {
              const filterDoc = res.data.filter((item: any) => {
                if (
                  item.dDocType == 'Document' &&
                  item.xidBien == '         ' &&
                  item.xidExpediente == this.requestInfo.recordId
                ) {
                  return item;
                }
              });
              const info = filterDoc.map(async (items: any) => {
                const filter: any = await this.filterGoodDoc([
                  items.xtipoDocumento,
                ]);
                /*if (items?.xdelegacionRegional) {
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
              }*/
                /*if (items?.xestado) {
                const state = await this.getStateDoc(items?.xestado);
                items['stateName'] = state;
              } */
                if (isNullOrEmpty(items.xfecha)) {
                  items.xfecha = moment.utc(items.dInDate);
                }
                items.xtipoDocumentoId = items.xtipoDocumento + '';
                items.xtipoDocumento = filter[0]?.ddescription;
                return items;
              });
              if (res.data.length > 0) {
                Promise.all(info).then(data => {
                  this.docExpedient =
                    res.data.length > 10 ? this.setPaginate([...data]) : data;
                  this.totalItems = data.length;
                  this.loading = false;
                  this.allDataDocReq = this.docRequest; // Asigna los datos a allDataDocReq
                  this.onChanges();
                  //this.paragraphs.load(x)
                });
                return;
              } else {
                this.selectPageEx();
                this.loading = false;
              }
            }
          }

          this.onChanges();
          this.loading = false;
        },
        error: error => {
          this.onChanges();
          this.loading = false;
        },
      });
  }
  private selectPage() {
    if (this.data.length > 0) {
      this.docRequest = [...this.data[this.params.value.page - 1]];
    }
  }
  private selectPageEx() {
    if (this.data.length > 0) {
      this.docExpedient = [...this.data[this.params.value.page - 1]];
    }
  }
  private setPaginate(value: any[]): any[] {
    let data: any[] = [];
    let dataActual: any = [];
    value.forEach((val, i) => {
      dataActual.push(val);
      if ((i + 1) % this.params.value.limit === 0) {
        this.data.push(dataActual);
        dataActual = [];
      } else if (i === value.length - 1) {
        this.data.push(dataActual);
      }
    });
    data = this.data[this.params.value.page - 1];
    return data;
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

  /*getTransferent(id: number) {
    return new Promise((resolve, reject) => {
      this.transferentService
        .getById(id)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            console.log('Método getTransferent');
            resolve(data?.nameTransferent);
          },
          error: error => {},
        });
    });
  }*/

  getDocType(params: ListParams) {
    this.wContentService
      .getDocumentTypes(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (resp: any) => {
          this.typesDocuments = resp.data; //= new DefaultSelect(resp.data, resp.length);
          this.getInfoRequest();
        },
      });
  }

  search(): void {
    //this.params = new BehaviorSubject<ListParams>(new ListParams());

    let object: any = this.getFilterDocuments(
      this.docRequestForm.getRawValue()
    );

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => this.getData(params, object));

    if (true) return;

    console.log('object', object);
    if (
      object.noRequest &&
      !object.docType &&
      !object.docTitle &&
      !object.noOfice &&
      !object.dDocName &&
      !object.contributor &&
      !object.responsible &&
      !object.author &&
      !object.comment &&
      !object.sender &&
      !object.senderCharge &&
      !object.regDelega &&
      !object.state &&
      !object.tranfe
    ) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(params => this.getData(params));
    }

    if (object.docType) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xtipoDocumento == object.docType) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.docTitle) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.ddocTitle == object.docTitle) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      console.log('filter', filter);

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        console.log('object.docTitle', object.docTitle);

        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.dDocName) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.dDocName == object.dDocName) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.tranfe) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xtipoTransferencia == object.tranfe) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.contributor) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xcontribuyente == object.contributor) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.author) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.dDocAuthor == object.author) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.sender) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xremitente == object.sender) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.noOfice) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xoficio == object.noOfice) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.senderCharge) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xcargoRemitente == object.senderCharge) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.comment) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xcomentario == object.comment) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.responsible) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xresponsable == object.responsible) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.regDelega && !object.state && !object.tranfe) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (items.xdelegacionRegional == object.regDelega) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.regDelega && object.state && !object.tranfe) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (
          items.xestado == object.state &&
          items.xdelegacionRegional == object.regDelega
        ) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }

    if (object.regDelega && object.state && object.tranfe) {
      const filter = this.allDataDocReq.filter((items: any) => {
        if (
          items.xestado == object.state &&
          items.xdelegacionRegional == object.regDelega &&
          items.xtipoTransferencia == object.tranfe
        ) {
          return true; // Devuelve true para mantener este elemento
        }
        return false; // Devuelve false para eliminar este elemento
      });

      if (filter.length > 0) {
        this.docRequest = filter; // Asigna los datos filtrados a docRequest
        this.paragraphs.load(filter);
        this.totalItems = this.paragraphs.count();
      } else {
        this.paragraphs.load(filter);
        this.onLoadToast('warning', 'Documentos no encontrados', '');
        return;
      }
    }
  }

  cleanForm(): void {
    this.docRequestForm.reset();
    this.docRequestForm.get('noRequest').patchValue(this.idRequest);
    this.docRequestForm.get('recordId').patchValue(this.recordId);
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
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    };
    const idRequest = this.idRequest;
    const typeDoc = this.typeDoc;
    const idExpedient = this.requestInfo.recordId;
    config.initialState = {
      idRequest,
      typeDoc,
      idExpedient,
      callback: (data: boolean) => {
        if (data) {
          this.formLoading = true;
          setTimeout(() => {
            this.getData(new ListParams());
            this.formLoading = false;
          }, 10000);
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
          if (next) {
          }
          this.getData(new ListParams());
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

  onChanges() {
    let list =
      this.docExpedient.length > 0 ? this.docExpedient : this.docRequest;

    let toks = [136, 138, 131, 125, 30, 148, 166, 31, 182, 32, 158, 178];
    let containDocCom = false;
    let validToks = false;

    containDocCom = list.some(x => toks.includes(parseInt(x.xtipoDocumentoId)));

    if (list.length > 0) {
      switch (this.process) {
        case 'register-seizures':
        case 'register-consfiscation-sentence':
        case 'register-confiscation-confirmed':
        case 'register-office-cancellation':
        case 'register-registration-sentence':
        case 'register-freedom-liens':
        case 'register-distribution-resource':
          if (containDocCom) {
            validToks = true;
          }
          break;

        case 'register-abandonment-goods':
        case 'register-abandonment-instruction':
        case 'register-declaration-abandonment':
          let hasType51 = list.some(x => parseInt(x.xtipoDocumentoId) === 51);
          let hasType146 = list.some(x => parseInt(x.xtipoDocumentoId) === 146);

          if (hasType146 && hasType51 && containDocCom) {
            validToks = true;
          }
          break;

        case 'register-domain-extinction':
        case 'register-extinction-sentence':
        case 'register-extinction-agreement':
          let hasType83 = list.some(x => parseInt(x.xtipoDocumentoId) === 83);
          if (hasType83 && containDocCom) {
            validToks = true;
          }
          break;

        default:
          if (containDocCom) {
            validToks = true;
          }
          break;
      }
    }

    //let list2 = list.filter(x => toks.includes(parseInt(x.xtipoDocumentoId)));

    this.onChange.emit({
      isValid: validToks,
      object: list,
      type: this.typeDoc,
    });
  }

  getFilterDocuments(filter) {
    let request = {
      dDocTitle: filter.docTitle,
      dDocAuthor: filter.author,
      dDocCreator: null,
      dDocName: filter.dDocName,
      dSecurityGroup: null,
      dRevLabel: null,
      xidTransferente: null,
      xidBien: null,
      xnoOficio: filter.noOfice,
      xremitente: filter.sender,
      xidExpediente: null,
      xtipoTransferencia: filter.typeTrasf,
      xidSolicitud: this.idRequest,
      xresponsable: filter.responsible,
      xcargoRemitente: filter.senderCharge,
      xComments: filter.comment,
      xcontribuyente: filter.contributor,
      xciudad: null,
      xestado: null,
      xfecha: null,
      xbanco: null,
      xclaveValidacion: null,
      xcuenta: null,
      xdependenciaEmiteDoc: null,
      xfechaDeposito: null,
      xfolioActa: null,
      xfolioActaDestruccion: null,
      xfolioActaDevolucion: null,
      xfolioContrato: null,
      xfolioDenuncia: null,
      xfolioDictamenDestruccion: null,
      xfolioDictamenDevolucion: null,
      xfolioDictamenResarcimiento: null,
      xfolioFactura: null,
      xfolioNombramiento: null,
      xfolioSISE: null,
      xmonto: null,
      xnoAcuerdo: null,
      xnoAutorizacionDestruccion: null,
      xnoConvenioColaboracion: null,
      xnoFolioRegistro: null,
      xnoOficioAutorizacion: null,
      xnoOficioAvaluo: null,
      xnoOficioCancelacion: null,
      xnoOficioProgramacion: null,
      xnoOficioSolAvaluo: null,
      xnoOficoNotificacion: null,
      xnoRegistro: null,
      xNivelRegistroNSBDB: null,
      xTipoDocumento: filter.docType,
      texto: filter.text,
      xDelegacionRegional: null,
      xNoProgramacion: null,
      xFolioProgramacion: null,
      xNoActa: null,
      xNoRecibo: null,
      xFolioRecibo: null,
      xIdConstanciaEntrega: null,
      xNombreProceso: null,
      xIdSIAB: null,
    };
    for (const key in request) {
      if (request[key] == null) {
        delete request[key];
      }
    }
    return request;
  }
}
