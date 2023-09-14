import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-household',
  templateUrl: './household.component.html',
  styles: [],
})
export class HouseholdComponent extends BasePage implements OnInit, OnChanges {
  list: any[] = [];
  good: IGood;
  menajes: IGood[] = [];
  @Input() goodId: number;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilter: any = [];
  dataLoand: LocalDataSource = new LocalDataSource();

  constructor(
    private readonly goodServices: GoodService,
    private readonly menageServices: MenageService
  ) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      id: {
        title: 'Menaje',
        width: '20%',
        sort: false,
      },
      description: {
        title: 'Descripción',
        width: '70%',
        sort: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.searchGoodMenage(this.goodId);
    }
  }

  ngOnInit(): void {
    this.dataLoand
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/

            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                field = `filter.menajeDescription.${filter.field}`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
              this.params.value.page = 1;
            } else {
              delete this.columnFilter[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.searchGoodMenage(this.goodId);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchGoodMenage(this.goodId));
  }

  searchGoodMenage(idGood: number) {
    //this.menajes = [];
    this.loading = true;
    this.params.getValue()['filter.noGood'] = `$eq:${idGood}`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilter,
    };
    this.menageServices.getMenaje(params).subscribe({
      next: response => {
        this.loading = false;
        if (response.count > 0) {
          this.menajes = response.data.map((menage: any) => {
            return menage.menajeDescription;
          });
          this.dataLoand.load(this.menajes);
          this.dataLoand.refresh();
          this.totalItems = response.count;
        }
      },
      error: err => {
        this.dataLoand.load([]);
        this.dataLoand.refresh();
        this.loading = false;
      },
    });
  }

  async showDeleteAlert(good: IGood) {
    const response = await this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    );
    if (response.isConfirmed) {
      this.delete(good.id);
    }
  }

  delete(idGood: string | number) {
    this.menageServices.remove(idGood).subscribe({
      next: responde => {
        //this.searchGoodMenage(this.numberGoodSelect);
        this.alert(
          'success',
          'Datos Menaje',
          `Se Elimino el Menaje N° ${idGood}`
        );
      },
      error: err => {
        this.alert(
          'error',
          'Ha Ocurrido un Error',
          `No se Pudo Eliminar el Menaje N° ${idGood}`
        );
      },
    });
  }
}
