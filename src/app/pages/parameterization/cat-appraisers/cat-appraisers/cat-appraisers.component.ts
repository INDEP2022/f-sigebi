import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IProficient } from 'src/app/core/models/catalogs/proficient.model';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalCatAppraisersComponent } from '../modal-cost-catalog/modal-cat-appraisers.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-cat-appraisers',
  templateUrl: './cat-appraisers.component.html',
  styles: [],
})
export class CatAppraisersComponent extends BasePage implements OnInit {
  columns: any[] = [];
  proficient: IProficient[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private proficientSer: ProeficientService
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
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getProficient();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getProficient();
    });
  }

  private getProficient() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.proficientSer.getAll(params).subscribe({
      next: resp => {
        this.proficient = resp.data;
        this.data.load(this.proficient);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.onLoadToast('error', err.error.message, '');
        this.loading = false;
      },
    });
  }

  openModal(context?: Partial<ModalCatAppraisersComponent>) {
    let config: ModalOptions = {
      initialState: {
        ...context,
        callback: (next: boolean) => {
          if (next) this.getProficient();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalCatAppraisersComponent, config);
  }

  openForm(data?: any) {
    const allotment = data != null ? data.data : null;
    this.openModal({ allotment });
  }

  delete(proficient: any) {
    console.log(proficient);
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.proficientSer.remove(proficient.data.id).subscribe({
          next: () => {
            this.onLoadToast('success', 'Se ha eliminado', '');
            this.getProficient();
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }
}
