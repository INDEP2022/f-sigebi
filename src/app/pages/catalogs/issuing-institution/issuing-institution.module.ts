import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { InstitutionClasificationModalComponent } from './institution-clasification-modal/institution-clasification-modal.component';
import { IssuingInstitutionFormComponent } from './issuing-institution-form/issuing-institution-form.component';
import { IssuingInstitutionListComponent } from './issuing-institution-list/issuing-institution-list.component';
import { IssuingInstitutionRoutingModule } from './issuing-institution-routing.module';

@NgModule({
  declarations: [
    IssuingInstitutionFormComponent,
    IssuingInstitutionListComponent,
    InstitutionClasificationModalComponent,
  ],
  imports: [
    CommonModule,
    IssuingInstitutionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class IssuingInstitutionModule {}
