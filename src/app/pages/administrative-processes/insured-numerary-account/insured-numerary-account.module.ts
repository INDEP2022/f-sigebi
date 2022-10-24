import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { InsuredNumeraryAccountRoutingModule } from './insured-numerary-account-routing.module';
import { InsuredNumeraryAccountComponent } from './insured-numerary-account/insured-numerary-account.component';

@NgModule({
  declarations: [InsuredNumeraryAccountComponent],
  imports: [CommonModule, InsuredNumeraryAccountRoutingModule, SharedModule],
})
export class InsuredNumeraryAccountModule {}
