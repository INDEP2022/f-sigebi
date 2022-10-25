import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBGeCanCNumeraireConversionAllotmentsComponent } from './c-b-ge-can-c-numeraire-conversion-allotments/c-b-ge-can-c-numeraire-conversion-allotments.component';
import { CBGeCanCNumeraireConversionAuctionsComponent } from './c-b-ge-can-c-numeraire-conversion-auctions/c-b-ge-can-c-numeraire-conversion-auctions.component';
import { CBGeCanCNumeraireConversionErrorComponent } from './c-b-ge-can-c-numeraire-conversion-error/c-b-ge-can-c-numeraire-conversion-error.component';
import { CBGeCanMNumeraireConversionRoutingModule } from './c-b-ge-can-m-numeraire-conversion-routing.module';

@NgModule({
  declarations: [
    CBGeCanCNumeraireConversionAuctionsComponent,
    CBGeCanCNumeraireConversionAllotmentsComponent,
    CBGeCanCNumeraireConversionErrorComponent,
  ],
  imports: [
    CommonModule,
    CBGeCanMNumeraireConversionRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
  exports: [
    CBGeCanCNumeraireConversionAuctionsComponent,
    CBGeCanCNumeraireConversionAllotmentsComponent,
    CBGeCanCNumeraireConversionErrorComponent,
  ],
})
export class CBGeCanMNumeraireConversionModule {}
