import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IServiceCat } from 'src/app/core/models/catalogs/service-cat.model';
import { ServiceCatService } from 'src/app/core/services/catalogs/service-cat.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatServicesFormComponent } from '../cat-services-form/cat-services-form.component';
import { SERVICES_COLUMS } from './cat-service-columns';

@Component({
  selector: 'app-cat-services-list',
  templateUrl: './cat-services-list.component.html',
  styles: [],
})
export class CatServicesListComponent extends BasePage implements OnInit {
  paragraphs: IServiceCat[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private catserviceService: ServiceCatService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SERVICES_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.catserviceService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
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
      }
    });
  }
}
