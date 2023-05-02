import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { InstitutionClassificationDetailComponent } from './institution-classification-detail/institution-classification-detail.component';
import { InstitutionClassificationListComponent } from './institution-classification-list/institution-classification-list.component';
import { InstitutionClassificationRoutingModule } from './institution-classification-routing.module';

@NgModule({
  declarations: [
    InstitutionClassificationListComponent,
    InstitutionClassificationDetailComponent,
  ],
  imports: [
    CommonModule,
    InstitutionClassificationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class InstitutionClassificationModule {}
