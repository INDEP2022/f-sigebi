import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { BasePage } from 'src/app/core/shared';
import { SERVICEORDERSFORMASELECT_COLUMNS } from './service-orders-format-historic-columns';

@Component({
  selector: 'app-performance-indicatos-detail-modal',
  templateUrl: './performance-indicatos-detail-modal.component.html',
  styles: [],
})
export class PerformanceIndicatosDetailModalComponent
  extends BasePage
  implements OnInit
{
  datalocal: LocalDataSource = new LocalDataSource();
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  selectedRow: any;
  constructor(
    private modalRef: BsModalRef,
    private strategyProcessService: StrategyProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: SERVICEORDERSFORMASELECT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.filterA();
  }

  close() {
    this.modalRef.hide();
  }

  getAll() {
    this.data1 = [];
    this.datalocal.load([]);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.strategyProcessService.getAllStrategyIndicator(params).subscribe({
      next: response => {
        console.log('respuesta modal ', response);
        let status: any;
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].status == 0) {
            status = 'ABIERT0';
          } else {
            status = 'CERRADO';
          }
          let paramstable = {
            delegationOneNumber: response.data[i].delegationOneNumber,
            monthNumber: response.data[i].monthNumber,
            yearNumber: response.data[i].yearNumber,
            registerNumber: response.data[i].registerNumber,
            status: status,
          };
          this.data1.push(paramstable);
          this.datalocal.load(this.data1);
          this.totalItems = response.count;
        }
      },
    });
  }

  filterA() {
    this.datalocal
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'delegationOneNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'monthNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'yearNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'registerNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.EQ;
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
          this.getAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAll());
  }

  onRowSelect(event: any) {
    this.selectedRow = event.data;
    console.log('this.selectedRow ', this.selectedRow);
  }

  selected() {
    if (this.selectedRow == null) {
      this.alert('warning', 'Es Necesario Seleccionar un Registro', '');
    } else {
      this.modalRef.content.callback(true, this.selectedRow.registerNumber);
      this.modalRef.hide();
    }
  }
}
