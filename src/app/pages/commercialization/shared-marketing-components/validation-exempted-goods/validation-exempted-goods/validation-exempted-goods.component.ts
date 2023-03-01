import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EditValidationExemptedGoodsModalComponent } from '../edit-validation-exempted-goods-modal/edit-validation-exempted-goods-modal.component';
import { VALIDATION_EXEMPTED_GOODS_COLUMS } from './validation-exempted-goods-columns';

import { BasePage } from 'src/app/core/shared/base-page';
//XLSX
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodTransAvaService } from 'src/app/core/services/ms-good/goods-trans-ava.service';

@Component({
  selector: 'app-validation-exempted-goods',
  templateUrl: './validation-exempted-goods.component.html',
  styles: [],
})
export class ValidationExemptedGoodsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  goods: IGood[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodTransAvaService: GoodTransAvaService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        edit: true,
        delete: false,
      },
      columns: { ...VALIDATION_EXEMPTED_GOODS_COLUMS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods());
  }

  getGoods() {
    this.loading = true;
    this.goodTransAvaService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.goods = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(good?: IGood) {
    console.log('me estoy ejecutando');
    let config: ModalOptions = {
      initialState: {
        good,
        callback: (next: boolean) => {
          if (next) this.getGoods();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(EditValidationExemptedGoodsModalComponent, config);
  }
}
