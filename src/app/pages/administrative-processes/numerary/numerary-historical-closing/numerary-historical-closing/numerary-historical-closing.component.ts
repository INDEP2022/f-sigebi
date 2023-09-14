import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-numerary-historical-closing',
  templateUrl: './numerary-historical-closing.component.html',
  styles: [],
})
export class NumeraryHistoricalClosingComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  date: string = '';
  date2: string = '';
  dateReportNg: Date;
  maxDate = new Date();
  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private numeraryService: NumeraryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      dateReport: [null, Validators.required],
    });
  }

  dateReport(event: any) {
    this.date2 = this.datePipe.transform(this.dateReportNg, 'yyyy/MM/dd');
    console.log(this.date2);
  }
  Generar() {
    const params = new ListParams();
    params['filter.processFec'] = `$eq:${this.date2}`;
    this.numeraryService.getAllCloseNumerary(params).subscribe({
      next: response => {
        console.log(response);

        this.GenerarReporte();
        this.loading = false;
      },
      error: err => {
        this.alert('warning', 'No hay registros en la fecha seleccionada', '');
        this.loading = false;
      },
    });
  }

  GenerarReporte() {
    this.date = this.datePipe.transform(this.date2, 'dd/MM/yyyy');
    let params = {
      PF_FEC_PROCESO: this.date,
    };

    this.siabService
      // .fetchReport('RGEROFPRECEPDOCUM', params)
      .fetchReport('RGERADBCIERRENUM', params)
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
}
