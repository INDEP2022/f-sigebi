import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SatClassificationFormComponent } from './sat-classification-form/sat-classification-form.component';
import { SatClassificationListComponent } from './sat-classification-list/sat-classification-list.component';
import { SatClassificationRoutingModule } from './sat-classification-routing.module';

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
