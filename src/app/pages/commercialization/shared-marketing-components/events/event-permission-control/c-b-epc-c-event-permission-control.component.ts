import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-c-b-epc-c-event-permission-control',
  templateUrl: './c-b-epc-c-event-permission-control.component.html',
  styles: [
  ]
})
export class CBEpcCEventPermissionControlComponent extends BasePage implements OnInit {

  form: FormGroup = new FormGroup({});
  settings = TABLE_SETTINGS;
  data:any[]=[
    {
      user: 'RONOFRE',
      username: 'Rodolfo No Fre',
      date: '19-Feb-2022'
    }
  ];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings.actions.edit = false;
  }

  ngOnInit(): void {
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());*/
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      user: [null, [Validators.required]],
      area: [null, [Validators.required]]
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

  settingsChange($event:any): void {
    this.settings=$event;
  }

}
