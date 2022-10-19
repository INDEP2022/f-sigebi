import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IZoneGeographic } from 'src/app/core/models/catalogs/zone-geographic.model';
import { ZoneGeographicService } from 'src/app/core/services/catalogs/zone-geographic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ZoneGeographicFormComponent } from '../zone-geographic-form/zone-geographic-form.component';
import { ZONEGEOGRAPHIC_COLUMS } from './zone-geographic-columnc';

@Component({
  selector: 'app-zone-geographic-list',
  templateUrl: './zone-geographic-list.component.html',
  styles: [],
})
export class ZoneGeographicListComponent extends BasePage implements OnInit {
  paragraphs: IZoneGeographic[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private zoneGeographicService: ZoneGeographicService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = ZONEGEOGRAPHIC_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.zoneGeographicService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(zoneGeographic?: IZoneGeographic) {
    let config: ModalOptions = {
      initialState: {
        zoneGeographic,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ZoneGeographicFormComponent, config);
  }

  delete(zoneGeographic: IZoneGeographic) {
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
