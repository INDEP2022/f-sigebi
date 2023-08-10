import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { MunicipalityFormComponent } from '../municipality-form/municipality-form.component';
import { IMunicipality } from './../../../../core/models/catalogs/municipality.model';
import { MunicipalityService } from './../../../../core/services/catalogs/municipality.service';
import { MUNICIPALITIES_COLUMNS } from './municipality-columns';

@Component({
  selector: 'app-municipality-list',
  templateUrl: './municipality-list.component.html',
  styles: [],
})
export class MunicipalityListComponent extends BasePage implements OnInit {
  columns: IMunicipality[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private municipalityService: MunicipalityService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = MUNICIPALITIES_COLUMNS;
    this.settings.actions.delete = false;
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
            switch (filter.field) {
              case 'stateKey':
                searchFilter = SearchFilter.EQ;
                break;
              case 'idMunicipality':
                searchFilter = SearchFilter.EQ;
                break;
              case 'state':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.descCondition`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            /*filter.field == 'stateKey' ||
            filter.field == 'nameMunicipality' ||
            filter.field == 'creationUser' ||
            filter.field == 'editionUser' ||
            filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);*/
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
    this.municipalityService.getAll(params).subscribe({
      next: response => {
        if (response.data) {
          this.columns = response.data;
          this.totalItems = response.count;
          this.data.load(response.data);
          this.data.refresh();
          this.loading = false;
        } else {
          this.data.load([]);
          this.data.refresh();
          this.loading = false;
        }
      },
      error: error => (this.loading = false),
    });
  }

  openForm(municipality?: IMunicipality) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      municipality,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(MunicipalityFormComponent, modalConfig);
  }

  delete(batch: IMunicipality) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(batch);
      }
    });
  }

  remove(model: IMunicipality) {
    const data = {
      idMunicipality: model.idMunicipality,
      stateKey: model.stateKey,
    };

    this.municipalityService.remove2(data).subscribe(
      res => {
        this.alert('success', 'Municipio', 'Borrado Correctamente');
        this.getExample();
      },
      err => {
        this.alert(
          'warning',
          'Municipio',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      }
    );
  }
}
