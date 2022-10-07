import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumeraireConversionTabsRoutingModule } from './numeraire-conversion-tabs-routing.module';
import { NumeraireConversionTabsComponent } from './numeraire-conversion-tabs/numeraire-conversion-tabs.component';


@NgModule({
  declarations: [
    NumeraireConversionTabsComponent
  ],
  imports: [
    CommonModule,
    NumeraireConversionTabsRoutingModule
  ]
})
export class NumeraireConversionTabsModule { }
