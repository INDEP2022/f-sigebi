import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillsGoodRoutingModule } from './bills-good-routing.module';
import { BillsGoodComponent } from './bills-good/bills-good.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BillsGoodComponent
  ],
  imports: [
    CommonModule,
    BillsGoodRoutingModule,
    SharedModule,
  ]
})
export class BillsGoodModule { }
