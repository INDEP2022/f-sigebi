import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StationFormComponent } from '../station-form/station-form.component';
import { STATION_COLUMS } from './station-columns';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styles: [],
})
export class StationListComponent extends BasePage implements OnInit {
  paragraphs: IStation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private stationService: StationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATION_COLUMS;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'transferent':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.nameTransferent`;
                break;
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'keyState':
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
    this.stationService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(station?: IStation) {
    let config: ModalOptions = {
      initialState: {
        station,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StationFormComponent, config);
  }

  delete(station: IStation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(station.id);
      }
    });
  }

  remove(id: number) {
    this.stationService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Emisora', 'Borrada Correctamente');
        this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Emisora',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
