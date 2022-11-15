import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpMassGoodsDeletionRoutingModule } from './gp-mass-goods-deletion-routing.module';
import { GpMassGoodsDeletionComponent } from './gp-mass-goods-deletion/gp-mass-goods-deletion.component';

@NgModule({
  declarations: [GpMassGoodsDeletionComponent],
  imports: [CommonModule, GpMassGoodsDeletionRoutingModule, SharedModule],
})
export class GpMassGoodsDeletionModule {}
