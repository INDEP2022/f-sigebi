import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISiseProcess } from 'src/app/core/models/catalogs/sise-process.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { SiseProcessService } from '../../../../core/services/catalogs/sise-process.service';
import { SiseProcessFormComponent } from '../sise-process-form/sise-process-form.component';
import { SISI_PROCESS_COLUMNS } from './sisi-process-columns';

@Component({
  selector: 'app-sise-process-list',
  templateUrl: './sise-process-list.component.html',
  styles: [],
})
export class SiseProcessListComponent extends BasePage implements OnInit {
  siseProcess: ISiseProcess[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private siseProcessService: SiseProcessService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = SISI_PROCESS_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
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
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
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
    this.siseProcessService.getAll(params).subscribe({
      next: response => {
        this.siseProcess = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(sisi?: ISiseProcess) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      sisi,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.BsModalService.show(SiseProcessFormComponent, modalConfig);
  }

  delete(sisi?: ISiseProcess) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(sisi.id);
      }
    });
  }

  remove(id: number) {
    this.siseProcessService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Proceso SISE', 'Borrado Correctamente');
        this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Procesos Sise',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
