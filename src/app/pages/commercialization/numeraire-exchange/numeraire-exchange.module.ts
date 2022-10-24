import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableSelectComponent } from './components/table-select/table-select.component';
import { NumeraireExchangeFormComponent } from './numeraire-exchange-form/numeraire-exchange-form.component';
import { NumeraireExchangeRoutingModule } from './numeraire-exchange-routing.module';

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
