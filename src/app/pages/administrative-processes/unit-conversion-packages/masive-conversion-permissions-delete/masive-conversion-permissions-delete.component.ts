import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { PRIVILEGESUSERDELETE_COLUMNS } from './masiv-conversion-permissions-delete';

@Component({
  selector: 'app-masive-conversion-permissions-delete',
  templateUrl: './masive-conversion-permissions-delete.component.html',
  styles: [],
})
export class MasiveConversionPermissionsDeleteComponent
  extends BasePage
  implements OnInit
{
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PRIVILEGESUSERDELETE_COLUMNS,
    };
  }

  ngOnInit(): void {}
  close() {
    this.modalRef.hide();
  }
}
