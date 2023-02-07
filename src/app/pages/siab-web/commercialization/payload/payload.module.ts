import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { PayloadRoutingModule } from './payload-routing.module';
import { PayloadComponent } from './payload/payload.component';

@NgModule({
  declarations: [PayloadComponent],
  imports: [CommonModule, PayloadRoutingModule, SharedModule],
})
export class PayloadModule {}
