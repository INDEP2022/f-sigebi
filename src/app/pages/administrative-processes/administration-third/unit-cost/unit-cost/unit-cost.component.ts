import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUnitCost } from 'src/app/core/models/administrative-processes/unit-cost.model';
import { UnitCostService } from 'src/app/core/services/unit-cost/unit-cost.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { UnitCostFormComponent } from '../unit-cost-form/unit-cost-form.component';
import { COSTKEY_COLUMNS, VALIDITYCOST_COLUMNS } from './unit-cost-columns';

@Component({
  selector: 'app-unit-cost',
  templateUrl: './unit-cost.component.html',
  styles: [],
})
export class UnitCostComponent extends BasePage implements OnInit {
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  settings1 = { ...this.settings, actions: false };
  data2: any[] = [];
  columns: IUnitCost[] = [];
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  columnFilters: any = [];

  constructor(
    private unitCostService: UnitCostService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: COSTKEY_COLUMNS,
    };
    this.settings1.columns = VALIDITYCOST_COLUMNS;
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
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'processNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'serviceNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'serviceTypeNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'shiftNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'varCostNumber':
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
          this.getUnitCostAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUnitCostAll());
  }

  getUnitCostAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.unitCostService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.data1.load(this.columns);
        this.totalItems = response.count || 0;
        this.data1.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  openForm(contract?: IUnitCost) {
    let config: ModalOptions = {
      initialState: {
        contract,
        callback: (next: boolean) => {
          if (next) this.getUnitCostAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UnitCostFormComponent, config);
  }

  showDeleteAlert(contract?: IUnitCost) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(contract.costId);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.unitCostService.remove(id).subscribe({
      next: () => this.getUnitCostAll(),
    });
  }
}
