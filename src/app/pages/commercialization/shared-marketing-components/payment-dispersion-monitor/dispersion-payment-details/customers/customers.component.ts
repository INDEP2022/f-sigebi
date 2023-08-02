import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styles: [],
})
export class CustomersComponent extends BasePage implements OnInit {
  @Input() dataIncome: LocalDataSource;
  @Input() totalIncome: number = 0;
  @Input() id_tipo_disp: number = null;
  @Output() paramsChange = new EventEmitter();

  params = new BehaviorSubject<ListParams>(new ListParams());

  data = new LocalDataSource();

  total: number = 105666395.52;
  return: number = 0.0;
  penalty: number = 0.0;

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    console.log(this.dataIncome);
    console.log(this.totalIncome);

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      this.paramsMannage(params);
    });
  }

  paramsMannage(params: any) {
    this.paramsChange.emit(params);
  }

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

function OutPut(): (target: CustomersComponent, propertyKey: 'params') => void {
  throw new Error('Function not implemented.');
}
