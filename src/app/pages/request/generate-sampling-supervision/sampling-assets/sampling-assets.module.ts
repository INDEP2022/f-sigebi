import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedComponentGssModule } from '../shared-component-gss/shared-component-gss.module';
import { SamplingAssetsFormComponent } from './sampling-assets-form/sampling-assets-form.component';
import { SamplingAssetsRoutingModule } from './sampling-assets-routing.module';
import { SelectInputComponent } from './select-input/select-input.component';

@NgModule({
  declarations: [SamplingAssetsFormComponent, SelectInputComponent],
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
