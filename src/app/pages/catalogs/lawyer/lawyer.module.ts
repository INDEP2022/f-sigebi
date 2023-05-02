import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { UppercaseInputDirective } from '../../../shared/directives/uppercase-input.directive';
import { LawyerDetailComponent } from './lawyer-detail/lawyer-detail.component';
import { LawyerListComponent } from './lawyer-list/lawyer-list.component';
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
