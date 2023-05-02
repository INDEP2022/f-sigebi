import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { ICity } from '../../../../core/models/catalogs/city.model';
import { CityService } from '../../../../core/services/catalogs/city.service';
import { CityDetailComponent } from '../city-detail/city-detail.component';
import { CITY_COLUMNS } from './city-columns';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styles: [],
})
export class CityListComponent extends BasePage implements OnInit {
  columns: ICity[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  city: ICity[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private cityService: CityService,
    private modalService: BsModalService
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
      columns: { ...CITY_COLUMNS },
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
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'idCity':
                searchFilter = SearchFilter.EQ;
                break;
              case 'nameCity':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'state':
                filter.field == 'state';
                field = `filter.${filter.field}.descCondition`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noDelegation':
                searchFilter = SearchFilter.EQ;
                break;
              case 'noSubDelegation':
                searchFilter = SearchFilter.EQ;
                break;
              case 'legendOffice':
                searchFilter = SearchFilter.ILIKE;
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
          this.getCities();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCities());
  }

  getCities() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.cityService.getAll(params).subscribe({
      next: response => {
        // this.city = response.data;
        // this.totalItems = response.count;
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(city?: ICity) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      city,
      callback: (next: boolean) => {
        if (next) this.getCities();
      },
    };
    this.modalService.show(CityDetailComponent, modalConfig);
  }

  showDeleteAlert(cities: ICity) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(cities.idCity);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.cityService.remove2(id).subscribe({
      next: () => this.getCities(),
    });
  }
}
