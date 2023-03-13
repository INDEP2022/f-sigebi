import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceDocumentValidatorsModalComponent } from './maintenance-document-validators-model/maintenance-document-validators-model.component';
import { MaintenanceDocumentValidatorsRoutingModule } from './maintenance-document-validators-routing.module';
import { MaintenanceDocumentValidatorsComponent } from './maintenance-document-validators/maintenance-document-validators.component';

@NgModule({
  declarations: [
    MaintenanceDocumentValidatorsComponent,
    MaintenanceDocumentValidatorsModalComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceDocumentValidatorsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class MaintenanceDocumentValidatorsModule {}
