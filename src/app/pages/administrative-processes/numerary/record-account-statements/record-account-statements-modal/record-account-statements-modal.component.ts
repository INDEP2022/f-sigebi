import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { GenerateCveService } from 'src/app/core/services/ms-security/application-generate-clave';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-record-account-statements-modal',
  templateUrl: './record-account-statements-modal.component.html',
  styles: [],
})
export class RecordAccountStatementsModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Traspasar los movimientos a la siguiente cuenta';
  form: FormGroup;
  data: any;
  dataGrilla: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accountBank: GenerateCveService,
    private accountService: BankAccountService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      bank: [null, Validators.required],
      account: [null, Validators.required],
      date: [null, Validators.nullValidator],
      amount: [null, Validators.nullValidator],
      motion: [null, Validators.nullValidator],
    });
    this.validation();
  }
  close() {
    this.modalRef.hide();
  }

  getAccountBank() {
    var account = this.data.accountNumber.accountNumberTransfer;
    this.accountBank.getAccountBank(account).subscribe({
      next: async (response: any) => {
        if (response.data.length > 0) {
          this.form.get('bank').setValue(response.data[0].nombre);
          this.form.get('account').setValue(response.data[0].cve_cuenta);
        } else {
          this.warningAlert(
            'No se tiene definida una cuenta donde traspasar los movimientos'
          );
        }
      },
      error: err => {
        this.loading = false;
        this.warningAlert(
          'No se tiene definida una cuenta donde traspasar los movimientos'
        );
      },
    });
  }

  validation() {
    if (this.data != null) {
      this.dataGrilla = this.data;
      this.form.get('bank').disable();
      this.form.get('account').disable();
      this.form.get('date').disable();

      this.form.get('date').setValue(this.data.dateMotion);
      if (this.data.deposit != null) {
        this.form.get('amount').setValue(this.data.deposit);
        this.form.get('motion').setValue('CARGO');
      } else {
        this.form.get('amount').setValue(this.data.postDiverse);
        this.form.get('motion').setValue('ABONO');
      }
      this.getAccountBank();
    }
  }
  warningAlert(message: any) {
    this.alert('warning', message, '');
  }
  successAlert() {
    this.alert('success', 'Registro guardado', '');
  }

  async save() {
    const response = await this.alertQuestion(
      'question',
      '¿Esta seguro que desea traspasar este movimiento?',
      ''
    );
    if (response.isConfirmed) {
      const payload = {
        withdrawal: this.dataGrilla.withdrawal,
        deposit: this.form.get('amount').value,
        dateMotion: this.form.get('date').value,
        numberAccount: this.dataGrilla.accountNumber.accountNumberTransfer,
        userinsert: this.authService.decodeToken().name,
        dateInsertion: new Date(),
      };
      this.loading = true;
      this.accountService.getTransferAccount(payload).subscribe({
        next: async (response: any) => {
          this.successAlert();
          this.loading = false;
          this.modalRef.content.callback(true);
          this.modalRef.hide();
        },
        error: err => {
          this.loading = false;
          this.warningAlert('No se creo el registro');
        },
      });
    }
  }
}
