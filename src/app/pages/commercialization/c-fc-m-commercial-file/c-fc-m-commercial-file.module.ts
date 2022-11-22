import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CFcCCommercialFileComponent } from './c-fc-c-commercial-file/c-fc-c-commercial-file.component';
import { CFcMCommercialFileRoutingModule } from './c-fc-m-commercial-file-routing.module';

@NgModule({
  declarations: [CFcCCommercialFileComponent],
  imports: [CommonModule, CFcMCommercialFileRoutingModule, SharedModule],
})
export class CFcMCommercialFileModule {}
