import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatClassificationRoutingModule } from './sat-classification-routing.module';
import { SatClassificationListComponent } from './sat-classification-list/sat-classification-list.component';
import { SatClassificationFormComponent } from './sat-classification-form/sat-classification-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    SatClassificationListComponent,
    SatClassificationFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    SatClassificationRoutingModule,
  ],
})
export class SatClasificationModule {}
