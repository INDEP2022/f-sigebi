import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { SeriesFoliosControlModalComponent } from './series-folios-control-modal/series-folios-control-modal.component';
import { SeriesFoliosControlRoutingModule } from './series-folios-control-routing.module';
import { SeriesFoliosControlComponent } from './series-folios-control/series-folios-control.component';

@NgModule({
  declarations: [
    SeriesFoliosControlComponent,
    SeriesFoliosControlModalComponent,
  ],
  imports: [
    CommonModule,
    SeriesFoliosControlRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class SeriesFoliosControlModule {}
