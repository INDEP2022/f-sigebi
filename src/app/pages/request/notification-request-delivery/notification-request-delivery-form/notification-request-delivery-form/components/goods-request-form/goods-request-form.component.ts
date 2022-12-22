import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS_REQUEST_COLUMNS } from '../../documents.columns';
import { ViewDocumentsFormComponent } from '../view-documents-form/view-documents-form.component';

@Component({
  selector: 'app-goods-request-form',
  templateUrl: './goods-request-form.component.html',
  styles: [],
})
export class GoodsRequestFormComponent extends BasePage implements OnInit {
  goodsRequests: any[] = [];

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();

    this.settings = {
      ...this.settings,
      columns: GOODS_REQUEST_COLUMNS,
      actions: false,
      selectMode: 'multi',
    };
  }

  ngOnInit(): void {}

  viewDocuments() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const uploadDocuments = this.modalService.show(
      ViewDocumentsFormComponent,
      config
    );
  }
}
