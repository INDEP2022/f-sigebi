import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { MONTHS } from '../utils/constants/months';

@Component({
  selector: 'app-accumulated-monthly-assets',
  templateUrl: './accumulated-monthly-assets.component.html',
  styles: [],
})
export class AccumulatedMonthlyAssetsComponent implements OnInit {
  form: FormGroup;
  months = MONTHS;
  date: string;
  bsValue: Date = new Date();
  minMode: BsDatepickerViewMode = 'year'; // change for month:year

  bsConfig: Partial<BsDatepickerConfig>;

  @Output() submit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.bsConfig = Object.assign(
      {},
      {
        minMode: this.minMode,
      }
    );
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      subdelegation: [null, Validators.required],
      year: [null, Validators.required],
      ofMonth: [null, Validators.required],
      toMonth: [null, Validators.required],
    });
  }

  generar() {
    this.submit.emit(this.form);
    this.date = this.datePipe.transform(
      this.form.controls['year'].value,
      'dd/MM/yyyy'
    );

    console.log('Esta es la fecha: ', this.date.slice(-4));

    let params = {
      PN_DELEG: this.form.controls['delegation'].value,
      PN_SUBDELEG: this.form.controls['subdelegation'].value,
      PN_ANIO: this.date.slice(-4),
      PN_MESINI: this.form.controls['ofMonth'].value,
      PN_MESFIN: this.form.controls['toMonth'].value,
    };

    console.log('Los parametro: ', params);

    this.siabService
      .fetchReport('RGENADBACUMBIENES', params)
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
  }

  validateMonth() {
    if (
      this.form.controls['ofMonth'].value !== '' &&
      this.form.controls['toMonth'].value !== ''
    ) {
      if (
        parseInt(this.form.controls['ofMonth'].value) >
        parseInt(this.form.controls['toMonth'].value)
      ) {
        this.form.controls['toMonth'].reset();
      }
    }
  }

  validateMonthTwo() {
    if (
      this.form.controls['ofMonth'].value !== '' &&
      this.form.controls['toMonth'].value !== ''
    ) {
      if (
        parseInt(this.form.controls['ofMonth'].value) >
        parseInt(this.form.controls['toMonth'].value)
      ) {
        this.form.controls['ofMonth'].reset();
      }
    }
  }

  test() {}
}
