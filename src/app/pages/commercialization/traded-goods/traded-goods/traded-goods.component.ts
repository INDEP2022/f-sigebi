import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
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

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
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
    let params = {
      PN_DELEGACION: this.form.controls['delegation'].value,
      PN_SUBDELEGACION: this.form.controls['subdelegation'].value,
      TIPO: this.form.controls['typeEvent'].value,
      PF_FECINI: this.form.controls['PF_FECINI'].value,
      PF_FECFIN: this.form.controls['PF_FECFIN'].value,
    };
    console.log(params);

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
        'fecha de final no puede ser menor a fecha inicial'
      );
      return;
    }

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FGERDESLICITXBIEN.pdf?PN_DELEGACION=${params.PN_DELEGACION}&PN_SUBDELEGACION=${params.PN_SUBDELEGACION}&TIPO=${params.TIPO}&PF_FECINI=${params.PF_FECINI}&PF_FECFIN=${params.PF_FECFIN}`;
    const pdfurl = `https://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'FGERDESLICITXBIEN.pdf');
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
}
