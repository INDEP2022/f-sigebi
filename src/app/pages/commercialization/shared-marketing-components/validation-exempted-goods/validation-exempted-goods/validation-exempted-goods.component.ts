import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodTransAvaService } from 'src/app/core/services/ms-good/goods-trans-ava.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EditValidationExemptedGoodsModalComponent } from '../edit-validation-exempted-goods-modal/edit-validation-exempted-goods-modal.component';
import { GOODS_COLUMS } from './validation-exempted-goods-columns';

@Component({
  selector: 'app-validation-exempted-goods',
  templateUrl: './validation-exempted-goods.component.html',
  styles: [],
})
export class ValidationExemptedGoodsComponent
  extends BasePage
  implements OnInit
{
  validationExempte: IGood[] = [];
  totalItems: number = 0;
  totalItems2: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  goods: LocalDataSource = new LocalDataSource();
  proccessList: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  select: IGood;
  goodID: number;
  proccessName: string;

  // settings2: { columns: { goodNumber: { title: string; type: string; sort: boolean; }; process: { title: string; type: string; sort: boolean; }; }; hideSubHeader: boolean; actions: { add: boolean; edit: boolean; delete: boolean; position: string; }; };

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodTransAvaService: GoodTransAvaService,
    private goodService: GoodService
  ) {
    super();
    this.settings.columns = GOODS_COLUMS;
    this.settings.hideSubHeader = false;
    this.settings.actions = false;

    // this.settings2.columns = PROCCESS_COLUMNS;
    // this.settings2.hideSubHeader = false;
    // this.settings2.actions.add = false;
    // this.settings2.actions.edit = true;
    // this.settings2.actions.delete = true;
    // this.settings2.actions.position = 'right';
  }

  form = this.fb.group({
    id: [null],
    modelComment: [null],
  });

  ngOnInit(): void {
    //TABLA DE BIENES -- TABLA 1
    this.goods
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'quantity':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log(`${searchFilter}:${filter.search}`);
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoods();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods());

    //TABLA DE PROCESOS -- TABLA 2
    // this.proccessList
    //   .onChanged()
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(change => {
    //     if (change.action === 'filter') {
    //       let filters = change.filter.filters;
    //       filters.map((filter: any) => {
    //         let field = ``;
    //         let searchFilter = SearchFilter.ILIKE;
    //         field = `filter.${filter.field}`;
    //         switch (filter.field) {
    //           case 'goodNumber':
    //             searchFilter = SearchFilter.EQ;
    //             break;
    //           case 'process':
    //             searchFilter = SearchFilter.ILIKE;
    //             break;
    //           default:
    //             searchFilter = SearchFilter.ILIKE;
    //             break;
    //         }
    //         if (filter.search !== '') {
    //           this.columnFilters[field] = `${searchFilter}:${filter.search}`;
    //           console.log(`${searchFilter}:${filter.search}`)
    //         } else {
    //           delete this.columnFilters[field];
    //         }
    //       });
    //       this.params = this.pageFilter(this.params);
    //       this.getGoods();
    //     }
    //   });
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getGoods());
  }

  getGoods() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodService.getExemptedGoods(params).subscribe({
      next: response => {
        this.goods.load(response.data);
        console.log(this.goods);
        this.goods.refresh();
        this.totalItems = response.count;
        console.log(this.totalItems);
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  rowsSelected(event: any) {
    this.select = event.data;
  }

  getProccess(goods: IGood): void {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodID = goods.id;
    console.log(this.goodID);
    this.goodTransAvaService.getById(this.goodID, params).subscribe({
      next: response => {
        console.log(response);
        this.proccessList = response.data;
        console.log(this.proccessList);
        this.totalItems2 = response.count;
        console.log(this.totalItems2);
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //PENDIENTE DE ENCONTRAR LA RUTA DE BUSQUEDA POR NOMBRE
  onSubmit() {
    this.proccessName = this.form.get('id').value;
    console.log(this.proccessName);
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodService.getExemptedGoods(this.proccessName).subscribe({
      next: response => {
        this.totalItems = response.count;
        this.goods.load(response.data);
        this.goods.refresh();
        this.loading = false;
      },
      error: error => {
        (this.loading = false),
          this.alert(
            'warning',
            'No se Encontraron Bienes con los Parámetros de Búsqueda',
            ''
          );
      },
    });
  }

  openForm(good?: IGood) {
    console.log(good);
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      good,
      callback: (next: boolean) => {
        if (next) this.getGoods();
      },
    };
    this.modalService.show(
      EditValidationExemptedGoodsModalComponent,
      modalConfig
    );
  }

  cleandInfo() {
    this.form.reset();
    this.getGoods();
  }
}

/*



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

  // getGoods2(){
  //   this.loading = true;
  //   this.goodTransAvaService.getAll(this.params.getValue()).subscribe({
  //     next: response => {
  //       this.goods = response.data;
  //       this.totalItems = response.count;
  //       this.loading = false;
  //     },
  //     error: error => (this.loading = false),
  //   });
  // }

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
*/
