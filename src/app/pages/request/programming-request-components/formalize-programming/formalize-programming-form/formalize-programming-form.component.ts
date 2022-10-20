import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocumentsListComponent } from '../../execute-reception/documents-list/documents-list.component';
import { RECEIPT_COLUMNS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/minute-columns';
import { TRANSPORTABLE_GOODS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/transportable-goods-columns';
import { MINUTES_COLUMNS } from '../columns/minutes-columns';
import { InformationRecordComponent } from '../information-record/information-record.component';

@Component({
  selector: 'app-formalize-programming-form',
  templateUrl: './formalize-programming-form.component.html',
  styles: [],
})
export class FormalizeProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  settingsMinutes = { ...TABLE_SETTINGS };
  settingsReceipt = { ...TABLE_SETTINGS, actions: false };
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settingsTranGoods = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };
  minutes: any[] = [];
  receipts: any[] = [];
  tranGoods: any[] = [];

  constructor(private modalService: BsModalService) {
    super();
    this.settingsMinutes.columns = MINUTES_COLUMNS;
    this.settingsReceipt.columns = RECEIPT_COLUMNS_FORMALIZE;
    this.settingsTranGoods.columns = TRANSPORTABLE_GOODS_FORMALIZE;
    this.settingsMinutes.actions.columnTitle = 'Generar / cerrar acta';

    this.settingsMinutes.edit.editButtonContent =
      '<i class="fa fa-book text-warning mx-2"></i>';
    this.minutes = [
      {
        idMinute: 1,
        statusMinute: 'Cerrado',
        observation: 'Ninguna',
      },
    ];

    this.tranGoods = [
      {
        gestionNumber: 442342,
        uniqueKey: 453534,
        record: 'Expediente',
        description: 'Descripción',
        descriptionSae: 'Descripción SAE',
        transerAmount: 'SAE',
        saeAmmount: 'SAE',
        transerUnit: 'SAE',
        unitMedidSae: 'SAE',
        stateTransference: 'estado fisico',
        stateSae: 'SAE',
        transferConStatus: 'Estado convrsación',
        convrsationConStatus: 'SAE',
      },
    ];
  }

  ngOnInit(): void {}

  uploadDocuments() {
    const uploadDocumentos = this.modalService.show(DocumentsListComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  generateMinute() {
    const generateMinute = this.modalService.show(InformationRecordComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  confirm() {}

  close() {}
}
