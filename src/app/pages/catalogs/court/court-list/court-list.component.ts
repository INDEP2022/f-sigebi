import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICourt } from '../../../../core/models/catalogs/court.model';
import { CourtFormComponent } from '../court-form/court-form.component';
import { CourtService } from './../../../../core/services/catalogs/court.service';
import { COURT_COLUMNS } from './court-columns';

@Component({
  selector: 'app-court-list',
  templateUrl: './court-list.component.html',
  styles: [],
})
export class CourtListComponent extends BasePage implements OnInit {
  columns: ICourt[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();
  constructor(
    private courtService: CourtService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = COURT_COLUMNS;
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
              case 'id':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'zipCode':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            /*filter.field == 'id' ||
            filter.field == 'description' ||
            filter.field == 'manager' ||
            filter.field == 'street' ||
            filter.field == 'numInterior' ||
            filter.field == 'numExterior' ||
            filter.field == 'cologne' ||
            filter.field == 'delegationMun' ||
            filter.field == 'zipCode' ||
            filter.field == 'numPhone' ||
            filter.field == 'circuitCVE' ||
            filter.field == 'numRegister'
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
    this.courtService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<CourtFormComponent>) {
    const modalRef = this.modalService.show(CourtFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(court?: ICourt) {
    this.openModal({ court });
  }

  delete(batch: ICourt) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(batch.id);
      }
    });
  }

  remove(id: number) {
    this.courtService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Juzgado', 'Borrado Correctamente');
        this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Juzgado',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
