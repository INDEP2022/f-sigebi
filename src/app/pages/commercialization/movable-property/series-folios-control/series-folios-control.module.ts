import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SeriesEventModalComponent } from './series-event-modal/series-event-modal.component';
import { SeriesFoliosControlModalComponent } from './series-folios-control-modal/series-folios-control-modal.component';
import { SeriesFoliosControlRoutingModule } from './series-folios-control-routing.module';
import { SeriesFoliosControlComponent } from './series-folios-control/series-folios-control.component';
import { SeriesFoliosSeparateModalComponent } from './series-foliseparate-modal/series-folioseparate-modal.component';

@NgModule({
  declarations: [
    SeriesFoliosControlComponent,
    SeriesFoliosControlModalComponent,
    SeriesFoliosSeparateModalComponent,
    SeriesEventModalComponent,
  ],
  imports: [
    CommonModule,
    SeriesFoliosControlRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    FormLoaderComponent,
  ],
})
export class SeriesFoliosControlModule {}
