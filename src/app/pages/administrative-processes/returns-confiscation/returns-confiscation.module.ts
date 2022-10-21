import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnsConfiscationRoutingModule } from './returns-confiscation-routing.module';
import { ReturnsConfiscationComponent } from './returns-confiscation/returns-confiscation.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ReturnsConfiscationComponent
  ],
  imports: [
    CommonModule,
    ReturnsConfiscationRoutingModule,
    SharedModule,
  ]
})
export class ReturnsConfiscationModule { }
