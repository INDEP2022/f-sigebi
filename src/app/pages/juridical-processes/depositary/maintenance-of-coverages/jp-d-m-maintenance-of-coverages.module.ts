import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { CustomSelectComponent } from 'src/app/@standalone/shared-forms/custom-select/custom-select.component';
import { JpDMMaintenanceOfCoveragesRoutingModule } from './jp-d-m-maintenance-of-coverages-routing.module';
import { JpDMcCMaintenanceOfCoveragesComponent } from './jp-d-mc-c-maintenance-of-coverages/jp-d-mc-c-maintenance-of-coverages.component';
import { ReservedModalComponent } from './reserved-modal/reserved-modal.component';
import { ScanningFoilComponent } from './scanning-foil/scanning-foil.component';
import { SendMailModalComponent } from './send-mail-modal/send-mail-modal.component';
import { SendingOfEMailsComponent } from './sending-of-e-mails/sending-of-e-mails.component';
@NgModule({
  declarations: [
    JpDMcCMaintenanceOfCoveragesComponent,
    ScanningFoilComponent,
    SendingOfEMailsComponent,
    ReservedModalComponent,
    SendMailModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    JpDMMaintenanceOfCoveragesRoutingModule,
    CustomSelectComponent,
    TooltipModule,
    FormLoaderComponent,
  ],
})
export class JpDMMaintenanceOfCoveragesModule {}
