import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ScheduledMaintenance } from './scheduled-maintenance';

@Component({
  selector: 'app-scheduled-maintenance',
  templateUrl: './scheduled-maintenance.component.html',
  styles: [
    `
      ng2-smart-table {
        padding: 0px;
      }
      .list-group {
        overflow: auto;
        height: 45px;
      }
      .list-group .list-group-item:last-child {
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    `,
  ],
})
export class ScheduledMaintenanceComponent
  extends ScheduledMaintenance
  implements OnInit
{
  loadingExcel = false;
  flagDownload = false;
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
    this.tiposEvento = [
      {
        id: 'RECEPCIÓN FÍSICA',
        description: 'RECEPCIÓN FÍSICA',
      },
    ];
  }

  fillElementsToExport() {
    // const data = <IProceedingDeliveryReception[]>this.table.source.data;
    // this.elementToExport = data.map(item => {
    //   return {
    //     CVE_ACTA: item.keysProceedings,
    //     LOC_TRANSF:item.address,

    //   };
    // })
    this.loadingExcel = true;
    const params = new FilterParams(this.filterParams);
    params.limit = 10000;
    this.service.getExcel(params.getParams()).subscribe(x => {
      this.elementToExport = x;
      this.flagDownload = !this.flagDownload;
      console.log(x);
      this.loadingExcel = false;
    });
    console.log(this.table);
  }
}
