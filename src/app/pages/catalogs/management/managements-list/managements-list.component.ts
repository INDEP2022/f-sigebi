import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IManagement } from 'src/app/core/models/catalogs/management.model';
import { ManagementService } from 'src/app/core/services/catalogs/management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ManagementFormComponent } from '../management-form/management-form.component';
import { MANAGEMENT_COLUMNS } from './management-columns';

@Component({
  selector: 'app-managements-list',
  templateUrl: './managements-list.component.html',
  styles: [],
})
export class ManagementsListComponent extends BasePage implements OnInit {
  paragraphs: IManagement[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private managementService: ManagementService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = MANAGEMENT_COLUMNS;
    this.settings.actions.delete = true;
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
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.LIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getManagements();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getManagements());
  }

  getManagements() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.managementService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.data.load(response.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(management?: IManagement) {
    let config: ModalOptions = {
      initialState: {
        management,
        callback: (next: boolean) => {
          if (next) this.getManagements();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ManagementFormComponent, config);
  }

  delete(management: IManagement) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(management.id);
      }
    });
  }

  remove(id: number) {
    this.managementService.remove(id).subscribe(
      res => {
        this.alert('success', 'Gestión', 'Borrada Correctamente');
        this.getManagements();
      },
      err => {
        this.alert(
          'warning',
          'Gestión',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      }
    );
  }
}
