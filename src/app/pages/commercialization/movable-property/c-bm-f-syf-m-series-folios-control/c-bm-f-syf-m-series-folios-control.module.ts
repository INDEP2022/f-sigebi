import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBmFSyfCSeriesFoliosControlComponent } from './c-bm-f-syf-c-series-folios-control/c-bm-f-syf-c-series-folios-control.component';
import { CBmFSyfMSeriesFoliosControlModalComponent } from './c-bm-f-syf-m-series-folios-control-modal/c-bm-f-syf-m-series-folios-control-modal.component';
import { CBmFSyfMSeriesFoliosControlRoutingModule } from './c-bm-f-syf-m-series-folios-control-routing.module';

@NgModule({
  declarations: [
    CBmFSyfCSeriesFoliosControlComponent,
    CBmFSyfMSeriesFoliosControlModalComponent,
  ],
  imports: [
    CommonModule,
    CBmFSyfMSeriesFoliosControlRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CBmFSyfMSeriesFoliosControlModule {}
