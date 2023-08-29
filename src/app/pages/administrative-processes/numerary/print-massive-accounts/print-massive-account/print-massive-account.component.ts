import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  expedientes = new DefaultSelect<any>();
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private expedientService: ExpedientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.getExpediente(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null],
      depositDate: [null],
      depositDateTo: [null],

      transferenceDate: [null],
      transferenceDateTo: [null],

      receptionDate: [null],
      receptionDateTo: [null],
    });
    console.log('formmm', this.form);
  }
  getExpedientes($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    if ($params.text) params.addFilter('id', $params.text, SearchFilter.EQ);
    this.getExpediente(params);
  }

  getExpediente(_params?: FilterParams) {
    this.expedientService.getAll(_params.getParams()).subscribe({
      next: response => {
        console.log(response);
        this.expedientes = new DefaultSelect(response.data, response.count);
        this.loading = false;
      },
      error: err => {
        this.expedientes = new DefaultSelect([], 0);
        this.alert(
          'warning',
          'Ese expediente no se tiene registrado en el sistema',
          ''
        );
        this.loading = false;
      },
    });
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

    const idExp = this.form.controls['file'].value;
    let params: any = {};
    if (idExp) params.PN_EXPEDIENTE = idExp;
    if (this.depositD) params.PF_DEPOSITO_INI = this.depositD;
    if (this.depositT) params.PF_DEPOSITO_FIN = this.depositT;
    if (this.transfD) params.PF_TRANSFERENCIA_INI = this.transfD;
    if (this.transfT) params.PF_TRANSFERENCIA_FIN = this.transfT;
    if (this.recepctD) params.PF_RECEPCION_INI = this.recepctD;
    if (this.recepctT) params.PF_RECEPCION_FIN = this.recepctT;

    // let params = {
    //   PN_EXPEDIENTE: idExp.id,
    //   PF_DEPOSITO_INI: this.depositD,
    //   PF_DEPOSITO_FIN: this.depositT,
    //   PF_TRANSFERENCIA_INI: this.transfD,
    //   PF_TRANSFERENCIA_FIN: this.transfT,
    //   PF_RECEPCION_INI: this.recepctD,
    //   PF_RECEPCION_FIN: this.recepctT,
    // };

    console.log('params', params);
    this.siabService
      .fetchReport('RGERADBIMPRMASIVA', params)
      // .fetchReportBlank('blank')
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
