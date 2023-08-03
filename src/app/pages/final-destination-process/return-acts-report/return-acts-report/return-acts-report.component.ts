import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-return-acts-report',
  templateUrl: './return-acts-report.component.html',
  styles: [],
})
export class ReturnActsReportComponent extends BasePage implements OnInit {
  form: FormGroup;
  proceduralHistoryForm: ModelForm<any>;
  flatFileGoodForm: ModelForm<any>;
  proceduralHistoryForm2: ModelForm<any>;
  dateI: string = '';
  dateF: string = '';

  constructor(
    private fb: FormBuilder,
    private proceedingsService: ProceedingsService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  loadDelegation(name: string) {
    if (name == 'Recibe') {
      this.flatFileGoodForm.patchValue({
        delegationReceives: this.proceduralHistoryForm.value.delegation,
      });
    } else if (name == 'Recibe') {
    }
  }

  private prepareForm() {
    this.flatFileGoodForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      expedienteI: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      expedienteF: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      initialDate: [null, Validators.required],
      finalDate: [null, Validators.required],
      statusActa: [null, Validators.required],
      tipoActa: [null, Validators.required],
    });
  }

  validateVolant() {
    if (
      this.flatFileGoodForm.get('expedienteF').value <
      this.flatFileGoodForm.get('expedienteI').value
    ) {
      this.alert('error', 'Rango de volantes erroneo.', '');
      return true;
    }
    return false;
  }

  validarFechas(): boolean {
    this.dateI = this.flatFileGoodForm.value.initialDate;
    this.dateF = this.flatFileGoodForm.value.finalDate;
    if (this.dateF < this.dateI) {
      this.onLoadToast('error', 'Rango de fechas erróneo');
      return true;
    }
    return false;
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }

  formatDate2(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}-${month}-${year}`;
  }

  Generar() {
    console.log('flatFileGoodForm ', this.flatFileGoodForm.value);
    let params = {
      PARAMFORM: 'NO',
      PN_EXPEDI_INICIAL: this.flatFileGoodForm.get('expedienteI').value,
      PN_EXPEDI_FINAL: this.flatFileGoodForm.get('expedienteF').value,
      PN_DELEG: this.flatFileGoodForm.get('delegation').value,
      PN_SUBDEL: this.flatFileGoodForm.get('subdelegation').value,
      PC_ESTATUS_ACTA1: this.flatFileGoodForm.get('statusActa').value,
      PF_ELAB_INI: this.formatDate2(new Date(this.dateI)),
      PF_ELAB_FIN: this.formatDate2(new Date(this.dateF)),
      PC_TIPO_ACTA: 'DEVOLUCION',
      PN_ACTA: this.flatFileGoodForm.get('tipoActa').value,
    };
    console.log('params -> ', params);
    //RREPREFACTADECDEV
    this.siabService.fetchReport('blank', params).subscribe(response => {
      //  response= null;
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {
              if (data) {
                data.map((item: any) => {
                  return item;
                });
              }
            },
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      } else {
        this.onLoadToast(
          'warning',
          'advertencia',
          'Sin datos para los rangos de fechas suministrados'
        );
      }
    });
  }

  onSubmit() {
    if (!this.validateVolant()) {
      if (!this.validarFechas()) {
        this.Generar();
      }
    }
  }
}
