import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitutionClassificationRoutingModule } from './institution-classification-routing.module';
import { InstitutionClassificationListComponent } from './institution-classification-list/institution-classification-list.component';
import { InstitutionClassificationDetailComponent } from './institution-classification-detail/institution-classification-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
