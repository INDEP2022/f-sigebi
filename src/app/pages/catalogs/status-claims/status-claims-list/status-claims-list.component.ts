import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IStatusClaims } from 'src/app/core/models/catalogs/status-claims.model';
import { StatusClaimsService } from 'src/app/core/services/catalogs/claim-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StatusClaimsFormComponent } from '../status-claims-form/status-claims-form.component';
import { STATUSCLAIMS_COLUMS } from './status-claims-columns';

@Component({
  selector: 'app-status-claims-list',
  templateUrl: './status-claims-list.component.html',
  styles: [],
})
export class StatusClaimsListComponent extends BasePage implements OnInit {
  paragraphs: IStatusClaims[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private statusClaimsService: StatusClaimsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATUSCLAIMS_COLUMS;
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
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'flag':
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
          this.getStatus();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStatus());
  }

  getStatus() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.statusClaimsService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(statusClaims?: IStatusClaims) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      statusClaims,
      callback: (next: boolean) => {
        if (next) this.getStatus();
      },
    };
    this.modalService.show(StatusClaimsFormComponent, modalConfig);
  }

  showDeleteAlert(statusClaims: IStatusClaims) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(statusClaims.id);
      }
    });
  }
  delete(id: number) {
    this.statusClaimsService.remove(id).subscribe({
      next: () => {
        this.getStatus(),
          this.alert('success', 'Estado siniestro', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Estado Siniestro',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
