import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SharedModule } from 'src/app/shared/shared.module';
import { NumeraireExchangeRoutingModule } from './numeraire-exchange-routing.module';
import { NumeraireExchangeFormComponent } from './numeraire-exchange-form/numeraire-exchange-form.component';
import { TableSelectComponent } from './components/table-select/table-select.component';

@NgModule({
  declarations: [NumeraireExchangeFormComponent, TableSelectComponent],
  imports: [
    CommonModule,
    NumeraireExchangeRoutingModule,
    ModalModule.forChild(),
    TabsModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    SharedModule,
  ],
})
export class NumeraireExchangeModule {}
