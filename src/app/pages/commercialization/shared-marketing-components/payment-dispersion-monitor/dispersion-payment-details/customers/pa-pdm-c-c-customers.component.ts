import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pa-pdm-c-c-customers',
  templateUrl: './pa-pdm-c-c-customers.component.html',
  styles: [
  ]
})
export class PaPdmCCCustomersComponent extends BasePage implements OnInit {

  settings = {
    ...TABLE_SETTINGS,
    actions: false
  };

  data:any[]=[];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  total: number= 105666395.52;
  return: number= 0.00;
  penalty: number= 0.00;

  constructor() {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
  }

  add() {
    //this.openModal();
  }

  edit(data:any) {
    //console.log(data)
    //this.openModal({ edit: true, paragraph });
  }

  delete(data:any) {
    console.log(data)
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

  settingsChange($event:any): void {
    this.settings=$event;
  }

}
