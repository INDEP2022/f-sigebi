import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IRequestInTurnSelected } from 'src/app/core/models/catalogs/request-in-turn-selected.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { TURN_SELECTED_COLUMNS } from './request-in-turn-selected-columns';

@Component({
  selector: 'app-request-in-turn-selected',
  templateUrl: './request-in-turn-selected.component.html',
  styles: [
  ]
})
export class RequestInTurnSelectedComponent extends BasePage implements OnInit {
  requestForm: FormGroup;
  title:string = '¿DESEAS TURNAR LAS SOLICITUDES SELECCIONAS?';
  settings = TABLE_SETTINGS
  paragraphs: IRequestInTurnSelected[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams);
  totalItems: number = 0;
  requestInTurn: any;

  constructor(
    public modalRef: BsModalRef,
    public fb: FormBuilder
    ) { 
    super()
    this.settings.columns = TURN_SELECTED_COLUMNS;
    this.settings.actions = {
      columnTitle: 'Acciones',
      add: false,
      edit: false,
      delete: false,
    }
  }

  ngOnInit(): void {
    this.prepareForm();   
  }

  prepareForm(){
    this.requestForm = this.fb.group({
      typeUser: ['te'],
    });
  }

  confirm(){
    console.log(this.requestForm)
  }

  close(){
    this.modalRef.hide();
  }
}
