import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AssociateFileComponent } from 'src/app/pages/request/transfer-request/tabs/associate-file/associate-file.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  ASSOCIATE_EXPEDIENT_COLUMNS,
  TRANSFER_REQUEST_COLUMNS,
} from '../../columns/associate-expedient-columns';

@Component({
  selector: 'app-associate-expedient',
  templateUrl: './associate-expedient.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class AssociateExpedientComponent extends BasePage implements OnInit {
  @Input() documentationSearchExpedientForm: FormGroup;
  authorities = new DefaultSelect();
  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  stations = new DefaultSelect();
  settingsTranGoods = {
    ...this.settings,
    actions: false,
    columns: TRANSFER_REQUEST_COLUMNS,
  };
  receipts: any[] = [];
  associateExpedients: any[] = [];

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  showSearchForm: boolean = false;
  constructor(private modalService: BsModalService) {
    super();

    this.settings = {
      ...this.settings,
      edit: {
        editButtonContent:
          '<i class="fa fa-plus-square" aria-hidden="true"></i>',
      },
      columns: ASSOCIATE_EXPEDIENT_COLUMNS,
    };

    this.associateExpedients = [
      {
        expedientNumber: 56456456,
        requestNumber: 35346456,
        subject: 'Asunto',
        dateRequest: '31-10-2022',
      },
    ];
  }

  ngOnInit(): void {}

  getAuthoritySelect(authority: ListParams) {}

  newExpedient() {
    const newExpedient = this.modalService.show(AssociateFileComponent, {
      class: 'gray modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getRegionalDelegationSelect(regionalDelegation: ListParams) {}
  getStateSelect(state: ListParams) {}
  getTransferentSelect(transferent: ListParams) {}
  getStationSelect(station: ListParams) {}
}
