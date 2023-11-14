import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsEditComponent } from './reports-edit/reports-edit.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [ReportsEditComponent],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
})
export class ReportsModule {}
