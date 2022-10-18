import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-pa-cs-c-modal-change',
  templateUrl: './pa-cs-c-modal-change.component.html',
  styles: [],
})
export class PaCsCModalChangeComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table

  data: any = [];
  columns: any;
  constructor(private bsModalRef: BsModalRef, private opcion: ModalOptions) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...this.columns },
    };
  }

  ngOnInit(): void {
    this.columns = this.opcion.initialState;
  }

  mostrar() {}

  return() {
    this.bsModalRef.hide();
  }
}
