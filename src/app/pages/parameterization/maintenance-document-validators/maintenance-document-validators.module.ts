import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceDocumentValidatorsRoutingModule } from './maintenance-document-validators-routing.module';
import { MaintenanceDocumentValidatorsComponent } from './maintenance-document-validators/maintenance-document-validators.component';

@NgModule({
  declarations: [MaintenanceDocumentValidatorsComponent],
  imports: [
    CommonModule,
    MaintenanceDocumentValidatorsRoutingModule,
    SharedModule,
  ],
})
export class MaintenanceDocumentValidatorsModule {}
