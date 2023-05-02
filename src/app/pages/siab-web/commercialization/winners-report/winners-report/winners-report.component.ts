import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { WINNERS_REPORT_COLUMNS } from './winners-report-columns';

@Component({
  selector: 'app-winners-report',
  templateUrl: './winners-report.component.html',
  styles: [],
})
export class winnersReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup([]);
  showWinners = false;
  showNotWinners = false;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...WINNERS_REPORT_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getPagination();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
    });
  }

  data = [
    {
      idEvent: 564,
      allotment: 987,
      reference: 'Referencia 465',
      amount: '$100,515.00',
      payDate: '21/05/2015',
      cveBank: 323213,
      bill: 987,
      idClient: 3213,
      client: 'Manuel',
      rfc: 'XXXX0000',
      tel: '272-102-65-45',
      email: 'emai@hotmail.com',
      clabe: '1321313123131132',
      bank: 'Banamex',
      branchOffice: 101,
      checkAccount: 65461,
    },
  ];

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }
}
