import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  KEYGENERATION_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CancelModalComponent } from '../cancel-modal/cancel-modal.component';
import { FolioModalComponent } from '../folio-modal/folio-modal.component';

@Component({
  selector: 'app-penalty-billing-main',
  templateUrl: './penalty-billing-main.component.html',
  styles: [],
})
export class PenaltyBillingMainComponent implements OnInit {
  layout: string = 'penalty'; // 'penalty', 'bases-sales'
  navigateCount: number = 0; // 'penalty', 'bases-sales'
  maxDate: Date = new Date();
  voucherTypes: any[] = [];
  eventTypes: any[] = [];
  folioData: any = null;
  eventItems = new DefaultSelect();
  batchItems = new DefaultSelect();
  municipalityItems = new DefaultSelect();
  stateItems = new DefaultSelect();
  billingForm: FormGroup = new FormGroup({});
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';

  eventsTestData: any[] = [
    {
      id: 101,
    },
    {
      id: 201,
    },
    {
      id: 301,
    },
    {
      id: 401,
    },
    {
      id: 501,
    },
  ];

  batchesTestData: any[] = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
  ];

  municipalityTestData = [
    {
      description: 'MUNICIPIO 1',
    },
    {
      description: 'MUNICIPIO 2',
    },
    {
      description: 'MUNICIPIO 3',
    },
    {
      description: 'MUNICIPIO 4',
    },
    {
      description: 'MUNICIPIO 5',
    },
  ];

  stateTestData = [
    {
      description: 'ESTADO 1',
    },
    {
      description: 'ESTADO 2',
    },
    {
      description: 'ESTADO 3',
    },
    {
      description: 'ESTADO 4',
    },
    {
      description: 'ESTADO 5',
    },
  ];

  voucherTypeData = [
    {
      type: 'TIPO 1',
    },
    {
      type: 'TIPO 2',
    },
    {
      type: 'TIPO 3',
    },
  ];

  eventTypeData = [
    {
      type: 'TIPO 1',
    },
    {
      type: 'TIPO 2',
    },
    {
      type: 'TIPO 3',
    },
  ];

  folioGeneratedData = {
    series: 'SN',
    folio: 1694,
    status: 'CFDI',
    oiBases: 168197,
    oiBasesDate: '08/11/2021',
    document: 'EJE',
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('type')) {
        if (this.navigateCount > 0) {
          this.folioData = null;
          this.billingForm.reset();
          window.location.reload();
        }
        this.layout = params.get('type');
        this.navigateCount += 1;
      }
    });
    this.prepareForm();
    this.getEvents({ page: 1, text: '' });
    this.getBatches({ page: 1, text: '' });
    this.getMunicipalities({ page: 1, text: '' });
    this.getStates({ page: 1, text: '' });
    this.getTypes();
  }

  private prepareForm(): void {
    this.billingForm = this.fb.group({
      event: [null, [Validators.required]],
      batch: [null, [Validators.required]],
      cve: [null, Validators.pattern(KEYGENERATION_PATTERN)],
      eventDate: [null],
      voucherType: [null, [Validators.required]],
      eventType: [null, [Validators.required]],
      printDate: [null],
      transferor: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      transferorDesc: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegationNumber: [null],
      delegationDesc: [null, Validators.pattern(STRING_PATTERN)],
      authorize: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [null, Validators.pattern(STRING_PATTERN)],
      client: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      rfc: [null, [Validators.required, Validators.pattern(RFC_PATTERN)]],
      street: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      neighborhood: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      municipality: [null, [Validators.required]],
      state: [null, [Validators.required]],
      cp: [null, [Validators.required]],
      price: [null, [Validators.required]],
      saleTax: [null, [Validators.required]],
      total: [null, [Validators.required]],
    });
  }

  getTypes() {
    this.voucherTypes = this.voucherTypeData;
    this.eventTypes = this.eventTypeData;
  }

  getEvents(params: ListParams) {
    if (params.text == '') {
      this.eventItems = new DefaultSelect(this.eventsTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.eventsTestData.filter((i: any) => i.id == id)];
      this.eventItems = new DefaultSelect(item[0], 1);
    }
  }

  getBatches(params: ListParams) {
    if (params.text == '') {
      this.batchItems = new DefaultSelect(this.batchesTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.batchesTestData.filter((i: any) => i.id == id)];
      this.batchItems = new DefaultSelect(item[0], 1);
    }
  }

  getMunicipalities(params: ListParams) {
    if (params.text == '') {
      this.municipalityItems = new DefaultSelect(this.municipalityTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.municipalityTestData.filter((i: any) => i.id == id)];
      this.municipalityItems = new DefaultSelect(item[0], 1);
    }
  }

  getStates(params: ListParams) {
    if (params.text == '') {
      this.stateItems = new DefaultSelect(this.stateTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.stateTestData.filter((i: any) => i.id == id)];
      this.stateItems = new DefaultSelect(item[0], 1);
    }
  }

  generateFolios() {
    switch (this.layout) {
      case 'penalty':
        this.folioData = this.folioGeneratedData;
        break;
      case 'bases-sales':
        this.folioData = this.folioGeneratedData;
        break;
      default:
        break;
    }
  }

  deleteFolios() {}

  openPrevInvoice() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getImage() {
    const filename = 'Invoice_000_exported';
    FileSaver.saveAs(this.imagenurl, filename + '.jpg');
  }

  openFolioModal() {
    const modalRef = this.modalService.show(FolioModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelected.subscribe((data: boolean) => {
      if (data) this.addReservedFolio(data);
    });
  }

  openCancelModal() {
    const modalRef = this.modalService.show(CancelModalComponent, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onCancel.subscribe((data: boolean) => {
      if (data) this.cancelInvoice();
    });
  }

  addReservedFolio(folio: any) {
    console.log(folio);
  }

  cancelInvoice() {
    this.billingForm.reset();
    this.folioData = null;
  }
}
