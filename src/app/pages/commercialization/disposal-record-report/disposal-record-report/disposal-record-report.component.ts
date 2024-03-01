import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';

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
  estatus: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

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

  get PN_EXPFIN() {
    return this.form.get('PN_EXPFIN') as FormControl;
  }

  get PN_ACTAFIN() {
    return this.form.get('PN_ACTAFIN') as FormControl;
  }

  ngOnInit(): void {
    this.prepareForm();
    const initialParams = new ListParams();
    this.params.next(initialParams);
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      // noFile: [null],
      PN_EXPINI: [
        null,
        [
          Validators.required,
          Validators.pattern(NUM_POSITIVE),
          Validators.maxLength(10),
        ],
      ],
      PN_EXPFIN: [
        null,
        [
          Validators.required,
          Validators.pattern(NUM_POSITIVE),
          Validators.maxLength(10),
        ],
      ],
      estatusActa: ['TODOS'],
      PF_ELABIN: [null, [Validators.required]],
      PF_ELABFIN: [null, [Validators.required]],
      PN_ACTAINI: [
        null,
        [
          Validators.required,
          Validators.pattern(NUM_POSITIVE),
          Validators.maxLength(10),
        ],
      ],
      PN_ACTAFIN: [
        null,
        [
          Validators.required,
          Validators.pattern(NUM_POSITIVE),
          Validators.maxLength(10),
        ],
      ],
    });
    this.form.get('PN_EXPFIN').disable();
    this.form.get('PN_ACTAFIN').disable();
    this.form.get('PF_ELABFIN').disable();
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

    let params = {
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

    console.log(params);
    const startEx = this.form.get('PN_EXPINI').value;
    const endEx = this.form.get('PN_EXPFIN').value;

    const startAc = this.form.get('PN_ACTAINI').value;
    const endAc = this.form.get('PN_ACTAFIN').value;

    const startEl = new Date(this.form.get('PF_ELABIN').value);
    const endEl = new Date(this.form.get('PF_ELABFIN').value);

    /*if (endEx < startEx) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'El Expediente Final Debe ser Mayor que el Inicial'
      );
      return;
    }*/

    /*if (endAc < startAc) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'El Acta Final Debe ser Mayor que la Inicial.'
      );
      return;
    }

    if (endEl < startEl) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'La Fecha Final de Elaboración Debe ser Mayor a la Fecha Inicial'
      );
      return;
    }*/
    this.onSubmit();
    /*setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);*/

    this.loading = false;
    this.cleanForm();
  }

  validateExp(event: any) {
    console.log(event.data);
    if (event) {
      if (this.form.get('PN_EXPINI').value) {
        this.form.get('PN_EXPFIN').enable();
        let value = this.form.get('PN_EXPINI').value;
        this.updateValidate(value);
      } else {
        this.form.get('PN_EXPFIN').setValue('');
        this.form.get('PN_EXPFIN').disable();
      }
    }
  }

  updateValidate(minValue: number) {
    console.log(minValue);
    this.PN_EXPFIN.setValidators([
      Validators.required,
      Validators.pattern(NUM_POSITIVE),
      Validators.maxLength(10),
      Validators.min(minValue),
      //Validators.max(maxValue),
    ]);

    // Validar con los nuevos validadores
    this.PN_EXPFIN.updateValueAndValidity();
  }

  validateAct(event: any) {
    console.log(event.data);
    if (event) {
      if (this.form.get('PN_ACTAINI').value) {
        this.form.get('PN_ACTAFIN').enable();
        let value = this.form.get('PN_ACTAINI').value;
        this.updateValidateAct(value);
      } else {
        this.form.get('PN_ACTAFIN').setValue('');
        this.form.get('PN_ACTAFIN').disable();
      }
    }
  }
  updateValidateAct(minValue: number) {
    console.log(minValue);
    this.PN_ACTAFIN.setValidators([
      Validators.required,
      Validators.pattern(NUM_POSITIVE),
      Validators.maxLength(10),
      Validators.min(minValue),
      //Validators.max(maxValue),
    ]);

    // Validar con los nuevos validadores
    this.PN_ACTAFIN.updateValueAndValidity();
  }

  validateDate(event: Date) {
    if (event) {
      this.form.get('PF_ELABFIN').enable();
      this.minDate = event;
    } else {
      this.form.get('PF_ELABFIN').setValue('');
      this.form.get('PF_ELABFIN').disable();
    }
  }

  getRowSelec(event: any) {
    this.estatus = event;
    console.log(event);
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
    this.form.get('PN_EXPFIN').disable();
    this.form.get('PN_ACTAFIN').disable();
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
