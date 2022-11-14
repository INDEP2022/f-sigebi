import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CitiesSharedComponent } from 'src/app/@standalone/shared-forms/cities-shared/cities-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMMaintenanceOfPublicMinistriesRoutingModule } from './c-p-m-maintenance-of-public-ministries-routing.module';
import { CPMpmCMaintenanceOfPublicMinistriesComponent } from './c-p-mpm-c-maintenance-of-public-ministries/c-p-mpm-c-maintenance-of-public-ministries.component';

@NgModule({
  declarations: [CPMpmCMaintenanceOfPublicMinistriesComponent],
  imports: [
    CommonModule,
    CPMMaintenanceOfPublicMinistriesRoutingModule,
    SharedModule,
    CitiesSharedComponent,
    DelegationSharedComponent,
  ],
})
export class CPMMaintenanceOfPublicMinistriesModule {}
