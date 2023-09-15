import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NumeraireConversionAllotmentsComponent } from './numeraire-conversion-allotments/numeraire-conversion-allotments.component';
import { NumeraireConversionAuctionsComponent } from './numeraire-conversion-auctions/numeraire-conversion-auctions.component';
import { NumeraireDispersionComponent } from './numeraire-conversion-auctions/numeraire-dispersion/numeraire-dispersion.component';
import { NumeraireExpensesComponent } from './numeraire-conversion-auctions/numeraire-expenses/numeraire-expenses.component';
import { NumeraireConversionErrorComponent } from './numeraire-conversion-error/numeraire-conversion-error.component';
import { NumeraireConversionRoutingModule } from './numeraire-conversion-routing.module';

@NgModule({
  declarations: [
    NumeraireConversionAuctionsComponent,
    NumeraireConversionAllotmentsComponent,
    NumeraireConversionErrorComponent,
    NumeraireExpensesComponent,
    NumeraireDispersionComponent,
  ],
  imports: [
    CommonModule,
    NumeraireConversionRoutingModule,
    SharedModule,
    BsDatepickerModule,
    AccordionModule,
    TabsModule,
  ],
  exports: [
    NumeraireConversionAuctionsComponent,
    NumeraireConversionAllotmentsComponent,
    NumeraireConversionErrorComponent,
  ],
})
export class NumeraireConversionModule {}
