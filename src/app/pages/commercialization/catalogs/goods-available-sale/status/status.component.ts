import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { COLUMNS } from './columns';
//Provisional Data
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { data } from './data';
import { GoodsAvailableSaleFormComponent } from './goods-available-sale-form/goods-available-sale-form.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styles: [],
})
export class StatusComponent extends BasePage implements OnInit {
  comercializationGoods: any[] = [];
  goodsAFSD = data;
  rowSelected: boolean = false;
  selectedRow: any = null;
  status: any;
  columns = COLUMNS;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private goodService: GoodService,
    private BsModalService: BsModalService
  ) {
    /*super();
    this.service = this.goodService;
    this.service = this.goodService;
    this.ilikeFilters = ['description'];
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: COLUMNS,
    };*/
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  /*extends BasePageWidhtDinamicFilters
  implements OnInit*/

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
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'warehouseDetails':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
                break;
              case 'batchDetails':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            /*filter.field == 'id' ||
              filter.field == 'warehuseDetails' ||
              filter.field == 'batchDetails' ||
            filter.field == 'description' ||
            filter.field == 'status'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);*/
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodService.getAll(params).subscribe({
      next: response => {
        //this.racks = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
    this.goodService.update(event.newData).subscribe();
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }

  onAddConfirm(event: any) {
    event.confirm.resolve();
    this.goodService.create(event.newData).subscribe();
    this.onLoadToast('success', 'Elemento Creado', '');
  }

  showDeleteAlert(event: any) {
    const body = {
      id: event.id,
      goodId: event.goodId,
    };
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(body);
      }
    });
  }

  delete(body: Object) {
    this.goodService.removeGood(body).subscribe({
      next: () => {
        this.alert('success', 'Delegación Regional', 'Borrado');
        // this.getAllEventTypes();
      },
      error: error => {
        this.alert(
          'warning',
          'Delegación Regional',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  openForm(rack?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      rack,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
      class: 'modal-lg modal-dialog-centered',
    };
    this.BsModalService.show(GoodsAvailableSaleFormComponent, modalConfig);
  }
}
