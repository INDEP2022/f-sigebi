import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGrantee } from 'src/app/core/models/catalogs/grantees.model';
import { GranteeService } from 'src/app/core/services/catalogs/grantees.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GranteesFormComponent } from '../grantees-form/grantees-form.component';
import { GRANTEES_COLUMNS } from './grantee-columns';

@Component({
  selector: 'app-grantees-list',
  templateUrl: './grantees-list.component.html',
  styles: [],
})
export class GranteesListComponent extends BasePage implements OnInit {
  paragraphs: IGrantee[] = [];
  totalItems = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();

  constructor(
    private granteeService: GranteeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GRANTEES_COLUMNS;
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
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'puesto':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'type':
                searchFilter = SearchFilter.EQ;
                break;
              case 'razonSocial':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'street':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noInside':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noExterior':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'col':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'nommun':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'nomedo':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'cp':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'usrStatus':
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
    this.granteeService.getAll(params).subscribe({
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

  openForm(grantee?: IGrantee): void {
    let config: ModalOptions = {
      initialState: {
        grantee,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GranteesFormComponent, config);
  }

  showDeleteAlert(grantee: IGrantee): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.delete(grantee.id);
      }
    });
  }

  delete(id: number) {
    this.granteeService.remove(id).subscribe({
      next: response => {
        this.alert('success', 'Donatorio', 'Borrado Correctamente'),
          this.getExample();
      },
      error: err => {
        this.alert(
          'warning',
          'Donatorio',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
