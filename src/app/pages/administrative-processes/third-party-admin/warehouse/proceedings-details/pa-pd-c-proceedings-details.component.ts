import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { BehaviorSubject } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pa-pd-c-proceedings-details',
  templateUrl: './pa-pd-c-proceedings-details.component.html',
  styles: [
  ]
})
export class PaPdCProceedingsDetailsComponent extends BasePage implements OnInit {

  edit: boolean = false;
  title: string = 'Detalle de Acta';
  config:any=null;
  idActa:string=null;

  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
    
  }

  ngOnInit(): void {
    if(this.config !== null){
      this.idActa=`${this.config.letter}${this.config.number}`
    }
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  close() {
    this.modalRef.hide();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

}
