import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultTasksRoutingModule } from './consult-tasks-routing.module';
import { ConsultTasksComponent } from './consult-tasks/consult-tasks.component';

@NgModule({
  declarations: [ConsultTasksComponent],
  imports: [CommonModule, ConsultTasksRoutingModule, SharedModule],
})
export class ConsultTasksModule {}
