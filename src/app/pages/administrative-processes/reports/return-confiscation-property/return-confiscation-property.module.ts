import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReturnConfiscationPropertyRoutingModule } from './return-confiscation-property-routing.module';
import { ReturnConfiscationPropertyComponent } from './return-confiscation-property/return-confiscation-property.component';

@NgModule({
  declarations: [ReturnConfiscationPropertyComponent],
  imports: [
    CommonModule,
    ReturnConfiscationPropertyRoutingModule,
    SharedModule,
  ],
})
export class ReturnConfiscationPropertyModule {}
