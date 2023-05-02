import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CostCatalogService } from '../cost-catalog.service';
import { ModalCostCatalogComponent } from '../modal-cost-catalog/modal-cost-catalog.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-cost-catalog',
  templateUrl: './cost-catalog.component.html',
  styles: [],
})
export class CostCatalogComponent extends BasePage implements OnInit {
  columns: any[] = [];
  dataTable: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private catalogService: CostCatalogService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            // filter.field == 'id'
            //   ? (searchFilter = SearchFilter.EQ)
            //   : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getCostCatalog();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCostCatalog());
  }

  getCostCatalog() {
    this.data = [];
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.catalogService.getCostCatalogparams(params).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.data.push({
              keyServices: item.code,
              descriptionServices: item.description,
              typeExpenditure: item.subaccount,
              unaffordable:
                item.unaffordabilityCriterion === 'N' ? false : true,
              cost: item.cost !== 'GASTO' ? true : false,
              expenditure: item.cost === 'GASTO' ? true : false,
            });
          });
          this.totalItems = resp.count;
        }
        this.columns = this.data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
  openForm(allotment?: any) {
    let config: ModalOptions = {
      initialState: {
        allotment,
        callback: (next: boolean) => {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getCostCatalog());
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalCostCatalogComponent, config);
  }

  delete(drawer: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.catalogService.deleteCostCatalog(drawer.keyServices).subscribe({
          next: (resp: any) => {
            if (resp) {
              this.alert('success', 'Eliminado correctamente', '');
              this.getCostCatalog();
            }
          },
        });
      }
    });
  }
}
