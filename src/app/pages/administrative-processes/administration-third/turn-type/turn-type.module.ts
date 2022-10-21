import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { TurnTypeRoutingModule } from './turn-type-routing.module';
import { TurnTypeComponent } from './turn-type/turn-type.component';

@NgModule({
  declarations: [TurnTypeComponent],
  imports: [CommonModule, TurnTypeRoutingModule, SharedModule],
})
export class TurnTypeModule {}
