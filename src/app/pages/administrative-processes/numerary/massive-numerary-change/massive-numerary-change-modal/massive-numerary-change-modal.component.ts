import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  MASSIVE_NUMERARY_CHANGE_MODAL_COLUMNS,
  WIN_BIENES_MODAL_COLUMNS,
} from './massive-numerary-change-modal-columns';

@Component({
  selector: 'app-massive-numerary-change-modal',
  templateUrl: './massive-numerary-change-modal.component.html',
  styles: [],
})
export class MassiveNumeraryChangeModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Win Bienes';
  form: FormGroup;
  settings2 = { ...this.settings, actions: false };
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: MASSIVE_NUMERARY_CHANGE_MODAL_COLUMNS,
    };
    this.settings2.columns = WIN_BIENES_MODAL_COLUMNS;
  }

  ngOnInit(): void {}
  close() {
    this.modalRef.hide();
  }
}
