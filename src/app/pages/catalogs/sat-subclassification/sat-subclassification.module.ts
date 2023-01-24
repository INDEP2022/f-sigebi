import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SatSubclassificationFormComponent } from './sat-subclassification-form/sat-subclassification-form.component';
import { SatSubclassificationListComponent } from './sat-subclassification-list/sat-subclassification-list.component';
import { SatSubclassificationRoutingModule } from './sat-subclassification-routing.module';

@NgModule({
  declarations: [
    SatSubclassificationListComponent,
    SatSubclassificationFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    SatSubclassificationRoutingModule,
  ],
})
export class SatSubclassificationModule {}
