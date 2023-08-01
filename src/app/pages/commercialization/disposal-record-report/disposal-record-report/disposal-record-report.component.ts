import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
@Component({
  selector: 'app-disposal-record-report',
  templateUrl: './disposal-record-report.component.html',
  styles: [],
})
export class DisposalRecordReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  today: Date;
  maxDate: Date;
  minDate: Date;
  params: any;
  estatus: any;
  pdfurl =
    'http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf';

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
      // noFile: [null],
      PN_EXPINI: [null, [Validators.required]],
      PN_EXPFIN: [null, [Validators.required]],
      estatusActa: [null],
      PF_ELABIN: [null, [Validators.required]],
      PF_ELABFIN: [null, [Validators.required]],
      PN_ACTAINI: [null, [Validators.required]],
      PN_ACTAFIN: [null, [Validators.required]],
    });
  }
  confirm() {
    const ELABIN = new Date(this.form.controls['PF_ELABIN'].value);
    const formattedELABIN = this.formatDate(ELABIN);

    const ELABFIN = new Date(this.form.controls['PF_ELABFIN'].value);
    const formattedELABFIN = this.formatDate(ELABFIN);
    if (
      this.form.controls['estatusActa'].value == null ||
      this.form.controls['estatusActa'].value == 'TODOS'
    ) {
      this.estatus = 'null';
    } else {
      this.estatus = this.form.controls['estatusActa'].value;
    }

    this.params = {
      PN_DELEGACION: this.form.controls['delegation'].value,
      PN_SUBDELEGACION: this.form.controls['subdelegation'].value,
      PN_EXPINI: this.form.controls['PN_EXPINI'].value,
      PN_EXPFIN: this.form.controls['PN_EXPFIN'].value,
      PC_ACTA: this.estatus,
      PF_ELABIN: formattedELABIN,
      PF_ELABFIN: formattedELABFIN,
      PN_ACTAINI: this.form.controls['PN_ACTAINI'].value,
      PN_ACTAFIN: this.form.controls['PN_ACTAFIN'].value,
      // noFile: this.form.controls['noFile'].value,
    };

    console.log(this.params);
    const startEx = this.form.get('PN_EXPINI').value;
    const endEx = this.form.get('PN_EXPFIN').value;

    const startAc = this.form.get('PN_ACTAINI').value;
    const endAc = this.form.get('PN_ACTAFIN').value;

    const startEl = new Date(this.form.get('PF_ELABIN').value);
    const endEl = new Date(this.form.get('PF_ELABFIN').value);

    if (endEx < startEx) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'El expediente final debe ser mayor al inicial'
      );
      return;
    }

    if (endAc < startAc) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'El acta final debe ser mayor a la inicial'
      );
      return;
    }

    if (endEl < startEl) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'fecha final de elaboración debe ser mayor a la fecha inicial'
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
  onSubmit() {
    if (this.params != null) {
      this.siabService.fetchReport('RGERDESACTAENAJEN', this.params).subscribe({
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

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }
}
