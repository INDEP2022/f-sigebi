import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IServiceCat } from 'src/app/core/models/catalogs/service-cat.model';
import { ServiceCatService } from 'src/app/core/services/catalogs/service-cat.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { CatServicesFormComponent } from '../cat-services-form/cat-services-form.component';
import { SERVICES_COLUMS } from './cat-service-columns';

@Component({
  selector: 'app-cat-services-list',
  templateUrl: './cat-services-list.component.html',
  styles: [],
})
export class CatServicesListComponent extends BasePage implements OnInit {
  attribGoodBad: LocalDataSource = new LocalDataSource();
  paragraphs: IServiceCat[] = [];
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private catserviceService: ServiceCatService,
    private modalService: BsModalService
  ) {
    super();
    //this.settings.columns = SERVICES_COLUMS;
    this.settings.actions.delete = true;
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
      columns: { ...SERVICES_COLUMS },
    };
  }

  ngOnInit(): void {
    this.attribGoodBad
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
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
    this.catserviceService.getAll(params).subscribe({
      next: response => {
        this.totalItems = response.count || 0;
        this.attribGoodBad.load(response.data);
        this.attribGoodBad.refresh();

        /*this.paragraphs = response.data;
        this.totalItems = response.count;*/
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(catservice?: IServiceCat) {
    let config: ModalOptions = {
      initialState: {
        catservice,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatServicesFormComponent, config);
  }

  delete(catservice: IServiceCat) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.deleteReg(catservice.code);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  deleteReg(id: string | number) {
    this.catserviceService.delete(id).subscribe({
      next: () => this.getExample(),
    });
  }
}
