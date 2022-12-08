import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { MassGoodsDeletionRoutingModule } from './mass-goods-deletion-routing.module';
import { MassGoodsDeletionComponent } from './mass-goods-deletion/mass-goods-deletion.component';

@NgModule({
  declarations: [MassGoodsDeletionComponent],
  imports: [CommonModule, MassGoodsDeletionRoutingModule, SharedModule],
})
export class MassGoodsDeletionModule {}
