import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DOC_SCHEDULE_TAB_COLUMNS } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/doc-request-tab/doc-request-tab-columns';
import { SeeInformationComponent } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/doc-request-tab/see-information/see-information.component';
import { NewDocumentComponent } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/new-document/new-document.component';

@Component({
  selector: 'app-report-document-schedule',
  templateUrl: './report-document-schedule.component.html',
  styleUrls: ['../report-good/report-good.component.scss'],
})
export class ReportDocumentScheduleComponent
  extends BasePage
  implements OnInit
{
  showSearchForm: boolean = true;
  formLoading: boolean = false;
  docRequestForm: FormGroup = new FormGroup({});
  typesDocuments: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsTypeDoc = new BehaviorSubject<ListParams>(new ListParams());
  docRequest: any[] = [];
  totalItems: number = 0;
  programmingId: number = 0;
  allDataDocProg: any[] = [];
  paragraphs: LocalDataSource = new LocalDataSource();
  pageSizeOptions: number[] = [10, 25, 50, 100];
  private data: any[][] = [];
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private wContentService: WContentService,
    private sanitizer: DomSanitizer
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
          '<i class="fa fa-file text-primary mx-2 ml-4" > </i>',
      },
      delete: {
        deleteButtonContent: '<i  class="fa fa-eye text-info mx-2"> </i>',
      },
      columns: DOC_SCHEDULE_TAB_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => this.getData(params));
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
      noSchedule: [null],
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

    //this.docRequestForm.get('noRequest').setValue(this.idRequest);
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

  getData(params: ListParams) {
    this.loading = true;
    const programming: Object = {
      xnoProgramacion: this.docRequestForm.get('noSchedule').value,
    };
    this.wContentService
      .getDocumentos(programming, params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: async res => {
          this.data = [];
          this.loading = false;
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
            const filter: any = await this.filterGoodDoc([
              items.xtipoDocumento,
            ]);

            items.xtipoDocumento = filter[0]?.ddescription;
            return items;
          });
          if (this.data.length == 0) {
            Promise.all(info).then(data => {
              this.docRequest =
                res.data.length > 10 ? this.setPaginate([...data]) : data;
              this.totalItems = data.length;

              this.loading = false;
              this.allDataDocProg = data;
              //this.paragraphs.load(x);
            });
          } else {
            this.selectPage();
            this.loading = false;
          }
        },
        error: () => {
          this.alert(
            'warning',
            'Acción Invalida',
            'La programación no cuenta con documentos'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
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

  openNewDocument() {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    };
    const idRequest = 0;
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

  search() {
    const typeDocument = this.docRequestForm.get('docType').value;
    const titleDocument = this.docRequestForm.get('docTitle').value;
    const typeTrasf = this.docRequestForm.get('typeTrasf').value;
    const dDocName = this.docRequestForm.get('dDocName').value;
    const contribuyente = this.docRequestForm.get('contributor').value;
    const author = this.docRequestForm.get('author').value;
    const noOfice = this.docRequestForm.get('noOfice').value;
    const remitente = this.docRequestForm.get('sender').value;
    const senderCharge = this.docRequestForm.get('senderCharge').value;
    const noSchedule = this.docRequestForm.get('noSchedule').value;
    const comment = this.docRequestForm.get('comment').value;
    const responsible = this.docRequestForm.get('responsible').value;
    const regDelega = this.docRequestForm.get('regDelega').value;
    const state = this.docRequestForm.get('state').value;
    const tranfe = this.docRequestForm.get('tranfe').value;

    if (this.allDataDocProg.length > 0) {
      this.loading = true;
      if (titleDocument) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.ddocTitle == titleDocument) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (dDocName) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.dDocName == dDocName) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (typeDocument) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.xtipoDocumento == typeDocument) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (typeTrasf) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.xtipoTransferencia == typeTrasf) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (contribuyente) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.xcontribuyente == contribuyente) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (author) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.dDocAuthor == author) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (remitente) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.xremitente == remitente) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (noOfice) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.xnoOficio == noOfice) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (senderCharge) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.xcargoRemitente == senderCharge) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (comment) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.xcomments == comment) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (responsible) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.xresponsable == responsible) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }

      if (noSchedule) {
        const filter = this.allDataDocProg.filter((items: any) => {
          if (items.xnoProgramacion == noSchedule) return items;
        });

        if (filter.length > 0) {
          this.docRequest =
            filter.length > 10 ? this.setPaginate([...filter]) : filter;
          this.totalItems = filter.length;
          this.loading = false;
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'Documentos no encontrados'
          );
          this.loading = false;
          this.docRequest = [];
          this.totalItems = 0;
          this.pageSizeOptions = [10];
        }
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere visualizar la información en la tabla para filtrar la información'
      );
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

  private selectPage() {
    this.docRequest = [...this.data[this.params.value.page - 1]];
  }

  cleanForm() {
    this.docRequestForm.reset();
    this.docRequest = [];
    this.totalItems = 0;
    this.pageSizeOptions = [10];
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => this.getData(params));
  }
}
