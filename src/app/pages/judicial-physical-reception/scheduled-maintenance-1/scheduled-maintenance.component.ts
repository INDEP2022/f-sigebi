import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ACTAS_BY_GOOD_COLUMNS } from './../scheduled-maintenance/interfaces/columns';

import { ScheduledMaintenance } from '../scheduled-maintenance/scheduled-maintenance';

@Component({
  selector: 'app-scheduled-maintenance',
  templateUrl: './scheduled-maintenance.component.html',
  styleUrls: ['scheduled-maintenance.scss'],
})
export class ScheduledMaintenanceComponent
  extends ScheduledMaintenance
  implements OnInit
{
  selecteds: IProceedingDeliveryReception[];
  constructor(
    protected override fb: FormBuilder,
    protected override modalService: BsModalService,
    protected override delegationService: DelegationService,
    protected override service: ProceedingsDeliveryReceptionService,
    protected override detailService: ProceedingsDetailDeliveryReceptionService,
    protected override userService: UsersService
  ) {
    super(
      fb,
      modalService,
      delegationService,
      service,
      detailService,
      userService
    );
    this.settings1 = { ...this.settings1, selectMode: 'multi' };
    console.log(this.settings1);
  }

  deleteProgramations() {
    this.service.deleteMasive(this.selecteds).subscribe(results => {
      this.getProceedingReception();
    });
  }

  rowsSelected(event: { selected: IProceedingDeliveryReception[] }) {
    console.log(event);
    this.selecteds = event.selected;
  }

  openModalActas() {
    this.openModalSelect(
      {
        title: 'Actas por Bien',
        columnsType: { ...ACTAS_BY_GOOD_COLUMNS },
        service: this.service,
        dataObservableFn: this.service.getAll2,
        searchFilter: { field: 'numberProceedings', operator: SearchFilter.EQ },
      },
      null
    );
  }

  // selectArea(actaData: IDepartment, self: ScheduledMaintenanceComponent) {
  //   const delegation = actaData.numDelegation as IDelegation;
  //   const subdelegation = areaData.numSubDelegation as ISubdelegation;
  //   self.formControls.departamentDestinyNumber.setValue(areaData.id);
  //   self.formControls.destinationArea.setValue(areaData.description);
  //   self.formControls.delegationNumber.setValue(delegation.id);
  //   self.formControls.delegationName.setValue(delegation.description);
  //   self.formControls.subDelegationNumber.setValue(subdelegation.id);
  //   self.formControls.subDelegationName.setValue(subdelegation.description);
  //   self.getPublicMinistries({ page: 1, text: '' });
  //   self.getUsers({ page: 1, text: '' });
  // }
  fillElementsToExport() {}
}

const EXAMPLE_DATA = [
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
];
