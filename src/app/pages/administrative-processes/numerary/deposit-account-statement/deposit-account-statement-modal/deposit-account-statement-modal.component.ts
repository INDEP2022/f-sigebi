import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DEPOSIT_ACCOUNT_STATEMENT_COLUMNS } from './deposit-account-statement-columns';

@Component({
  selector: 'app-deposit-account-statement-modal',
  templateUrl: './deposit-account-statement-modal.component.html',
  styles: [],
})
export class DepositAccountStatementModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Detalle del calculo';
  form: FormGroup;
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DEPOSIT_ACCOUNT_STATEMENT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      realInterests: [null, Validators.required],
      estimatedInterest: [null, Validators.required],
      creditedInterest: [null, Validators.required],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
