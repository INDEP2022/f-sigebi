import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS,COLUMNS2 } from './columns';

@Component({
  selector: 'app-pa-vg-c-value-goods',
  templateUrl: './pa-vg-c-value-goods.component.html',
  styles: [
  ]
})
export class PaVgCValueGoodsComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  settings = TABLE_SETTINGS;
  data:any[]=[];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  settings2 = JSON.parse(JSON.stringify(TABLE_SETTINGS));
  data2:any[]=[];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = false;
    this.settings2.columns = COLUMNS2;
    this.settings2.actions.delete = false;
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null]
    });
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

  delete2(data:any) {
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

  settingsChange2($event:any): void {
    this.settings2=$event;
  }

}
