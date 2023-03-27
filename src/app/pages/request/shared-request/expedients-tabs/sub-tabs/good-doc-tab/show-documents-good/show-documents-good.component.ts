import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
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
  paragraphs: LocalDataSource = new LocalDataSource();
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
        this.paragraphs.load(info);
        this.totalItems = this.paragraphs.count();
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

  getDocType(event: any) {}

  getRegDelegation(event: any) {}

  getState(event: any) {}

  getTransfe(event: any) {}

  search(): void {}

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
          this.paragraphs = new LocalDataSource();
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
  }
}
