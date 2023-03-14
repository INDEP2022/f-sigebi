import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { ICity } from '../../../../core/models/catalogs/city.model';
import { CityService } from '../../../../core/services/catalogs/city.service';
import { CityDetailComponent } from '../city-detail/city-detail.component';
import { CITY_COLUMNS } from './city-columns';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styles: [],
})
export class CityListComponent extends BasePage implements OnInit {
  city: ICity[] = [];
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
    this.cityService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.city = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(city?: ICity) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      city,
      callback: (next: boolean) => {
        if (next) this.getCities();
      },
    };
    this.modalService.show(CityDetailComponent, modalConfig);
  }

  showDeleteAlert(cities: ICity) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(cities.idCity);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.cityService.remove2(id).subscribe({
      next: () => this.getCities(),
    });
  }
}
