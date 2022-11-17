import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { AssetsFilterComponent } from './assets-filter/assets-filter.component';
import { AssetsTabComponent } from './assets-tab/assets-tab.component';
import { DeductivesComponent } from './deductives/deductives.component';
import { SamplingDetailComponent } from './sampling-detail/sampling-detail.component';

@NgModule({
  declarations: [
    AssetsFilterComponent,
    SamplingDetailComponent,
    AssetsTabComponent,
    DeductivesComponent,
  ],
  imports: [
    CommonModule,
    ModalModule.forChild(),
    TabsModule,
    SharedModule,
    NgScrollbarModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    AssetsFilterComponent,
    SamplingDetailComponent,
    AssetsTabComponent,
    DeductivesComponent,
  ],
})
export class SharedComponentGssModule {}
