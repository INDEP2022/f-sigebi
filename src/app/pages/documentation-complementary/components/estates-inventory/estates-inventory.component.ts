import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  ESTATE_EXPEDIENT_COLUMNS,
  ESTATE_EXPEDIENT_SELECT_COLUMNS,
} from '../../columns/estate-expedient-columns';
import { ExpedientListComponent } from '../../expedient-list/expedient-list.component';
import { RequestSiabFormComponent } from '../request-siab-form/request-siab-form.component';

@Component({
  selector: 'app-estates-inventory',
  templateUrl: './estates-inventory.component.html',
  styles: [],
})
export class EstatesInventoryComponent extends BasePage implements OnInit {
  @Input() documentationEstateForm: FormGroup;
  settingsEstate = {
    ...this.settings,
    edit: {
      editButtonContent:
        '<i class="bx bxs-file-plus text-success mx-2"></i> Agregar',
    },

    delete: {
      deleteButtonContent: '<i class="bx bx-show text-info mx-2"></i> Ver',
    },
  };
  settingsEstateSelect = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };

  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  broadStations = new DefaultSelect();
  authorities = new DefaultSelect();
  goodTypes = new DefaultSelect();

  estateData: any[] = [];
  estateSelectData: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();
    this.settingsEstate.actions.delete = true;
    this.settingsEstate.columns = ESTATE_EXPEDIENT_COLUMNS;
    this.settingsEstateSelect.columns = ESTATE_EXPEDIENT_SELECT_COLUMNS;

    this.estateData = [
      {
        origin: 'Inventarios',
        description: 'Mira telescopica',
        uniqueKey: '3423432',
        gestionNumber: 5015028,
        quantityTransference: 1,
        quantityTransaction: 0,
        quantityAvailable: 0,
        destiny: 'Ventas',
        expedientNumber: 45345,
      },
    ];
  }

  ngOnInit(): void {}

  showExpedient() {
    const showExpedient = this.modalService.show(ExpedientListComponent, {
      class: 'gray modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  searchSiab() {
    const searchsiab = this.modalService.show(RequestSiabFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getRegionalDelegationSelect(regionalDelegation: ListParams) {}
  getStateSelect(state: ListParams) {}
  getBroadStationSelect(broadStation: ListParams) {}
  getAuthoritySelect(authority: ListParams) {}
  getGoodTypeSelect(authority: ListParams) {}
}
