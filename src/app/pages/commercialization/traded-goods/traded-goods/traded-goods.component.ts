import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-traded-goods',
  templateUrl: './traded-goods.component.html',
  styles: [],
})
export class TradedGoodsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  today: Date;
  maxDate: Date;
  minDate: Date;
  params: any;

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private siabService: SiabService
  ) {
    super();
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      typeEvent: [null, [Validators.required]],
      PF_FECINI: [null, [Validators.required]],
      PF_FECFIN: [null, [Validators.required]],
    });
  }
  confirm() {
    const FECIN = new Date(this.form.controls['PF_FECINI'].value);
    const formattedFECIN = this.formatDate(FECIN);

    const FECFIN = new Date(this.form.controls['PF_FECFIN'].value);
    const formattedFECFIN = this.formatDate(FECFIN);

    this.params = {
      PN_DELEGACION: this.form.controls['delegation'].value,
      PN_SUBDELEGACION: this.form.controls['subdelegation'].value,
      TIPO: this.form.controls['typeEvent'].value,
      PF_FECINI: formattedFECIN,
      PF_FECFIN: formattedFECFIN,
    };
    console.log(this.params);

    const start = new Date(this.form.get('PF_FECINI').value);
    const end = new Date(this.form.get('PF_FECFIN').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    if (end < start) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'La fecha final no puede ser menor a fecha inicial'
      );
      return;
    }
    this.onSubmit();
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    this.loading = false;
    this.cleanForm();
  }

  cleanForm(): void {
    this.form.reset();
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

  onSubmit() {
    if (this.params != null) {
      this.siabService.fetchReport('RGERDESBIECOMERCI', this.params).subscribe({
        next: res => {
          if (res !== null) {
            const blob = new Blob([res], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            const blob = new Blob([res], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        },
        error: (error: any) => {
          console.log('error', error);
        },
      });
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }
}
