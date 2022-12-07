import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMMaintenanceDocumentValidatorsRoutingModule } from './c-p-m-maintenance-document-validators-routing.module';
import { CPMMaintenanceDocumentValidatorsComponent } from './c-p-m-maintenance-document-validators/c-p-m-maintenance-document-validators.component';

@NgModule({
  declarations: [CPMMaintenanceDocumentValidatorsComponent],
  imports: [
    CommonModule,
    CPMMaintenanceDocumentValidatorsRoutingModule,
    SharedModule,
  ],
})
export class CPMMaintenanceDocumentValidatorsModule {}
