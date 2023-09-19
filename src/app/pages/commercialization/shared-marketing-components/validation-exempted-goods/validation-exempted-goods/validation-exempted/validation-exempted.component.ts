import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IGoodsTransAva } from 'src/app/core/models/ms-good/goods-trans-ava.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodTransAvaService } from 'src/app/core/services/ms-good/goods-trans-ava.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EditValidationExemptedGoodsModalComponent } from '../../edit-validation-exempted-goods-modal/edit-validation-exempted-goods-modal.component';
import { PROCCESS_COLUMNS } from '../validation-exempted-goods-columns';

@Component({
  selector: 'app-validation-exempted',
  templateUrl: './validation-exempted.component.html',
  styles: [],
})
export class ValidationExemptedListComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Procesos';
  validationExempte: IGoodsTransAva[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  private _proccessList: IGood;
  @Input() get proccessList(): IGood {
    return this._proccessList;
  }
  set proccessList(value: IGood) {
    this._proccessList = value;
    this.getData();
  }
  validationExempteId: number;

  constructor(
    private modalService: BsModalService,
    private goodService: GoodService,
    private goodTransAvaService: GoodTransAvaService
  ) {
    super();
    this.settings.columns = PROCCESS_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.columnTitle = 'Acciones';
    this.settings.actions.edit = true;
    this.settings.actions.add = false;
    this.settings.actions.delete = false;
  }

  ngOnInit(): void {
    this.data
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
              case 'goodNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'process':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.data = new LocalDataSource();
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.proccessList && this.proccessList.id) {
      this.validationExempteId = this.proccessList.id;
      this.loading = true;
      this.goodTransAvaService
        .getById(this.validationExempteId, params)
        .subscribe({
          next: response => {
            this.data.load([response]);
            this.data.refresh();
            this.totalItems = 1;
            this.loading = false;
          },
          error: error => {
            this.loading = false;
            this.data = new LocalDataSource();
            this.totalItems = 0;
            this.alert('warning', 'No tiene bienes exentos', '');
          },
        });
    }
  }

  openForm(goodsTransAva?: IGoodsTransAva) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      goodsTransAva,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(
      EditValidationExemptedGoodsModalComponent,
      modalConfig
    );
  }
}
