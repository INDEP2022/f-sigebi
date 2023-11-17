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
import { StatusDispService } from 'src/app/core/services/ms-status-disp/status-disp.service';
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
    private BsModalService: BsModalService,
    private statusDispService: StatusDispService
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
              case 'idStatus':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'comerTpevents':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
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
    this.statusDispService.getAllTypeUser(params).subscribe({
      next: response => {
        //this.racks = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.totalItems = 0;
        this.data.load([]);
        this.data.refresh();
      },
    });
  }

  // onSaveConfirm(event: any) {
  //   event.confirm.resolve();
  //   this.goodService.update(event.newData).subscribe();
  //   this.onLoadToast('success', 'Elemento Actualizado', '');
  // }

  // onAddConfirm(event: any) {
  //   event.confirm.resolve();
  //   this.goodService.create(event.newData).subscribe();
  //   this.onLoadToast('success', 'Elemento Creado', '');
  // }

  showDeleteAlert(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        let data = {
          idStatus: event.idStatus,
          idDirection: event.idDirection,
          idTypeEvent: event.idTypeEvent,
        };
        this.delete(data);
      }
    });
  }

  delete(body: Object) {
    this.statusDispService.remove(body).subscribe({
      next: () => {
        this.alert('success', 'El registro se ha eliminado', '');
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getExample());
      },
      error: error => {
        this.alert(
          'warning',
          'Estatus Disponibles para Comercializar',
          'No se puede eliminar el registro debido a una relación con otra tabla.'
        );
      },
    });
  }

  // selectRow(row: any) {
  //   this.selectedRow = row;
  //   this.rowSelected = true;
  // }

  openForm(goodsAvailable?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      goodsAvailable,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
      class: 'modal-lg modal-dialog-centered',
    };
    this.BsModalService.show(GoodsAvailableSaleFormComponent, modalConfig);
  }
}
