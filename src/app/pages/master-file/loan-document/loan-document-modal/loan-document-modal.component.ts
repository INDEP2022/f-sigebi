import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-loan-document-modal',
  templateUrl: './loan-document-modal.component.html',
  styles: [],
})
export class LoanDocumentModalComponent extends BasePage implements OnInit {
  form: FormGroup;
  data: any;
  title: string;
  idloan: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private expedientService: ExpedientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log('data ', this.data);
    if (this.data != null) {
      this.title = 'Editar Registro';
      this.loadData();
    } else {
      this.title = 'Nuevo Registro';
      console.log('idloan ', this.idloan);
      this.form.get('Noloan').patchValue(this.idloan);
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      Noloan: [null],
      folio: [null, Validators.required],
      proceeding: [null, Validators.required],
      devDate: [null, Validators.required],
      loanDate: [null, Validators.required],
    });
  }

  loadData() {
    const Devolution =
      this.data.devolutionDate != null
        ? new Date(this.data.devolutionDate)
        : null;
    const formattedfecDevolution =
      Devolution != null ? this.formatDate(Devolution) : null;
    const Real =
      this.data.devolutionDateReal != null
        ? new Date(this.data.devolutionDateReal)
        : null;
    const formattedfecReal = Real != null ? this.formatDate(Real) : null;
    this.form.patchValue({
      Noloan: this.data.no_loan,
      folio: this.data.folio,
      proceeding: this.data.noRecord,
      devDate: formattedfecDevolution,
      loanDate: formattedfecReal,
    });
  }

  saveEdit() {
    if (this.data != null) {
      this.update();
    } else {
      this.newRegister();
    }
  }

  update() {
    let devDate = this.form.get('devDate').value;
    let devDat = devDate != null ? this.formatDateUTC(devDate) : null;

    let realDate = this.form.get('loanDate').value;
    let loamDat = realDate != null ? this.formatDateUTC(realDate) : null;

    let params = {
      loanNumber: this.form.get('Noloan').value,
      invoiceUniversal: this.form.get('folio').value,
      proceedingsNumber: this.form.get('proceeding').value,
      returnTheoreticalDate: devDat,
      returnRealDate: loamDat,
    };
    console.log('params update ', params);
    this.expedientService.updateDocumentLoan(params).subscribe({
      next: response => {
        this.alert(
          'success',
          'Actualizado con Exito',
          'El registro fue actualizado correctamente.'
        );
        this.modalRef.content.callback(true, true);
        this.modalRef.hide();
      },
      error: err => {
        this.alert(
          'error',
          'Error',
          'Ha habido un problema, inténtelo nuevamente.'
        );
      },
    });
  }

  newRegister() {
    let params = {
      loanNumber: this.idloan,
      invoiceUniversal: this.form.get('folio').value,
      proceedingsNumber: this.form.get('proceeding').value,
      returnTheoreticalDate: this.form.get('devDate').value,
      returnRealDate: this.form.get('loanDate').value,
    };
    this.expedientService.postDocumentLoan(params).subscribe({
      next: response => {
        this.alert(
          'success',
          'Guardado con Exito',
          'El registro fue creado exitosamente.'
        );
        this.modalRef.content.callback(true, true);
        this.modalRef.hide();
      },
      error: err => {
        this.alert(
          'error',
          'Error',
          'Ha habido un problema, inténtelo nuevamente.'
        );
      },
    });
    console.log('params new ', params);
  }

  close() {
    this.modalRef.hide();
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  formatDateUTC(inputDate: any) {
    if (typeof inputDate === 'string') {
      if (inputDate.includes('/')) {
        const dateParts = inputDate.split('/');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          if (
            !isNaN(parseInt(day)) &&
            !isNaN(parseInt(month)) &&
            !isNaN(parseInt(year))
          ) {
            return `${year}-${month}-${day}`;
          }
        }
      } else {
        const date = new Date(inputDate);
        if (!isNaN(date.getTime())) {
          const formattedDay = date.getUTCDate().toString().padStart(2, '0');
          const formattedMonth = (date.getUTCMonth() + 1)
            .toString()
            .padStart(2, '0');
          const formattedYear = date.getUTCFullYear().toString();
          return `${formattedYear}-${formattedMonth}-${formattedDay}`;
        }
      }
    } else {
      const date = new Date(inputDate);
      if (!isNaN(date.getTime())) {
        const formattedDay = date.getUTCDate().toString().padStart(2, '0');
        const formattedMonth = (date.getUTCMonth() + 1)
          .toString()
          .padStart(2, '0');
        const formattedYear = date.getUTCFullYear().toString();
        return `${formattedYear}-${formattedMonth}-${formattedDay}`;
      }
    }
    return inputDate;
  }
}
