import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StationFormComponent } from '../station-form/station-form.component';
import { STATION_COLUMS } from './station-columns';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styles: [],
})
export class StationListComponent extends BasePage implements OnInit {
  paragraphs: IStation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private stationService: StationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATION_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.stationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        console.log(this.paragraphs);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(station?: IStation) {
    let config: ModalOptions = {
      initialState: {
        station,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StationFormComponent, config);
  }

  delete(station: IStation) {
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
