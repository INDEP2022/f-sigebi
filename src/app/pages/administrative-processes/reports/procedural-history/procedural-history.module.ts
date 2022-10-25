import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProceduralHistoryRoutingModule } from './procedural-history-routing.module';
import { ProceduralHistoryComponent } from './procedural-history/procedural-history.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProceduralHistoryComponent
  ],
  imports: [
    CommonModule,
    ProceduralHistoryRoutingModule,
    SharedModule,
  ]
})
export class ProceduralHistoryModule { }
