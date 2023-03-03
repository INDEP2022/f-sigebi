import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { CourtByCityService } from 'src/app/core/services/catalogs/court-by-city.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNSLIST } from '../court-maintenance/columns';

@Component({
  selector: 'app-court-list',
  templateUrl: './court-list.component.html',
  styles: [],
})
export class CourtListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataCourt: IListResponse<ICourt> = {} as IListResponse<ICourt>;

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private modalRef: BsModalRef,
    private courtService: CourtService,
    private courtCityServ: CourtByCityService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNSLIST },
    };
    this.dataCourt.count = 0;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCourts());
  }

  getCourts() {
    this.loading = true;
    this.courtService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.dataCourt = response;
        this.loading = false;
      },
      error: error => (
        this.onLoadToast('error', error.error.message, ''),
        (this.loading = false)
      ),
    });
  }

  formDataCourt(data: ICourt) {
    this.modalRef.content.callback(true, data);
    this.modalRef.hide();
  }
  deleteCourt(id: number) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().addFilter('court', id, SearchFilter.EQ);
    this.getCourtByCity(id);
  }

  getCourtByCity(id: number) {
    this.courtCityServ
      .getAllWithFilters(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          if (response.data.length > 0) {
            this.onLoadToast(
              'info',
              'Juzgado con ciudades',
              'Debe eliminar primero las ciudades asignadas de dicho juzgado'
            );
          } else {
            this.alertQuestion(
              'warning',
              'Eliminar',
              'Desea eliminar este registro?'
            ).then(question => {
              if (question.isConfirmed) {
                this.courtService.remove(id).subscribe({
                  next: () => (
                    this.onLoadToast('success', 'Eliminado correctamente', ''),
                    this.getCourts()
                  ),
                  error: err =>
                    this.onLoadToast('error', err.error.message, ''),
                });
              }
            });
          }
        },
        error: error => this.onLoadToast('error', error.error.message, ''),
      });
  }

  handleSuccess() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
