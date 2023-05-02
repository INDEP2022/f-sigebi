import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';

import { JpDMMaintenanceOfCoveragesRoutingModule } from './jp-d-m-maintenance-of-coverages-routing.module';
import { JpDMcCMaintenanceOfCoveragesComponent } from './jp-d-mc-c-maintenance-of-coverages/jp-d-mc-c-maintenance-of-coverages.component';
import { ScanningFoilComponent } from './scanning-foil/scanning-foil.component';
import { SendingOfEMailsComponent } from './sending-of-e-mails/sending-of-e-mails.component';

@NgModule({
  declarations: [
    JpDMcCMaintenanceOfCoveragesComponent,
    ScanningFoilComponent,
    SendingOfEMailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    JpDMMaintenanceOfCoveragesRoutingModule,
  ],
})
export class JpDMMaintenanceOfCoveragesModule {}
