import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IMaximumTimes } from 'src/app/core/models/catalogs/maximum-times-model';
import { MaximumTimesService } from 'src/app/core/services/catalogs/maximum-times.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MaximumTimesModalComponent } from '../maximum-times-modal/maximum-times-modal.component';
import { MAXIMUM_TIMES_COLUMNS } from './maximum-times-columns';

@Component({
  selector: 'app-maximum-times',
  templateUrl: './maximum-times.component.html',
  styles: [],
})
export class MaximumTimesComponent extends BasePage implements OnInit {
  maximumTimesForm: FormGroup;
  maximumTimes: IMaximumTimes[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private maximumTimesService: MaximumTimesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: MAXIMUM_TIMES_COLUMNS,
    };
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
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
            // filter.field == 'id'
            //   ? (searchFilter = SearchFilter.EQ)
            //   : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getMaximumTimeAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMaximumTimeAll());
  }

  getMaximumTimeAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.maximumTimesService.getAll(params).subscribe({
      next: response => {
        console.log(response.data);
        this.maximumTimes = response.data;
        this.data.load(this.maximumTimes);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(maximumTimes?: IMaximumTimes) {
    console.log(maximumTimes);
    let config: ModalOptions = {
      initialState: {
        maximumTimes,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getMaximumTimeAll());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaximumTimesModalComponent, config);
  }
  opendelete(maximumTimes: any) {
    console.log(maximumTimes.data);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.maximumTimesService
          .remove(maximumTimes.data.certificateType)
          .subscribe({
            next: () => {
              this.onLoadToast('success', 'Se ha eliminado', '');
              this.getMaximumTimeAll();
            },
            error: err => this.onLoadToast('error', err.error.message, ''),
          });
      }
    });
  }
}
