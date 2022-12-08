import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';
import { AssetsForStudyRoutingModule } from './assets-for-study-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AssetsForStudyRoutingModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
  ],
})
export class AssetsForStudyModule {}
