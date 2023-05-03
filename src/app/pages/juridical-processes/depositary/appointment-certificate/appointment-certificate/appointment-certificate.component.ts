/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AppointmentCertificateService } from './services/appointment-certificate.service';
import {
  ERROR_GOOD_NULL,
  ERROR_GOOD_REPORT,
  ERROR_REPORT,
  NOT_FOUND_GOOD,
} from './utils/appointment-certificate.message';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-appointment-certificate',
  templateUrl: './appointment-certificate.component.html',
  styleUrls: ['./appointment-certificate.component.scss'],
})
export class AppointmentCertificateComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  goodData = new DefaultSelect();
  public form: FormGroup;
  good: IGood;

  constructor(
    private fb: FormBuilder,
    private svAppointmentCertificateService: AppointmentCertificateService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = false;
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ], //*
      tipoAdministrador: [{ value: '', disabled: false }],
      tipoDepositaria: [{ value: '', disabled: false }], //*
      descripcion: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1250)],
      ], //*
      goodIdOrDescription: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], //*
    });
  }

  btnReportGenerate(): any {
    console.log(this.form.value);
    if (this.good) {
      if (this.good.goodId) {
        let params = {
          PARAMFORM: 'NO',
          P_BIEN: this.form.get('noBien').value,
          P_ADMINISTRADOR: this.form.get('tipoAdministrador').value,
          P_DEPOSITARIA: this.form.get('tipoDepositaria').value,
        };

        // if (!params.P_ADMINISTRADOR) {
        //   delete params.P_ADMINISTRADOR;
        // }
        // if (!params.P_DEPOSITARIA) {
        //   delete params.P_DEPOSITARIA;
        // }

        this.siabService
          .fetchReport('RGERDIRNOMBRADEPO', params)
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
              this.alert('warning', ERROR_REPORT, '');
            }
          });
      } else {
        this.alert(
          'warning',
          'Número de Bien Requerido para el Reporte',
          ERROR_GOOD_REPORT
        );
      }
    } else {
      this.alert(
        'warning',
        'Número de Bien Requerido para el Reporte',
        ERROR_GOOD_NULL
      );
    }
  }

  async getGoodData() {
    if (this.form.get('noBien').valid) {
      this.loading = true;
      const params = new FilterParams();
      params.removeAllFilters();
      params.addFilter('goodId', this.form.get('noBien').value);
      await this.svAppointmentCertificateService
        .getGoodDataByFilter(params.getParams())
        .subscribe({
          next: res => {
            console.log(res);
            this.good = res.data[0]; // Set data good
            this.form.get('descripcion').setValue(this.good.description);
            this.loading = false;
          },
          error: err => {
            this.loading = false;
            console.log(err);
            this.alert(
              'warning',
              'Número de Bien',
              NOT_FOUND_GOOD(err.error.message)
            );
          },
        });
    } else {
      this.alert('warning', 'Número de Bien', ERROR_GOOD_NULL);
    }
  }
}
