import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CPMValuesModalComponent } from '../c-p-m-values-modal/c-p-m-values-modal.component';
import { VALUES_COLUMNS } from './c-p-m-values-columns';

@Component({
  selector: 'app-c-p-m-values',
  templateUrl: './c-p-m-values.component.html',
  styles: [
  ]
})
export class CPMValuesComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: VALUES_COLUMNS,
    };
  }

  ngOnInit(): void {
  }
  openValues(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => { },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CPMValuesModalComponent, config);
  }
}
