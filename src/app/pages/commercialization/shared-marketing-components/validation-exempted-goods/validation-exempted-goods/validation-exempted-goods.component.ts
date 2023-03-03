import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EditValidationExemptedGoodsModalComponent } from '../edit-validation-exempted-goods-modal/edit-validation-exempted-goods-modal.component';
import {
  GOODS_COLUMS,
  PROCCESS_COLUMNS,
} from './validation-exempted-goods-columns';

import { BasePage } from 'src/app/core/shared/base-page';
//XLSX
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IGoodsTransAva } from 'src/app/core/models/ms-good/goods-trans-ava.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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

  totalItems: number = 0;
  totalItems2: number = 0;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  proccessList: IGoodsTransAva[] = [];
  process: IGoodsTransAva;

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

  goods: IGood[] = [];

  settings2;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodTransAvaService: GoodTransAvaService,
    private goodService: GoodService
  ) {
    super();
    this.searchFilter = { field: 'description', operator: SearchFilter.ILIKE };

    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...GOODS_COLUMS },
    };

    this.settings2 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        edit: true,
        delete: false,
      },
      columns: { ...PROCCESS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.filterParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods());
  }

  getGoods() {
    this.loading = true;
    this.filterParams.getValue().removeAllFilters();
    this.goodService
      .getExemptedGoods(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          this.goods = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.proccessList = [];
    this.process = event.data;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getProccess(this.process));
  }

  getProccess(goods: IGood): void {
    this.loading = true;
    console.log('Dato que selecciona', goods.id);
    this.goodTransAvaService
      .getById(goods.id, this.params2.getValue())
      .pipe(
        map((data2: any) => {
          let list: IListResponse<IGoodsTransAva> =
            {} as IListResponse<IGoodsTransAva>;
          const array2: IGoodsTransAva[] = [{ ...data2 }];
          list.data = array2;
          return list;
        })
      )
      .subscribe({
        next: response => {
          console.log(response);
          this.proccessList = response.data;
          this.totalItems2 = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  /*getGoods2(){
    this.loading = true;
    this.goodTransAvaService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.goods = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }*/

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
