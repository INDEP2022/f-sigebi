import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecsRoutingModule } from './specs-routing.module';
import { SpecsComponent } from './specs/specs.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SpecsComponent
  ],
  imports: [
    CommonModule,
    SpecsRoutingModule,
    SharedModule
  ]
})
export class SpecsModule { }
