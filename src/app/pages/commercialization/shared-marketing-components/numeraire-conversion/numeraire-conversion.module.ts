import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { NumeraireConversionAllotmentsComponent } from './numeraire-conversion-allotments/numeraire-conversion-allotments.component';
import { NumeraireConversionAuctionsComponent } from './numeraire-conversion-auctions/numeraire-conversion-auctions.component';
import { NumeraireConversionErrorComponent } from './numeraire-conversion-error/numeraire-conversion-error.component';
import { NumeraireConversionRoutingModule } from './numeraire-conversion-routing.module';

@NgModule({
  declarations: [
    NumeraireConversionAuctionsComponent,
    NumeraireConversionAllotmentsComponent,
    NumeraireConversionErrorComponent,
  ],
  imports: [
    CommonModule,
    NumeraireConversionRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
  exports: [
    NumeraireConversionAuctionsComponent,
    NumeraireConversionAllotmentsComponent,
    NumeraireConversionErrorComponent,
  ],
})
export class NumeraireConversionModule {}
