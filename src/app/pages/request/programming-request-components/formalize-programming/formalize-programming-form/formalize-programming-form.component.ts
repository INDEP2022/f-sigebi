import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocumentsListComponent } from '../../execute-reception/documents-list/documents-list.component';
import { RECEIPT_COLUMNS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/minute-columns';
import { TRANSPORTABLE_GOODS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/transportable-goods-columns';
import { MINUTES_COLUMNS } from '../columns/minutes-columns';
import { InformationRecordComponent } from '../information-record/information-record.component';
import { minutes, tranGoods } from './formalize-programmig.data';

@Component({
  selector: 'app-formalize-programming-form',
  templateUrl: './formalize-programming-form.component.html',
  styles: [],
})
export class FormalizeProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  settingsMinutes = {
    ...this.settings,
    columns: MINUTES_COLUMNS,
    edit: { editButtonContent: '<i class="fa fa-book text-warning mx-2"></i>' },
    actions: { columnTitle: 'Generar / cerrar acta', position: 'right' },
  };
  settingsReceipt = {
    ...this.settings,
    actions: false,
    columns: RECEIPT_COLUMNS_FORMALIZE,
  };
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settingsTranGoods = {
    ...this.settings,
    actions: false,
    columns: TRANSPORTABLE_GOODS_FORMALIZE,
    selectMode: 'multi',
  };
  minutes = minutes;
  receipts: any[] = [];
  tranGoods = tranGoods;

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {}

  uploadDocuments() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const uploadDocumentos = this.modalService.show(
      DocumentsListComponent,
      config
    );
  }

  generateMinute() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const generateMinute = this.modalService.show(
      InformationRecordComponent,
      config
    );
  }

  confirm() {}

  close() {}
}
