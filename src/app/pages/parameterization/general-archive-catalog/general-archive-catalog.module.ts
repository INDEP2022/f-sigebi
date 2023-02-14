import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { BatteryModalComponent } from './battery-modal/battery-modal.component';
import { GeneralArchiveCatalogRoutingModule } from './general-archive-catalog-routing.module';
import { GeneralArchiveCatalogComponent } from './general-archive-catalog/general-archive-catalog.component';
import { LockersModalComponent } from './lockers-modal/lockers-modal.component';
import { SaveValuesModalComponent } from './save-values-modal/save-values-modal.component';
import { ShelvesModalComponent } from './shelves-modal/shelves-modal.component';

@NgModule({
  declarations: [
    GeneralArchiveCatalogComponent,
    BatteryModalComponent,
    ShelvesModalComponent,
    LockersModalComponent,
    SaveValuesModalComponent,
  ],
  imports: [
    CommonModule,
    GeneralArchiveCatalogRoutingModule,
    SharedModule,
    UsersSharedComponent,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class GeneralArchiveCatalogModule {}
