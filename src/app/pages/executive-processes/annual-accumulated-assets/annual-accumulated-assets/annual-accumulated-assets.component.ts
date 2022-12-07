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
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-annual-accumulated-assets',
  templateUrl: './annual-accumulated-assets.component.html',
  styles: [],
})
export class AnnualAccumulatedAssetsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  bsConfigToYear: Partial<BsDatepickerConfig>;
  bsConfigFromYear: Partial<BsDatepickerConfig>;

  mode: BsDatepickerViewMode = 'year'; // change for month:year

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfigToYear = Object.assign(
      {},
      {
        minMode: this.mode,
        dateInputFormat: 'YYYY',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.mode,
        dateInputFormat: 'YYYY',
      }
    );
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [''],
      subdelegation: [''],
      fromYear: [null, [Validators.required, maxDate(new Date())]],
      toYear: [null, [Validators.required, maxDate(new Date())]],
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
