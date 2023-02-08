import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../../shared/shared.module';
import { ExchangeTypesDetailComponent } from './exchange-types-detail/exchange-types-detail.component';
import { ExchangeTypesRoutingModule } from './exchange-types-routing.module';
import { ExchangeTypesComponent } from './exchange-types/exchange-types.component';

@NgModule({
  declarations: [ExchangeTypesComponent, ExchangeTypesDetailComponent],
  imports: [
    CommonModule,
    ExchangeTypesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class ExchangeTypesModule {}
