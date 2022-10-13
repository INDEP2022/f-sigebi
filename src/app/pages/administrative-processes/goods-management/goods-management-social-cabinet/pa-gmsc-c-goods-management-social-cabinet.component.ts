import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pa-gmsc-c-goods-management-social-cabinet',
  templateUrl: './pa-gmsc-c-goods-management-social-cabinet.component.html',
  styles: [
  ]
})
export class PaGmscCGoodsManagementSocialCabinetComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  settings = {
    ...TABLE_SETTINGS,
    actions: false
  };
  data:any[]=[];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null, [Validators.required]],
      excuse: [null, [Validators.required]],
      file: [null, [Validators.required]],
      //message: [null, [Validators.required]]
    });
  }

  showInfo(){
  }

  delete(data:any) {
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
