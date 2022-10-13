import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { REQUEST_COLUMNS } from './request-columns';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styles: [
  ]
})
export class RequestListComponent extends BasePage implements OnInit {

  settings = TABLE_SETTINGS;
  paragraphs: [] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Output() refresh = new EventEmitter<true>();

  constructor() { 
    super();
    this.settings.columns = REQUEST_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
   
  }


  openForm(params?: ListParams){

  }

  delete(params?: ListParams){
    
  }

}
