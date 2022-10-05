import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LawyerListComponent } from './lawyer-list/lawyer-list.component';
import { LawyerDetailComponent } from './lawyer-detail/lawyer-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { UppercaseInputDirective } from '../../../shared/directives/uppercase-input.directive';
import { LawyerRoutingModule } from './lawyer-routing.module';

@NgModule({
  declarations: [
    LawyerListComponent,
    LawyerDetailComponent,
    UppercaseInputDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LawyerRoutingModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class LawyerModule {}
