import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IStrategyProcess } from 'src/app/core/models/ms-strategy-process/strategy-process.model';
import { StrategyProcessService } from 'src/app/core/services/ms-strategy/strategy-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { ProcessFormComponent } from '../process-form/process-form.component';
import { PROCESS_COLUMNS } from './process-columns';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styles: [],
})
export class ProcessComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  columns: IStrategyProcess[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private processService: StrategyProcessService,
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
      columns: { ...PROCESS_COLUMNS },
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
              case 'processNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'desShort':
                searchFilter = SearchFilter.EQ;
                break;
              case 'relayEstate':
                searchFilter = SearchFilter.EQ;
                break;
              case 'relayStrategy':
                searchFilter = SearchFilter.EQ;
                break;
              case 'programmingType':
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
          this.getProcessesAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getProcessesAll());
  }

  getProcessesAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.processService.getAll(params).subscribe({
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

  openForm(process?: IStrategyProcess) {
    let config: ModalOptions = {
      initialState: {
        process,
        callback: (next: boolean) => {
          if (next) this.getProcessesAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProcessFormComponent, config);
  }

  showDeleteAlert(process?: IStrategyProcess) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(process.processNumber);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.processService.remove(id).subscribe({
      next: () => this.getProcessesAll(),
    });
  }
}
