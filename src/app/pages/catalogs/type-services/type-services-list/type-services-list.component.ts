import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITypeService } from 'src/app/core/models/catalogs/typeservices.model';
import { TypeServicesService } from 'src/app/core/services/catalogs/typeservices.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeServicesFormComponent } from '../type-services-form/type-services-form.component';
import { TYPESERVICES_COLUMS } from './type-services-columns';

@Component({
  selector: 'app-type-services-list',
  templateUrl: './type-services-list.component.html',
  styles: [],
})
export class TypeServicesListComponent extends BasePage implements OnInit {
  paragraphs: ITypeService[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private typeServicesService: TypeServicesService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPESERVICES_COLUMS;
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

  openForm(typeService?: ITypeService) {
    let config: ModalOptions = {
      initialState: {
        typeService,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeServicesFormComponent, config);
  }

  delete(typeService: ITypeService) {
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
