import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IStrategyServiceType } from 'src/app/core/models/ms-strategy-service-type/strategy-service-type.model';
import { StrategyServiceTypeService } from 'src/app/core/services/ms-strategy/strategy-service-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { SpecsFormComponent } from '../specs-form/specs-form.component';
import { SPECS_COLUMNS } from './specs-columns';

@Component({
  selector: 'app-specs',
  templateUrl: './specs.component.html',
  styles: [],
})
export class SpecsComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  columns: IStrategyServiceType[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private serviceTypeService: StrategyServiceTypeService,
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
      columns: SPECS_COLUMNS,
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
            switch (filters.field) {
              case 'serviceNumber':
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
          this.getServicesTypesAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getServicesTypesAll());
  }

  getServicesTypesAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.serviceTypeService.getAll(params).subscribe({
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

  openForm(serviceType?: IStrategyServiceType) {
    let config: ModalOptions = {
      initialState: {
        serviceType,
        callback: (next: boolean) => {
          if (next) this.getServicesTypesAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SpecsFormComponent, config);
  }

  showDeleteAlert(serviceType?: IStrategyServiceType) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(serviceType.serviceTypeNumber);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.serviceTypeService.remove(id).subscribe({
      next: () => this.getServicesTypesAll(),
    });
  }
}
