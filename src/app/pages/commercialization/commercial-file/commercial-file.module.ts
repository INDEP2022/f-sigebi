import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommercialFileRoutingModule } from './commercial-file-routing.module';
import { CommercialFileComponent } from './commercial-file/commercial-file.component';

@NgModule({
  declarations: [CommercialFileComponent],
  imports: [CommonModule, CommercialFileRoutingModule, SharedModule],
})
export class CommercialFileModule {}
