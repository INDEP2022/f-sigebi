import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ActDestructionRoutingModule } from './act-destruction-routing.module';
import { ActDestructionComponent } from './act-destruction/act-destruction.component';

@NgModule({
  declarations: [ActDestructionComponent],
  imports: [CommonModule, ActDestructionRoutingModule, SharedModule],
})
export class ActDestructionModule {}
