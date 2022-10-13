import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pa-pdm-db-c-deserted-batch',
  templateUrl: './pa-pdm-db-c-deserted-batch.component.html',
  styles: [
  ]
})
export class PaPdmDbCDesertedBatchComponent extends BasePage implements OnInit {

  settings = {
    ...TABLE_SETTINGS,
    actions: false
  };

  data:any[]=[];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

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
