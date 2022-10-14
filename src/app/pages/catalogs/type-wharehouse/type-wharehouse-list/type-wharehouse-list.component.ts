import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeWharehouseFromComponent } from '../type-wharehouse-from/type-wharehouse-from.component';
import { TYPESWHAREHOUSE_COLUMS } from './type-wharehouse-columns';

@Component({
  selector: 'app-type-wharehouse-list',
  templateUrl: './type-wharehouse-list.component.html',
  styles: [],
})
export class TypeWharehouseListComponent extends BasePage implements OnInit {
  settings = TABLE_SETTINGS;
  paragraphs: ITypeWarehouse[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private typeWarehouseService: TypeWarehouseService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPESWHAREHOUSE_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.typeWarehouseService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(typeWarehouse?: ITypeWarehouse) {
    let config: ModalOptions = {
      initialState: {
        typeWarehouse,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeWharehouseFromComponent, config);
  }

  delete(typeWarehouse: ITypeWarehouse) {
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
