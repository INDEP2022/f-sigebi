import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared';
@Component({
  selector: 'app-print-massive-account',
  templateUrl: './print-massive-account.component.html',
  styles: [],
})
export class PrintMassiveAccountComponent extends BasePage implements OnInit {
  form: FormGroup;
  depositD: string = '';
  depositT: string = '';
  transfD: string = '';
  transfT: string = '';
  recepctD: string = '';
  recepctT: string = '';
  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
      depositDate: [null, Validators.required],
      depositDateTo: [null, Validators.required],

      transferenceDate: [null, Validators.required],
      transferenceDateTo: [null, Validators.required],

      receptionDate: [null, Validators.required],
      receptionDateTo: [null, Validators.required],
    });
    console.log('formmm', this.form);
  }
  Generar() {
    this.depositD = this.datePipe.transform(
      this.form.controls['depositDate'].value,
      'dd/MM/yyyy'
    );

    this.depositT = this.datePipe.transform(
      this.form.controls['depositDateTo'].value,
      'dd/MM/yyyy'
    );
    this.transfD = this.datePipe.transform(
      this.form.controls['transferenceDate'].value,
      'dd/MM/yyyy'
    );
    this.transfT = this.datePipe.transform(
      this.form.controls['transferenceDateTo'].value,
      'dd/MM/yyyy'
    );
    this.recepctD = this.datePipe.transform(
      this.form.controls['receptionDate'].value,
      'dd/MM/yyyy'
    );
    this.recepctT = this.datePipe.transform(
      this.form.controls['receptionDateTo'].value,
      'dd/MM/yyyy'
    );

    let params = {
      PN_EXPEDIENTE: this.form.controls['file'].value,
      PF_DEPOSITO_INI: this.depositD,
      PF_DEPOSITO_FIN: this.depositT,
      PF_TRANSFERENCIA_INI: this.transfD,
      PF_TRANSFERENCIA_FIN: this.transfT,
      PF_RECEPCION_INI: this.recepctD,
      PF_RECEPCION_FIN: this.recepctT,
    };

    this.siabService
      // .fetchReport('FGERADBIMPRMASIVA', params)
      .fetchReportBlank('blank')
      .subscribe(response => {
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }

  cleanForm() {
    this.form.reset();
    this.deshabilitarFechasFinales();
  }

  deshabilitarFechasFinales() {
    this.form.controls['depositDateTo'].disable();
    this.form.controls['transferenceDateTo'].disable();
    this.form.controls['receptionDateTo'].disable();
    this.form.updateValueAndValidity();
  }
}
