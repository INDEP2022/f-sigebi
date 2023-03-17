import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IFraction } from 'src/app/core/models/catalogs/fraction.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { FractionsFormComponent } from '../fractions-form/fractions-form.component';
import { FRACTIONS_COLUMNS } from './fractions-columns';

@Component({
  selector: 'app-fractions-list',
  templateUrl: './fractions-list.component.html',
  styles: [],
})
export class FractionsListComponent extends BasePage implements OnInit {
  paragraphs: IFraction[] = [];
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private fractionService: FractionService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = FRACTIONS_COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: false,
        delete: false,
        custom: [
          {
            name: 'add',
            title: '<i class="fa fa-plus text-success mx-2"></i>',
          },
        ],
      },
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
            filter.field == 'norms'
              ? (field = `filter.${filter.field}.norm`)
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
          this.getFractions();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getFractions());
  }

  getFractions() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.fractionService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.paragraphs);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(fraction?: IFraction) {
    let config: ModalOptions = {
      initialState: {
        fraction,
        callback: (next: boolean) => {
          if (next) this.getFractions();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(FractionsFormComponent, config);
  }

  delete(fraction: IFraction) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.fractionService.remove(fraction.id).subscribe({
          next: data => this.getFractions(),
          error: error => (this.loading = false),
        });
      }
    });
  }
}
