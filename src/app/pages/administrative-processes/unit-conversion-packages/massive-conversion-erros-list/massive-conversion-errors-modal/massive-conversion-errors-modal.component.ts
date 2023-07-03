import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { ERRORCOLUMNS } from '../../massive-conversion/columns';

@Component({
  selector: 'app-massive-conversion-errors-modal',
  templateUrl: './massive-conversion-errors-modal.component.html',
  styleUrls: [],
})
export class MassiveConversionErrorsModalComponent
  extends BasePage
  implements OnInit
{
  errorData: any;

  data: any;
  totalItems: number = 30;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,

      actions: { add: false, delete: false, edit: false },
      columns: ERRORCOLUMNS,
    };
  }

  ngOnInit() {}
}
