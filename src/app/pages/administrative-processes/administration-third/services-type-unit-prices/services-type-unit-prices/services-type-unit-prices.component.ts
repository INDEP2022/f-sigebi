import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IStrategyService,
  IStrategyTypeService,
} from 'src/app/core/models/ms-strategy-service/strategy-service.model';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ServicesTypeUnitPricesFormComponent } from '../services-type-unit-prices-form/services-type-unit-prices-form.component';
import { SERVICEUNITPRECES_COLUMNS } from './service-unit-preces-columns';
@Component({
  selector: 'app-services-type-unit-prices',
  templateUrl: './services-type-unit-prices.component.html',
  styles: [],
})
export class ServicesTypeUnitPricesComponent
  extends BasePage
  implements OnInit
{
  data: LocalDataSource = new LocalDataSource();
  columns: IStrategyService[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private serviceService: StrategyServiceService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: SERVICEUNITPRECES_COLUMNS,
    };
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
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'serviceTypeNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
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
          this.getServicesAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getServicesAll());
  }

  getServicesAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.serviceService.getAllType(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.data.load(this.columns);
        this.totalItems = response.count || 0;
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  openForm(service?: IStrategyTypeService) {
    let config: ModalOptions = {
      initialState: {
        service,
        callback: (next: boolean) => {
          if (next) this.getServicesAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ServicesTypeUnitPricesFormComponent, config);
  }

  showDeleteAlert(service?: IStrategyTypeService) {
    this.alertQuestion('warning', '', '¿Desea borrar este registro?').then(
      question => {
        if (question.isConfirmed) {
          this.delete(service.serviceTypeNumber);
          this.alert('success', 'Registro Eliminado Correctamente', '');
        }
      }
    );
  }

  delete(id: number) {
    this.serviceService.removeType(id).subscribe({
      next: () => this.getServicesAll(),
    });
  }
}
