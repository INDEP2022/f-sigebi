import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styles: [],
})
export class MaintenanceListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;
  dataMinPub: IListResponse<IMinpub> = {} as IListResponse<IMinpub>;
  filter = new FilterParams();

  constructor(
    private modalRef: BsModalRef,
    private ministerService: MinPubService,
    private expedientSer: ExpedientService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = true;
    this.searchFilter = { field: 'description', operator: SearchFilter.ILIKE };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMinPub());
  }

  getMinPub() {
    this.loading = true;
    this.ministerService
      .getAllWithFilters(this.params.getValue().getParams())
      .subscribe({
        next: response => {
          this.dataMinPub = response;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          this.onLoadToast('error', err.error.message, '');
        },
      });
  }

  formDataMin(data: IMinpub) {
    this.modalRef.content.callback(true, data);
    this.modalRef.hide();
  }
  deleteMin(min: IMinpub) {
    this.filter.removeAllFilters();
    this.filter.addFilter('mpName', min.description, SearchFilter.EQ);
    this.filter.limit = 1;
    this.expedientSer.getAllFilter(this.filter.getParams()).subscribe({
      next: () => {
        this.onLoadToast(
          'error',
          'No puede eliminar un ministerio público que tenga relación con algún expediente',
          ''
        );
      },
      error: err => {
        if (err.status == 400) {
          this.alertQuestion(
            'warning',
            'Eliminar',
            'Desea eliminar este registro?'
          ).then(question => {
            if (question.isConfirmed) {
              this.ministerService.remove(min.id).subscribe({
                next: () => {
                  this.onLoadToast('success', 'Ha sido eliminado', '');
                  this.getMinPub();
                },
                error: err => {
                  console.log(err);

                  if (
                    err.status == 500 &&
                    err.error.message[0].includes('amparos')
                  ) {
                    this.onLoadToast(
                      'error',
                      'No puede eliminar un ministerio público que tenga relación con la tabla amparos',
                      ''
                    );
                  } else {
                    this.onLoadToast('error', err.error.message, '');
                  }
                },
              });
            }
          });
        }
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
