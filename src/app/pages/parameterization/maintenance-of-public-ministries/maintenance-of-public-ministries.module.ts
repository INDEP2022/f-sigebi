import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CitiesSharedComponent } from 'src/app/@standalone/shared-forms/cities-shared/cities-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceListComponent } from './maintenance-list/maintenance-list.component';
import { MaintenanceOfPublicMinistriesRoutingModule } from './maintenance-of-public-ministries-routing.module';
import { MaintenanceOfPublicMinistriesComponent } from './maintenance-of-public-ministries/maintenance-of-public-ministries.component';

@NgModule({
  declarations: [
    MaintenanceOfPublicMinistriesComponent,
    MaintenanceListComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceOfPublicMinistriesRoutingModule,
    SharedModule,
    CitiesSharedComponent,
    DelegationSharedComponent,
  ],
})
export class MaintenanceOfPublicMinistriesModule {}
