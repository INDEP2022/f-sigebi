import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../shared/shared.module';
import { SharedRequestModule } from '../../request/shared-request/shared-request.module';
import { AssetsAssignedComponent } from './assets-assigned/assets-assigned.component';
import { ListAssetsComponent } from './list-assets/list-assets.component';
import { TextInputComponent } from './text-input/text-input.component';

@NgModule({
  declarations: [
    AssetsAssignedComponent,
    TextInputComponent,
    ListAssetsComponent,
  ],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedRequestModule,
    TabsModule,
  ],
  exports: [AssetsAssignedComponent, TextInputComponent, ListAssetsComponent],
})
export class AfsSharedComponentsModule {}
