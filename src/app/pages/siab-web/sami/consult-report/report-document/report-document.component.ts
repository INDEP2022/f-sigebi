import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DOC_EXPEDIENT_COLUMNS } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/doc-request-tab/doc-request-tab-columns';

@Component({
  selector: 'app-report-document',
  templateUrl: './report-document.component.html',
  styleUrls: ['../report-good/report-good.component.scss'],
})
export class ReportDocumentComponent extends BasePage implements OnInit {
  typesDocuments: any[] = [];
  showSearchForm: boolean = false;
  formLoading: boolean = false;
  idExpedient: number = 0;
  docRequestForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  paragraphs: any[] = [];
  allDocumentExpedient: any[] = [];
  paramsTypeDoc = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private wContentService: WContentService,
    private fb: FormBuilder
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        edit: true,
        delete: true,
        columnTitle: 'Acciones',
        position: 'right',
      },

      edit: {
        editButtonContent: '<i class="fa fa-file text-primary mx-2"></i>',
      },

      delete: {
        deleteButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
      },
      columns: DOC_EXPEDIENT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getDocType(new ListParams());
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      sender: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      noOfice: [null, [Validators.maxLength(60)]],
      senderCharge: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      comment: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      noRequest: [null],
      responsible: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
      ],

      /* Solicitud Transferencia */
      regDelega: [null],
      state: [null],
      tranfe: [null],
    });
  }

  getDocType(params: ListParams) {
    this.wContentService.getDocumentTypes(params).subscribe({
      next: (resp: any) => {
        this.typesDocuments = resp.data; //= new DefaultSelect(resp.data, resp.length);
      },
    });
  }
  openNewDocument() {
    /*const idRequest = this.idRequest;
    let typeDoc = 'doc-expedient';
    const idExpedient = this.idExpedient;

    let config: ModalOptions = {
      initialState: {
        idRequest,
        idExpedient,
        typeDoc,
        callback: (next: boolean) => {
          if (next) {
            this.formLoading = true;
            setTimeout(() => {
              this.getData();
              this.formLoading = false;
            }, 7000);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewDocumentComponent, config); */
  }

  getRequestData() {
    this.getData();
  }

  openDetail(data: any): void {
    //this.openModalInformation(data, 'detail');
  }

  openDoc(data: any): void {
    /*this.wContentService.obtainFile(data.dDocName).subscribe(data => {
      let blob = this.dataURItoBlob(data);
      let file = new Blob([blob], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.openPrevPdf(fileURL);
    }); */
  }

  search() {
    console.log('data', this.docRequestForm.value);
    const typeDoc = this.docRequestForm.get('docType').value;
    const typeTrasf = this.docRequestForm.get('typeTrasf').value;
    const titleDoc = this.docRequestForm.get('docTitle').value;
    const dDocName = this.docRequestForm.get('dDocName').value;
    const sender = this.docRequestForm.get('sender').value;
    const author = this.docRequestForm.get('author').value;
    const contributor = this.docRequestForm.get('contributor').value;
    const noOfice = this.docRequestForm.get('noOfice').value;
    const senderCharge = this.docRequestForm.get('senderCharge').value;
    const comment = this.docRequestForm.get('comment').value;
    const responsible = this.docRequestForm.get('responsible').value;
    const noRequest = this.docRequestForm.get('noRequest').value;

    if (
      !noRequest &&
      !typeDoc &&
      !titleDoc &&
      !typeTrasf &&
      !dDocName &&
      !sender &&
      !author &&
      !contributor &&
      !noOfice &&
      !senderCharge &&
      !comment &&
      !responsible
    ) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Ingresa el número de expediente'
      );
    }

    if (
      noRequest &&
      !typeDoc &&
      !titleDoc &&
      !typeTrasf &&
      !dDocName &&
      !sender &&
      !author &&
      !contributor &&
      !noOfice &&
      !senderCharge &&
      !comment &&
      !responsible
    ) {
      this.idExpedient = noRequest;
      this.getData();
    }

    if (typeDoc) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.xtipoDocumento == typeDoc) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.paragraphs = filter;
        this.loading = false;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (dDocName) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.dDocName == dDocName) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.paragraphs = filter;
        this.loading = false;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (typeTrasf) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.xtipoTransferencia == typeTrasf) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
        this.paragraphs = filter;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (titleDoc) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.ddocTitle == titleDoc) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
        this.paragraphs = filter;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (sender) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.xremitente == sender) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
        this.paragraphs = filter;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (author) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.dDocAuthor == author) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
        this.paragraphs = filter;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (contributor) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.xcontribuyente == contributor) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
        this.paragraphs = filter;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (noOfice) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.xnoOficio == noOfice) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
        this.paragraphs = filter;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (senderCharge) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.xcargoRemitente == senderCharge) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
        this.paragraphs = filter;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (comment) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.xcomments == comment) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
        this.paragraphs = filter;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }

    if (responsible) {
      this.loading = true;
      const filter = this.allDocumentExpedient.filter(item => {
        if (item.xresponsable == responsible) return item;
      });

      if (filter.length == 0) {
        this.onLoadToast('warning', 'No se encontraron registros', '');
        this.loading = false;
        this.paragraphs = filter;
      } else {
        this.paragraphs = filter;
        this.totalItems = this.paragraphs.length;
        this.loading = false;
      }
    }
  }

  getData() {
    this.loading = true;
    const body = {
      //xidSolicitud: this.idRequest,
      xidExpediente: this.idExpedient,
    };

    this.wContentService.getDocumentos(body).subscribe({
      next: async (data: any) => {
        const filterTypeDoc = data.data.filter((items: any) => {
          if (items.dDocType == 'Document' && items.xidTransferente)
            return items;
        });

        const info = filterTypeDoc.map(async (items: any) => {
          const filter: any = await this.filterGoodDoc([items.xtipoDocumento]);
          items.xtipoDocumento = filter[0]?.ddescription;
          return items;
        });

        Promise.all(info).then(x => {
          this.paragraphs = x;
          this.allDocumentExpedient = this.paragraphs;
          this.totalItems = this.paragraphs.length;
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

  cleanForm() {
    this.docRequestForm.reset();
    this.getData();
  }
}
