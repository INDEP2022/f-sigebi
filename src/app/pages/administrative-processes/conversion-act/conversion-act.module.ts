import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversionActRoutingModule } from './conversion-act-routing.module';
import { ConversionActComponent } from './conversion-act/conversion-act.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConversionActDetailComponent } from './conversion-act-detail/conversion-act-detail.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';


@NgModule({
  declarations: [
    ConversionActComponent,
    ConversionActDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    ConversionActRoutingModule
  ]
})
export class ConversionActModule { }
