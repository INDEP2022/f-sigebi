import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpertsRoutingModule } from './experts-routing.module';
import { ExpertFormComponent } from './experts-form/expert-form.component';
import { ExpertListComponent } from './expert-list/expert-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
