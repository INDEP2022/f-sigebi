import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ZonesRoutingModule } from './zones-routing.module';
import { ZonesComponent } from './zones/zones.component';

@NgModule({
  declarations: [ZonesComponent],
  imports: [CommonModule, ZonesRoutingModule, SharedModule],
})
export class ZonesModule {}
