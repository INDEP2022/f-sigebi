import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedComponentGssModule } from '../shared-component-gss/shared-component-gss.module';
import { EditSampleGoodComponent } from './edit-sample-good/edit-sample-good.component';
import { SamplingAssetsFormComponent } from './sampling-assets-form/sampling-assets-form.component';
import { SamplingAssetsRoutingModule } from './sampling-assets-routing.module';
import { SelectInputComponent } from './select-input/select-input.component';
import { TurnModalComponent } from './turn-modal/turn-modal.component';

@NgModule({
  declarations: [
    SamplingAssetsFormComponent,
    SelectInputComponent,
    TurnModalComponent,
    EditSampleGoodComponent,
  ],
  imports: [
    CommonModule,
    SamplingAssetsRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedComponentGssModule,
    TabsModule,
  ],
})
export class SamplingAssetsModule {}
