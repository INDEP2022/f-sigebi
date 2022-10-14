import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITypeOrderService } from 'src/app/core/models/catalogs/typeorderservices.model';
import { TypeOrderServicesService } from 'src/app/core/services/catalogs/typeorderservices.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeOrderServiceFormComponent } from '../type-order-service-form/type-order-service-form.component';
import { TYPEORDERSERVICE_COLUMS } from './type-order-service-columns';

@Component({
  selector: 'app-type-order-service-list',
  templateUrl: './type-order-service-list.component.html',
  styles: [],
})
export class TypeOrderServiceListComponent extends BasePage implements OnInit {
  paragraphs: ITypeOrderService[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private typeServicesService: TypeOrderServicesService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPEORDERSERVICE_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.typeServicesService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(typeOrderService?: ITypeOrderService) {
    let config: ModalOptions = {
      initialState: {
        typeOrderService,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeOrderServiceFormComponent, config);
  }

  delete(typeOrderService: ITypeOrderService) {
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
