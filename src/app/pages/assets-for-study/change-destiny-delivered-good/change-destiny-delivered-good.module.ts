import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChangeDestinyDeliveredGoodRoutingModule } from './change-destiny-delivered-good-routing.module';
import { ChangeDestinyDeliveredGoodComponent } from './change-destiny-delivered-good/change-destiny-delivered-good.component';

@NgModule({
  declarations: [ChangeDestinyDeliveredGoodComponent],
  imports: [CommonModule, ChangeDestinyDeliveredGoodRoutingModule],
})
export class ChangeDestinyDeliveredGoodModule {}
