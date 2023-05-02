import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-customers-payments',
  templateUrl: './customers-payments.component.html',
  styles: [],
})
export class CustomersPaymentsComponent extends BasePage implements OnInit {
  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  amountV: number = 0.0;
  total: number = 10566395.52;

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {}

  add() {
    //this.openModal();
  }

  edit(data: any) {
    //console.log(data)
    //this.openModal({ edit: true, paragraph });
  }

  delete(data: any) {
    console.log(data);
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

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
