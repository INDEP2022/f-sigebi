import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SelectModalTableSharedComponent } from 'src/app/@standalone/shared-forms/select-modal-table-shared/select-modal-table-shared.component';
import { NumeraireConversionAllotmentsComponent } from './numeraire-conversion-allotments/numeraire-conversion-allotments.component';
import { NumeraireConversionAuctionsComponent } from './numeraire-conversion-auctions/numeraire-conversion-auctions.component';
import { NumeraireDispersionModalComponent } from './numeraire-conversion-auctions/numeraire-dispersion/numeraire-dispersion-modal/numeraire-dispersion-modal.component';
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
    NumeraireDispersionModalComponent,
  ],
  imports: [
    CommonModule,
    NumeraireConversionRoutingModule,
    SharedModule,
    AccordionModule,
    TabsModule,
    SelectModalTableSharedComponent,
  ],
  exports: [
    NumeraireConversionAuctionsComponent,
    NumeraireConversionAllotmentsComponent,
    NumeraireConversionErrorComponent,
  ],
})
export class NumeraireConversionModule {}
