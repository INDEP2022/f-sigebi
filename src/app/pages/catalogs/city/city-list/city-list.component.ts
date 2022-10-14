import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ICity } from '../../../../core/models/catalogs/city.model';
import { CityService } from '../../../../core/services/catalogs/city.service';
import { CITY_COLUMNS } from './city-columns';
import { CityDetailComponent } from '../city-detail/city-detail.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styles: [],
})
export class CityListComponent extends BasePage implements OnInit {
  cities: ICity[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private cityService: CityService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = CITY_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCities());
  }

  getCities() {
    this.loading = true;
    this.cityService.getAll(this.params.getValue()).subscribe(
      response => {
        this.cities = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<CityDetailComponent>) {
    const modalRef = this.modalService.show(CityDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getCities();
    });
  }

  edit(city: ICity) {
    this.openModal({ edit: true, city });
  }

  delete(vault: ICity) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
