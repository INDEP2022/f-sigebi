import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { NormsDestinationComponent } from './norms-destination/norms-destination.component';
import { NormsFormComponent } from './norms-form/norms-form.component';
import { NormsListComponent } from './norms-list/norms-list.component';
import { NormsRoutingModule } from './norms-routing.module';

@NgModule({
  declarations: [
    NormsFormComponent,
    NormsListComponent,
    NormsDestinationComponent,
  ],
  imports: [
    CommonModule,
    NormsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class NormsModule {}
