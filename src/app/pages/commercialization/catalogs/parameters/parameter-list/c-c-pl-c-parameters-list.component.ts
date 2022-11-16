import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { CCPfCParameterFormComponent } from '../parameter-form/c-c-pf-c-parameter-form.component';
//Provisional Data
import { data } from './data';

@Component({
  selector: 'app-c-c-pl-c-parameters-list',
  templateUrl: './c-c-pl-c-parameters-list.component.html',
  styles: [],
})
export class CCPlCParametersListComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  parametersD = data;

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
        add: false,
        edit: true,
        delete: true,
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data.load(this.parametersD);
  }

  openModal(context?: Partial<CCPfCParameterFormComponent>) {
    const modalRef = this.modalService.show(CCPfCParameterFormComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) console.log(next); //this.getCities();
    });
  }

  add() {
    this.openModal();
  }

  openForm(parameter: any) {
    this.openModal({ edit: true, parameter });
  }

  delete(parameter: any) {
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

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
