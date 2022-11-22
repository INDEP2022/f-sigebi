import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { CCEtfCEventTypesFornComponent } from '../event-types-form/c-c-etf-c-event-types-forn.component';
//Provisional Data
import { data } from './data';

@Component({
  selector: 'app-c-c-et-c-event-types',
  templateUrl: './c-c-et-c-event-types.component.html',
  styles: [],
})
export class CCEtCEventTypesComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  eventTypesD = data;

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
    this.data.load(this.eventTypesD);
  }

  openModal(context?: Partial<CCEtfCEventTypesFornComponent>) {
    const modalRef = this.modalService.show(CCEtfCEventTypesFornComponent, {
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

  openForm(eventType: any) {
    this.openModal({ edit: true, eventType });
  }

  delete(eventType: any) {
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
