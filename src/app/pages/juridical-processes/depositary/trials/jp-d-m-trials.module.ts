import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDMTrialsRoutingModule } from './jp-d-m-trials-routing.module';
import { JpDTCTrialsComponent } from './jp-d-t-c-trials/jp-d-t-c-trials.component';
import { JpDTCTrialsSetComponent } from './jp-d-t-c-trials-set/jp-d-t-c-trials-set.component';
import { JpDTCLawyersSetComponent } from './jp-d-t-c-lawyers-set/jp-d-t-c-lawyers-set.component';
import { JpDTCExpensesSetComponent } from './jp-d-t-c-expenses-set/jp-d-t-c-expenses-set.component';

@NgModule({
  declarations: [JpDTCTrialsComponent, JpDTCTrialsSetComponent, JpDTCLawyersSetComponent, JpDTCExpensesSetComponent],
  imports: [CommonModule, JpDMTrialsRoutingModule, SharedModule, TabsModule],
})
export class JpDMTrialsModule {}
