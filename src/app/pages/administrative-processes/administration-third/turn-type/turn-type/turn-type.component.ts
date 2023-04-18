import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IStrategyShift } from 'src/app/core/models/ms-strategy-shift/strategy-shift.model';
import { StrategyShiftService } from 'src/app/core/services/ms-strategy/strategy-shift.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { TurnTypeFormComponent } from '../turn-type-form/turn-type-form.component';
import { TURNTYPE_COLUMNS } from './turn-type-columns';

@Component({
  selector: 'app-turn-type',
  templateUrl: './turn-type.component.html',
  styles: [],
})
export class TurnTypeComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  columns: IStrategyShift[] = [];
  columnFilters: any = [];

  constructor(
    private shiftService: StrategyShiftService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: TURNTYPE_COLUMNS,
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
              case 'description':
                searchFilter = SearchFilter.EQ;
                break;
              case 'shiftNumber':
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
          this.getShiftsAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getShiftsAll());
  }

  getShiftsAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.shiftService.getAll(params).subscribe({
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

  openForm(shift?: IStrategyShift) {
    let config: ModalOptions = {
      initialState: {
        shift,
        callback: (next: boolean) => {
          if (next) this.getShiftsAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TurnTypeFormComponent, config);
  }

  showDeleteAlert(shift?: IStrategyShift) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(shift.shiftNumber);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.shiftService.remove(id).subscribe({
      next: () => this.getShiftsAll(),
    });
  }
}
