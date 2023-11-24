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

  parentIdlvl1: number = null;
  parentIdlvl2: number = null;
  parentIdlvl3: number = null;
  parentIdlvl4: number = null;
  parentIdlvl5: number = null;
  parentIdlvl6: number = null;
  fractionLvl1: IFraction = null;
  fractionLvl2: IFraction = null;
  fractionLvl3: IFraction = null;
  fractionLvl4: IFraction = null;
  fractionLvl5: IFraction = null;
  fractionLvl6: IFraction = null;

  constructor(
    private fractionService: FractionService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = FRACTIONS_COLUMNS;
    this.settings.actions = false;
    //this.settings.actions.delete = true;
    //this.settings.actions.add = false;
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
    params['filter.level'] = `$eq:0`;
    params['sortBy'] = `id:ASC`;
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

  selectRow(event: any) {
    console.log(event);
    if (event.isSelected == false) {
      return;
    }
    this.parentIdlvl1 = null;
    this.fractionLvl1 = null;
    this.parentIdlvl2 = null;
    this.parentIdlvl2 = null;
    this.fractionLvl3 = null;
    this.fractionLvl3 = null;
    this.parentIdlvl4 = null;
    this.fractionLvl4 = null;
    this.parentIdlvl5 = null;
    this.fractionLvl5 = null;
    this.parentIdlvl6 = null;
    this.fractionLvl6 = null;

    setTimeout(() => {
      this.parentIdlvl1 = event.data.id;
      const level = event.data.level;
      this.fractionLvl1 = event.data;
    }, 500);
  }

  getFraction(event: any) {
    console.log(event);
    if (event == null) {
      this.onLoadToast('info', 'No se encontraron registros');
      return;
    }

    if (event.level == 1) {
      this.parentIdlvl2 = null;
      this.fractionLvl2 = null;
      this.parentIdlvl3 = null;
      this.fractionLvl3 = null;
      this.parentIdlvl4 = null;
      this.fractionLvl4 = null;
      this.parentIdlvl5 = null;
      this.fractionLvl5 = null;
      this.parentIdlvl6 = null;
      this.fractionLvl6 = null;
      setTimeout(() => {
        this.parentIdlvl2 = event.id;
        this.fractionLvl2 = event;
      }, 400);
    }

    if (event.level == 2) {
      this.parentIdlvl3 = null;
      this.fractionLvl3 = null;
      this.parentIdlvl4 = null;
      this.fractionLvl4 = null;
      this.parentIdlvl5 = null;
      this.fractionLvl5 = null;
      this.parentIdlvl6 = null;
      this.fractionLvl6 = null;
      setTimeout(() => {
        this.parentIdlvl3 = event.id;
        this.fractionLvl3 = event;
      }, 400);
    }

    if (event.level == 3) {
      this.parentIdlvl4 = null;
      this.fractionLvl4 = null;
      this.parentIdlvl5 = null;
      this.fractionLvl5 = null;
      this.parentIdlvl6 = null;
      this.fractionLvl6 = null;
      setTimeout(() => {
        this.parentIdlvl4 = event.id;
        this.fractionLvl4 = event;
      }, 400);
    }

    if (event.level == 4) {
      this.parentIdlvl5 = null;
      this.fractionLvl5 = null;
      this.parentIdlvl6 = null;
      this.fractionLvl6 = null;
      setTimeout(() => {
        this.parentIdlvl5 = event.id;
        this.fractionLvl5 = event;
      }, 400);
    }

    if (event.level == 5) {
      this.parentIdlvl6 = event.id;
      this.fractionLvl6 = event;
    }
  }

  hideFraction({ level }: any) {
    if (level == 1) {
      this.parentIdlvl2 = null;
      this.fractionLvl2 = null;
    }

    if (level == 2) {
      this.parentIdlvl3 = null;
      this.fractionLvl3 = null;
    }

    if (level == 3) {
      this.parentIdlvl4 = null;
      this.fractionLvl4 = null;
    }

    if (level == 4) {
      this.parentIdlvl5 = null;
      this.fractionLvl5 = null;
    }

    if (level == 5) {
      this.parentIdlvl6 = null;
      this.fractionLvl6 = null;
    }
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
