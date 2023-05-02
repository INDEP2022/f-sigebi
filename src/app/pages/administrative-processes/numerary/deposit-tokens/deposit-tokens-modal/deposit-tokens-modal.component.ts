import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DEPOSIT_TOKENS_MODAL_COLUMNS } from './deposit-tokens-modal-columns';

@Component({
  selector: 'app-deposit-tokens-modal',
  templateUrl: './deposit-tokens-modal.component.html',
  styles: [],
})
export class DepositTokensModalComponent extends BasePage implements OnInit {
  title: string = 'Movimientos';
  form: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DEPOSIT_TOKENS_MODAL_COLUMNS,
    };
  }

  ngOnInit(): void {}
  close() {
    this.modalRef.hide();
  }
}
