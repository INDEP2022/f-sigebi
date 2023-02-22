import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MasiveConversionPermissionsDeleteComponent } from '../masive-conversion-permissions-delete/masive-conversion-permissions-delete.component';
import {
  PERMISSIONSUSER_COLUMNS,
  PRIVILEGESUSER_COLUMNS,
} from './massive-conversion-permissions-columns';

@Component({
  selector: 'app-massive-conversion-permissions',
  templateUrl: './massive-conversion-permissions.component.html',
  styles: [],
})
export class MassiveConversionPermissionsComponent
  extends BasePage
  implements OnInit
{
  settings2 = { ...this.settings, actions: false };

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PERMISSIONSUSER_COLUMNS,
    };
    this.settings2.columns = PRIVILEGESUSER_COLUMNS;
  }

  ngOnInit(): void {}
  close() {
    this.modalRef.hide();
  }
  openPermissionsDelete(data: any) {
    // let config: ModalOptions = {
    //   initialState: {
    //     data,
    //     callback: (next: boolean) => { },
    //   },
    //   class: 'modal-xl modal-dialog-centered',
    //   ignoreBackdropClick: true,
    // };
    // this.modalService.show(MassiveConversionPermissionsComponent, config);
    const modalRef = this.modalService.show(
      MasiveConversionPermissionsDeleteComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }
}
