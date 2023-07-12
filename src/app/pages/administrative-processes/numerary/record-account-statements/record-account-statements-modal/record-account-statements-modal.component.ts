import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IRecordAccountStatements } from 'src/app/core/models/catalogs/record-account-statements.model';
import { RecordAccountStatementsAccountsService } from 'src/app/core/services/catalogs/record-account-statements-accounts.service';
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
    private datePipe: DatePipe,
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

  showCreateAlert() {
    this.alertQuestion(
      'warning',
      'Transferir',
      '¿Desea transferir este movimiento?'
    ).then(question => {
      if (question.isConfirmed) {
        this.create();
      }
    });
  }

  create() {
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    const model: IRecordAccountStatements = {
      numberAccount: this.movimentAccount.numberAccount,
      numberMotion: this.movimentAccount.numberMotion,
      dateMotion: this.datePipe.transform(
        this.movimentAccount.dateMotion,
        'dd/MM/yyyy'
      ),
      deposit: this.movimentAccount.deposit,
      userinsert: this.movimentAccount.userinsert,
      dateInsertion: currentDate,
      dateCalculationInterests: null,
      numberMotionTransfer: this.movimentAccount.numberMotionTransfer,
    };
    this.recordAccountStatementsAccountsService.create(model).subscribe({
      next: () => {
        this.alert('success', 'Movimiento transferido', '');
        this.modalRef.hide();
      },
      error: error => {
        this.alert('warning', 'Error', 'No se puede transferir el movimiento');
        this.modalRef.hide();
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
