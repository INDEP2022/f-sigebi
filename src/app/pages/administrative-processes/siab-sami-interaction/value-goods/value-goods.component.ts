import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS, COLUMNS2 } from './columns';

@Component({
  selector: 'app-value-goods',
  templateUrl: './value-goods.component.html',
  styles: [],
})
export class ValueGoodsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  settings2 = { ...this.settings, actions: false };
  data2: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
    this.settings2 = {
      ...this.settings2,
      actions: false,
      columns: { ...COLUMNS2 },
    };
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null],
    });
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

  delete2(data: any) {
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

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }
}
