import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-commercial-file',
  templateUrl: './commercial-file.component.html',
  styles: [],
})
export class CommercialFileComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
  // pdfurl = `https://drive.google.com/file/d/1PwfG-hqQzsL4ZSGheQJHkHsWJDsW0hwG/view?usp=sharing`; //window.URL.createObjectURL(blob);
  @Input() statusActaValue: string;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noGood: [null, [Validators.required]],
    });
  }
  fcom() {
    let params = {
      Lst_path_report: this.form.controls['noGood'].value,
    };

    console.log(params);

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FINFFICHACOMERCIAL.pdf?Lst_path_report=${params.Lst_path_report}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'FINFFICHACOMERCIAL.pdf');

    setTimeout(() => {
      this.onLoadToast('success', 'ficha comercial generada', '');
    }, 2000);

    this.loading = false;
    this.cleanForm();
  }
  ftec() {
    let params = {
      Lst_path_report: this.form.controls['noGood'].value,
    };

    console.log(params);

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FINFFICHACOMERCIAL.pdf?Lst_path_report=${params.Lst_path_report}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'FINFFICHACOMERCIAL.pdf');

    setTimeout(() => {
      this.onLoadToast('success', 'ficha técnica generada', '');
    }, 2000);

    this.loading = false;
    this.cleanForm();
  }
  fie() {
    let params = {
      Lst_path_report: this.form.controls['noGood'].value,
    };

    console.log(params);

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FINFFICHACOMERCIAL.pdf?Lst_path_report=${params.Lst_path_report}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'FINFFICHACOMERCIAL.pdf');

    setTimeout(() => {
      this.onLoadToast('success', 'ficha de ingresos y egresos generada', '');
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
