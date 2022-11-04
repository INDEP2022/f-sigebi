import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { maxDate } from 'src/app/common/validations/date.validators';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pe-cmrd-c-cumulative-goods',
  templateUrl: './pe-cmrd-c-cumulative-goods.component.html',
  styles: [],
})
export class PeCmrdCCumulativeGoodsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  modeMonth: BsDatepickerViewMode = 'month'; // change for month:year
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsConfigToMonth: Partial<BsDatepickerConfig>;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.modeMonth,
        dateInputFormat: 'MMMM',
      }
    );
    this.bsConfigToMonth = Object.assign(
      {},
      {
        minMode: this.modeMonth,
        dateInputFormat: 'MMMM',
      }
    );
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [''],
      subdelegation: [''],
      toMonth: [null, [Validators.required, maxDate(new Date())]],
      fromMonth: [null, [Validators.required, maxDate(new Date())]],
    });
  }

  openPrevPdf() {
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
}
