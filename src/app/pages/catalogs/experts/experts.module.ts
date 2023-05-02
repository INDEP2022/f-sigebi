import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpertListComponent } from './expert-list/expert-list.component';
import { ExpertFormComponent } from './experts-form/expert-form.component';
import { ExpertsRoutingModule } from './experts-routing.module';

@NgModule({
  declarations: [ExpertFormComponent, ExpertListComponent],
  imports: [
    CommonModule,
    ExpertsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ExpertsModule {}
