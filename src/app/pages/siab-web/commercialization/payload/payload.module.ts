import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { PayloadFormComponent } from './payload-form/payload-form.component';
import { PayloadRoutingModule } from './payload-routing.module';
import { PayloadComponent } from './payload/payload.component';

@NgModule({
  declarations: [PayloadComponent, PayloadFormComponent],
  imports: [CommonModule, PayloadRoutingModule, SharedModule],
})
export class PayloadModule {}
