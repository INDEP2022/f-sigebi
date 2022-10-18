import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnTypeRoutingModule } from './turn-type-routing.module';
import { TurnTypeComponent } from './turn-type/turn-type.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TurnTypeComponent
  ],
  imports: [
    CommonModule,
    TurnTypeRoutingModule,
    SharedModule
  ]
})
export class TurnTypeModule { }
