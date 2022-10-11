import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatSubclassificationRoutingModule } from './sat-subclassification-routing.module';
import { SatSubclassificationListComponent } from './sat-subclassification-list/sat-subclassification-list.component';
import { SatSubclassificationFormComponent } from './sat-subclassification-form/sat-subclassification-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
