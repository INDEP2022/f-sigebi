import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, of, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IFraction } from 'src/app/core/models/catalogs/fraction.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { BasePage } from 'src/app/core/shared';
import { FractionsFormComponent } from '../fractions-form/fractions-form.component';
import { FRACTIONS_COLUMNS } from '../fractions-list/fractions-columns';

@Component({
  selector: 'app-fraction-lvl',
  templateUrl: './fraction-lvl.component.html',
  styles: [],
})
export class FractionLvlComponent extends BasePage implements OnInit {
  @Input() fractionLvl: any = null;
  @Output() returnfraction = new EventEmitter<any>();
  @Output() nofraction = new EventEmitter<any>();

  paragraphs: IFraction[] = [];
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  level: number = 0;

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
    this.level = Number(this.fractionLvl.level) + 1;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((change: any) => {
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
    params['filter.parentId'] = `$eq:${this.fractionLvl.id}`;
    params['sortBy'] = `id:ASC`;
    this.fractionService
      .getAll(params)
      .pipe(
        catchError(e => {
          if (e.status == 400) return of({ data: [], count: 0 });
          return e;
        })
      )
      .subscribe({
        next: (response: any) => {
          /*this.paragraphs = response.data.map((item: any) => {
          item.clasificationName =
            item.siabClasification?.sssubtypeDescription || '';
          return item;
        });*/
          if (response.data.length == 0) {
            this.onLoadToast('info', 'No cuenta con mas fracciones');
            this.nofraction.emit({ level: this.fractionLvl.level });
            return;
          }
          this.totalItems = response.count || 0;
          this.data.load(response.data);
          this.data.refresh();
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  selectRow(event: any) {
    this.returnfraction.emit(event.data);
  }

  openForm(fraction?: IFraction) {
    let oldFraction = null;
    if (fraction == undefined) oldFraction = this.data['data'][0];
    let config: ModalOptions = {
      initialState: {
        fraction,
        oldFraction,
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
