import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components

//Provisional Data
import { data } from './data';

@Component({
  selector: 'app-sale-status',
  templateUrl: './sale-status.component.html',
  styles: [],
})
export class SaleStatusComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  saleStatusD = data;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  //Columns
  columns = COLUMNS;

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: true,
        edit: true,
        delete: true,
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      add: {
        addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        createButtonContent:
          '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmCreate: true,
      },
      mode: 'inline',
      hideSubHeader: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data.load(this.saleStatusD);
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
    /**
     * CALL SERVICE
     * */
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }

  onAddConfirm(event: any) {
    event.confirm.resolve();
    /**
     * CALL SERVICE
     * */
    this.onLoadToast('success', 'Elemento Creado', '');
  }

  onDeleteConfirm(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        event.confirm.resolve();
        /**
         * CALL SERVICE
         * */
        this.onLoadToast('success', 'Elemento Eliminado', '');
      }
    });
  }

  /*openModal(context?: Partial<SaleStatusFormComponent>) {
    const modalRef = this.modalService.show(SaleStatusFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) console.log(next)//this.getCities();
    });
  }*/

  /*add() {
    this.openModal();
  }*/

  /*openForm(saleStatus: any) {
    this.openModal({ edit:true, saleStatus });
  }*/

  /*delete(saleStatus: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }*/

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
