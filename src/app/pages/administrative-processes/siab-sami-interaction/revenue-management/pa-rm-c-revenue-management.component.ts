import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS2, COLUMNS3 } from './columns';

@Component({
  selector: 'app-pa-rm-c-revenue-management',
  templateUrl: './pa-rm-c-revenue-management.component.html',
  styles: [],
})
export class PaRmCRevenueManagementComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  data2: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  settings3 = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  data3: any[] = [];
  totalItems3: number = 0;
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings2.columns = COLUMNS2;
    this.settings3.columns = COLUMNS3;
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    //this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      //option: [null, [Validators.required]]
    });
  }

  showInfo() {}

  delete2(data: any) {
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

  delete3(data: any) {
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

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }

  settingsChange3($event: any): void {
    this.settings3 = $event;
  }
}
