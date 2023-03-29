import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultTasksRoutingModule } from './consult-tasks-routing.module';
import { ConsultTasksComponent } from './consult-tasks/consult-tasks.component';

@NgModule({
  declarations: [ConsultTasksComponent],
  imports: [
    CommonModule,
    ConsultTasksRoutingModule,
    SharedModule,
    AccordionModule,
  ],
})
export class ConsultTasksModule {}
