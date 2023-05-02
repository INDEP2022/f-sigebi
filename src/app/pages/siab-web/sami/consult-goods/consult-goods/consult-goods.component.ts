import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONSULTGOODS_COLUMNS } from './consult-goods-columns';

@Component({
  selector: 'app-consult-goods',
  templateUrl: './consult-goods.component.html',
  styles: [],
})
export class ConsultGoodsComponent extends BasePage implements OnInit {
  consultGoodsForm: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: CONSULTGOODS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.consultGoodsForm = this.fb.group({
      unlinked: [null, Validators.required],
      unlinked1: [null, Validators.required],
      unlinked2: [null, Validators.required],
      unlinked3: [null, Validators.required],
    });
  }
}
