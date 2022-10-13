import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { IUser, USER_COLUMNS } from '../../acept-programming/columns/users-columns';
import { DocumentsListComponent } from '../documents-list/documents-list.component';
import { TRANSPORTABLE_GOODS } from './transportable-goods-columns';

@Component({
  selector: 'app-execute-reception-form',
  templateUrl: './execute-reception-form.component.html',
  styles: [
  ]
})
export class ExecuteReceptionFormComponent implements OnInit {

  settings = {...TABLE_SETTINGS, actions: false};
  settingsTranGoods = {...TABLE_SETTINGS, actions: false};
  userData: IUser[] = [];
  //Cambiar a modelo//
  tranGoods: any[] = [];
  search: FormControl = new FormControl({});
  constructor(private modalService: BsModalService) { }
  ngOnInit(): void {
    this.settings.columns = USER_COLUMNS;
    this.settingsTranGoods.columns = TRANSPORTABLE_GOODS;
  }


  uploadDocuments(){
    const uploadDocumentos = this.modalService.show(DocumentsListComponent,{
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    })
  }
}
