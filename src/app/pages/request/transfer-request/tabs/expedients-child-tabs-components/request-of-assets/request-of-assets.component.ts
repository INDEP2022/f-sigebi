import { Component, Input, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocRequestTabComponent } from '../doc-request-tab/doc-request-tab.component';
import { REQUEST_OF_ASSETS } from './request-of-assets.columns';

@Component({
  selector: 'app-request-of-assets',
  templateUrl: './request-of-assets.component.html',
  styles: [],
})
export class RequestOfAssetsComponent extends BasePage implements OnInit {
  @Input() typeDoc: string = '';
  paragraphs: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: REQUEST_OF_ASSETS,
    };

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {}

  getRequestsAssets(event: any) {}

  openNewDocument(request?: any) {
    let config: ModalOptions = {
      initialState: {
        request,
        type: this.typeDoc,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DocRequestTabComponent, config);
  }
}
