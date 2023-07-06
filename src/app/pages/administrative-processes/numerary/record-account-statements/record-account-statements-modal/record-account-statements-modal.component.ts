import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IRecordAccountStatements } from 'src/app/core/models/catalogs/record-account-statements.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RecordAccountStatementsAccountsService } from 'src/app/core/services/catalogs/record-account-statements-accounts.service';
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
  movimentAccount: IRecordAccountStatements;
  factasStatusCta: any;
  dataAccountPaginated: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accountBank: GenerateCveService,
    private accountService: BankAccountService,
    private authService: AuthService,
    private recordAccountStatementsAccountsService: RecordAccountStatementsAccountsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      bank: [
        this.movimentAccount.factasStatusCta.nombre,
        Validators.nullValidator,
      ],
      account: [
        this.movimentAccount.factasStatusCta.cve_cuenta,
        Validators.nullValidator,
      ],
      date: [this.movimentAccount.dateMotion, Validators.nullValidator],
      amount: [
        this.movimentAccount.deposit
          ? this.movimentAccount.deposit
          : this.movimentAccount.withdrawal,
        Validators.nullValidator,
      ],
      motion: [
        this.movimentAccount.deposit ? 'Cargo' : 'Abono',
        Validators.nullValidator,
      ],
    });
  }

  showCreateAlert(event: any) {
    const movimentAccount = event;
    console.log('movimentAccount', movimentAccount);
    this.alertQuestion(
      'warning',
      'Transferir',
      '¿Desea transferir este movimiento?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('isConfirmed');
        this.create();
      }
    });
  }

  create() {
    this.recordAccountStatementsAccountsService
      .create(this.form.value)
      .subscribe({
        next: () => {
          console.log('isConfirmed 2');
          this.alert('success', 'Movimiento transferido', '');
        },
        error: error => {
          this.alert(
            'warning',
            'Error',
            'No se puede transferir el movimiento'
          );
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}
