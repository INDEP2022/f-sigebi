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
    const formattedDate = this.datePipe.transform(
      this.movimentAccount.dateMotion,
      'dd/MM/yyyy'
    );
    this.form = this.fb.group({
      bank: [
        this.movimentAccount.factasStatusCta.nombre,
        Validators.nullValidator,
      ],
      account: [
        this.movimentAccount.factasStatusCta.cve_cuenta,
        Validators.nullValidator,
      ],
      date: [formattedDate, Validators.nullValidator],
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
      'question',
      '¿Desea Transferir éste Movimiento?',
      ''
    ).then(question => {
      if (question.isConfirmed) {
        this.create();
      }
    });
  }

  create() {
    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (this.movimentAccount.genderTransfer !== 'S') {
      const model: IRecordAccountStatements = {
        numberAccount: this.movimentAccount.numberAccount,
        numberMotion: this.movimentAccount.numberMotion,
        dateMotion: this.movimentAccount.dateMotion,
        deposit: this.movimentAccount.deposit,
        userinsert: this.movimentAccount.userinsert,
        dateInsertion: currentDate,
        genderTransfer: 'S',
        numberMotionTransfer: this.movimentAccount.numberMotionTransfer,
      };
      this.recordAccountStatementsAccountsService.create(model).subscribe({
        next: () => {
          this.loading = true;
          this.alert('success', 'Movimiento Transferido', '');
          this.modalRef.hide();
        },
        error: error => {
          this.alert('error', 'No se puede Transferir el Movimiento', '');
          this.modalRef.hide();
        },
      });
    } else {
      this.alert('warning', 'Éste Movimiento ya ha sido Transferido', '');
      this.modalRef.hide();
    }
  }

  close() {
    this.modalRef.hide();
  }
}
