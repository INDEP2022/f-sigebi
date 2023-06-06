import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
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
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

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
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((change: { action: string; filter: { filters: any } }) => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
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
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(sisi?: ISiseProcess) {
    let config: ModalOptions = {
      initialState: {
        sisi,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.BsModalService.show(SiseProcessFormComponent, config);
  }

  delete(sisi?: ISiseProcess) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.siseProcessService.remove(sisi.id).subscribe({
          next: () => this.getExample(),
        });
        // this.siseProcessService.remove(sisi.id);
      }
    });
  }
}
