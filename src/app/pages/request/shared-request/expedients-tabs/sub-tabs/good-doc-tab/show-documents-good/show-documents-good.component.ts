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
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  DOC_GOODS_COLUMNS,
  DOC_REQUEST_TAB_COLUMNS,
} from '../../doc-request-tab/doc-request-tab-columns';
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
  paramsRegDel = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  idGood: number;
  idRequest: number = 0;
  totalItems: number = 0;
  formLoading: boolean = false;
  typesDocuments: any = [];
  allDocumentos: any[] = [];
  idDelegation: number = 0;
  idState: string = '';
  task: any;
  statusTask: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private wContentService: WContentService,
    private sanitizer: DomSanitizer,
    private typeRelevantService: TypeRelevantService,
    private regDelService: RegionalDelegationService,
    private stateService: DelegationStateService,
    private transferentService: TransferenteService,
    private stateOfRepublicService: StateOfRepublicService
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
        editButtonContent:
          '<i class="fa fa-file text-primary mx-2" > Detalle</i>',
      },
      delete: {
        deleteButtonContent: '<i  class="fa fa-eye text-info mx-2"> Ver</i>',
      },
      columns: DOC_GOODS_COLUMNS,
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

  ngOnInit(): void {
    // DISABLED BUTTON - FINALIZED //
    // this.task = JSON.parse(localStorage.getItem('Task'));
    // this.statusTask = this.task.status;
    console.log('statustask', this.statusTask);

    this.prepareForm();
    this.getDocType(new ListParams());
    this.getDocuemntByGood();
    this.getRegDelegation(new ListParams());
    this.getState(new ListParams());
    this.getTransfe(new ListParams());
  }

  prepareForm(): void {
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

    this.docRequestForm.get('noRequest').setValue(this.idGood);
  }

  getDocuemntByGood() {
    this.loading = true;
    const filter: Object = {
      xidBien: this.idGood,
      xidSolicitud: this.idRequest,
    };
    this.docRequestForm.get('noRequest').setValue(this.idGood);
    this.wContentService.getDocumentos(filter).subscribe(data => {
      this.loading = true;
      const info = data.data.filter((doc: any) => {
        if (doc.dDocType == 'Document') return doc;
      });

      const typeDoc = info.map(async (items: any) => {
        const filter: any = await this.filterGoodDoc([items.xtipoDocumento]);
        const regionalDelegation = await this.getRegionalDelegation(
          items.xdelegacionRegional
        );
        const state = await this.getStateDoc(items.xestado);
        const transferent = await this.getTransferent(items.xidTransferente);
        items['delegationName'] = regionalDelegation;
        items['stateName'] = state;
        items['transferentName'] = transferent;
        items.xtipoDocumento = filter[0].ddescription;
        return items;
      });

      Promise.all(typeDoc).then(info => {
        if (info.length == 0) {
          this.onLoadToast(
            'warning',
            'No se le encontraron documentos al bien.',
            ''
          );
          this.loading = false;
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

  getRegionalDelegation(id: number) {
    return new Promise((resolve, reject) => {
      this.regDelService.getById(id).subscribe(data => {
        resolve(data.description);
      });
    });
  }

  getStateDoc(id: number) {
    return new Promise((resolve, reject) => {
      this.stateOfRepublicService.getById(id).subscribe({
        next: data => {
          resolve(data.descCondition);
        },
        error: error => {},
      });
    });
  }

  getTransferent(id: number) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(id).subscribe({
        next: data => {
          resolve(data.nameTransferent);
        },
        error: error => {},
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
    this.wContentService.getDocumentTypes(params).subscribe({
      next: (resp: any) => {
        this.typesDocuments = resp.data; //= new DefaultSelect(resp.data, resp.length);
      },
    });
  }

  getRegDelegation(params: ListParams) {
    this.regDelService.getAll(params).subscribe({
      next: data => {
        this.selectRegDelegation = new DefaultSelect(data.data, data.count);
      },
      error: error => {},
    });
  }

  getState(params: ListParams) {
    this.stateOfRepublicService.getAll(params).subscribe(data => {
      this.selectState = new DefaultSelect(data.data, data.count);
    });
  }

  getTransfe(params: ListParams) {
    this.transferentService.getAll(params).subscribe(data => {
      this.selectTransfe = new DefaultSelect(data.data, data.count);
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
      const filter = this.allDocumentos.filter(item => {
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
      const filter = this.allDocumentos.filter(item => {
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
      const filter = this.allDocumentos.filter(item => {
        if (item.dDocAuthor == author) return item;
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
      const filter = this.allDocumentos.filter(item => {
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
      const filter = this.allDocumentos.filter(item => {
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
      const filter = this.allDocumentos.filter(item => {
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
      const filter = this.allDocumentos.filter(item => {
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

    if (dDocName) {
      this.loading = true;
      const filter = this.allDocumentos.filter(item => {
        if (item.dDocName == dDocName) return item;
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
      const filter = this.allDocumentos.filter(item => {
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

    if (regDelega && !state && !tranfe) {
      const filter = this.allDocumentos.filter((items: any) => {
        if (items.xdelegacionRegional == regDelega) return items;
      });

      if (filter.length > 0) {
        this.onLoadToast('success', 'Documentos encontrados correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
      } else {
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (regDelega && state && !tranfe) {
      const filter = this.allDocumentos.filter((items: any) => {
        if (items.xestado == state && items.xdelegacionRegional == regDelega)
          return items;
      });

      if (filter.length > 0) {
        this.onLoadToast('success', 'Documentos encontrados correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
      } else {
        this.onLoadToast('warning', 'Documentos no encontrados', '');
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
        this.onLoadToast('success', 'Documentos encontrados correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
      } else {
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }

    if (noSiab) {
      const filter = this.allDocumentos.filter((items: any) => {
        if (items.xidSIAB == noSiab) return items;
      });

      if (filter.length > 0) {
        this.onLoadToast('success', 'Documentos encontrados correctamente', '');
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
      } else {
        this.onLoadToast('warning', 'Documentos no encontrados', '');
      }
    }
  }

  openDoc(data: any): void {
    this.wContentService.obtainFile(data.dDocName).subscribe(data => {
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
          this.formLoading = true;
          setTimeout(() => {
            this.onLoadToast('success', 'Documento guardado correctamente', '');
            this.getDocuemntByGood();
            this.formLoading = false;
          }, 8000);
        }
      },
    };
    this.modalService.show(NewDocumentComponent, config);
  }

  updateDocuments() {
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

  close() {
    this.modalRef.hide();
  }

  cleanForm(): void {
    this.docRequestForm.reset();
    this.getDocuemntByGood();
  }
}
