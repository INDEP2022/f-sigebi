import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnConfiscationPropertyRoutingModule } from './return-confiscation-property-routing.module';
import { ReturnConfiscationPropertyComponent } from './return-confiscation-property/return-confiscation-property.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ReturnConfiscationPropertyComponent
  ],
  imports: [
    CommonModule,
    ReturnConfiscationPropertyRoutingModule,
    SharedModule,
  ]
})
export class ReturnConfiscationPropertyModule { }
