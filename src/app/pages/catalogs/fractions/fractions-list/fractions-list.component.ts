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
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'norms':
                field = `filter.${filter.field}.norm`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'fractionCode':
                searchFilter = SearchFilter.EQ;
                break;
              case 'version':
                searchFilter = SearchFilter.EQ;
                break;
              case 'siabClasification':
                field = `filter.${filter.field}.sssubtypeDescription`;
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            /*filter.field == 'norms'
              ? (field = `filter.${filter.field}.norm`)
              : (field = `filter.${filter.field}`);
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);*/
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
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
        /*this.paragraphs = response.data.map((item: any) => {
          item.clasificationName =
            item.siabClasification?.sssubtypeDescription || '';
          return item;
        });*/
        this.totalItems = response.count || 0;
        this.data.load(response.data);
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

  showDeleteAlert(drawer: IFraction) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(drawer.id);
      }
    });
  }

  delete(id: number) {
    this.fractionService.remove(id).subscribe({
      next: response => {
        this.alert('success', 'Fracción', 'Borrada Correctamente'),
          this.getFractions();
      },
      error: err => {
        this.alert(
          'warning',
          'Fraccion',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
