import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuredNumeraryAccountRoutingModule } from './insured-numerary-account-routing.module';
import { InsuredNumeraryAccountComponent } from './insured-numerary-account/insured-numerary-account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InsuredNumeraryAccountComponent
  ],
  imports: [
    CommonModule,
    InsuredNumeraryAccountRoutingModule,
    SharedModule,
  ]
})
export class InsuredNumeraryAccountModule { }
