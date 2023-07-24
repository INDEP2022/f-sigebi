import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITypeService } from 'src/app/core/models/catalogs/typeservices.model';
import { TypeServicesService } from 'src/app/core/services/catalogs/typeservices.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeServicesFormComponent } from '../type-services-form/type-services-form.component';
import { TYPESERVICES_COLUMS } from './type-services-columns';

@Component({
  selector: 'app-type-services-list',
  templateUrl: './type-services-list.component.html',
  styles: [],
})
export class TypeServicesListComponent extends BasePage implements OnInit {
  paragraphs: ITypeService[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private typeServicesService: TypeServicesService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPESERVICES_COLUMS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    (this.loading = true),
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
                  searchFilter = SearchFilter.EQ;
                  break;
                case 'type':
                  searchFilter = SearchFilter.ILIKE;
                  break;
                case 'concept':
                  searchFilter = SearchFilter.ILIKE;
                  break;
                case 'version':
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
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
        /*
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;*/
      },
      error: error => (this.loading = false),
    });
  }

  openForm(typeService?: ITypeService) {
    let config: ModalOptions = {
      initialState: {
        typeService,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeServicesFormComponent, config);
  }

  delete(typeService: ITypeService) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(typeService.id);
      }
    });
  }

  remove(id: number) {
    this.typeServicesService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Tipo Servicio', 'Borrado Correctamente'),
          this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Tipo Servicio',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
