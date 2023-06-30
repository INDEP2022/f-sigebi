import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITypeOrderService } from 'src/app/core/models/catalogs/typeorderservices.model';
import { TypeOrderServicesService } from 'src/app/core/services/catalogs/typeorderservices.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeOrderServiceFormComponent } from '../type-order-service-form/type-order-service-form.component';
import { TYPEORDERSERVICE_COLUMS } from './type-order-service-columns';

@Component({
  selector: 'app-type-order-service-list',
  templateUrl: './type-order-service-list.component.html',
  styles: [],
})
export class TypeOrderServiceListComponent extends BasePage implements OnInit {
  paragraphs: ITypeOrderService[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private typeServicesService: TypeOrderServicesService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPEORDERSERVICE_COLUMS;
    this.settings.actions.delete = true;
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
              case 'id':
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
    this.typeServicesService.getAll(params).subscribe({
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

  openForm(typeOrderService?: ITypeOrderService) {
    let config: ModalOptions = {
      initialState: {
        typeOrderService,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeOrderServiceFormComponent, config);
  }

  delete(typeOrderService: ITypeOrderService) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(typeOrderService.id);
        //Ejecutar el servicio
      }
    });
  }

  remove(id?: number) {
    this.typeServicesService.remove(id).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Orden servicio', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Orden Servicio',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
