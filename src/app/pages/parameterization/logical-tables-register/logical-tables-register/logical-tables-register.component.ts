import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LogicalTablesRegisterModalComponent } from '../logical-tables-register-modal/logical-tables-register-modal.component';
import { LOGICAL_TABLES_REGISTER_COLUMNS } from './logical-tables-register-columns';
//models
import { ITables } from 'src/app/core/models/catalogs/dinamic-tables.model';
//service
import { LocalDataSource } from 'ng2-smart-table';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logical-tables-register',
  templateUrl: './logical-tables-register.component.html',
  styles: [],
})
export class LogicalTablesRegisterComponent extends BasePage implements OnInit {
  columns: ITables[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  dinamicTables: ITables[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private dinamicTablesService: DinamicTablesService
  ) {
    super();

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...LOGICAL_TABLES_REGISTER_COLUMNS },
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
            /*SPECIFIC CASES*/
            filter.field == 'city'
              ? (field = `filter.${filter.field}.nameCity`)
              : (field = `filter.${filter.field}`);
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getDinamicTables();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDinamicTables());
  }

  getDinamicTables() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.dinamicTablesService.getAll2(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        //this.dinamicTables = response.data;
        //this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(dinamicTables?: ITables) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      dinamicTables,
      callback: (next: boolean) => {
        if (next) this.getDinamicTables();
      },
    };
    this.modalService.show(LogicalTablesRegisterModalComponent, modalConfig);
  }

  showDeleteAlert(dinamicTables: ITables) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(dinamicTables.table);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.dinamicTablesService.remove2(id).subscribe({
      next: () => this.getDinamicTables(),
    });
  }
}
