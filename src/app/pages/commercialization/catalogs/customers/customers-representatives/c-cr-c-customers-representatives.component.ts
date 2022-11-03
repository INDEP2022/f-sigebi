import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';
import { data } from './data';

@Component({
  selector: 'app-c-cr-c-customers-representatives',
  templateUrl: './c-cr-c-customers-representatives.component.html',
  styles: [
  ]
})
export class CCrCCustomersRepresentativesComponent extends BasePage implements OnInit {

  edit: boolean = false;
  title: string = 'Representantes';

  data: any[] = data;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  @Output() customRep = new EventEmitter<{}>();

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
  }

  close() {
    this.modalRef.hide();
  }

  /*confirm() {
    let data = {};
    this.customRep.emit(data);
    this.modalRef.hide();
  }*/

  settingsChange($event: any): void {
    this.settings = $event;
  }
}

