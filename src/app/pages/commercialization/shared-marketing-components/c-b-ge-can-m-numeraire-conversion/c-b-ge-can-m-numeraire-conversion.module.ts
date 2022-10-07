import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CBGeCanMNumeraireConversionRoutingModule } from './c-b-ge-can-m-numeraire-conversion-routing.module';
import { CBGeCanCNumeraireConversionAuctionsComponent } from './c-b-ge-can-c-numeraire-conversion-auctions/c-b-ge-can-c-numeraire-conversion-auctions.component';
import { CBGeCanCNumeraireConversionAllotmentsComponent } from './c-b-ge-can-c-numeraire-conversion-allotments/c-b-ge-can-c-numeraire-conversion-allotments.component';
import { CBGeCanCNumeraireConversionErrorComponent } from './c-b-ge-can-c-numeraire-conversion-error/c-b-ge-can-c-numeraire-conversion-error.component';


@NgModule({
  declarations: [
    CBGeCanCNumeraireConversionAuctionsComponent,
    CBGeCanCNumeraireConversionAllotmentsComponent,
    CBGeCanCNumeraireConversionErrorComponent
  ],
  imports: [
    CommonModule,
    CBGeCanMNumeraireConversionRoutingModule,
    SharedModule,
    BsDatepickerModule    
  ],
  exports: [
    CBGeCanCNumeraireConversionAuctionsComponent,
    CBGeCanCNumeraireConversionAllotmentsComponent,
    CBGeCanCNumeraireConversionErrorComponent
  ]
})
export class CBGeCanMNumeraireConversionModule { }
