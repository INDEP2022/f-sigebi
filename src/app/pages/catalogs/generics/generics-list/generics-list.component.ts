import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from '../../../../core/models/catalogs/generic.model';
import { GenericsFormComponent } from '../generics-form/generics-form.component';
import { GenericService } from './../../../../core/services/catalogs/generic.service';
import { GENERICS_COLUMNS } from './generics-columns';

@Component({
  selector: 'app-generics-list',
  templateUrl: './generics-list.component.html',
  styles: [],
})
export class GenericsListComponent extends BasePage implements OnInit {
  columns: IGeneric[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private genericsService: GenericService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GENERICS_COLUMNS;

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
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'keyId' || filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
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
    this.genericsService.getAll(params).subscribe({
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

  openModal(context?: Partial<GenericsFormComponent>) {
    const modalRef = this.modalService.show(GenericsFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(generics?: IGeneric) {
    this.openModal({ generics });
  }

  delete(batch: IGeneric) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.ShowDeleteAlert(batch.name, batch.keyId);
      }
    });
  }

  ShowDeleteAlert(name: string, id: number) {
    this.genericsService.remove1(name, id).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Genérico', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Genérico',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
