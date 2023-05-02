import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//@Standalone Components
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
//Routing
import { BankMovementsTypesRoutingModule } from './bank-movements-types-routing.module';
//Components
import { BankMovementsFormComponent } from './bank-movements-form/bank-movements-form.component';
import { BankMovementsTypesComponent } from './bank-movements-types/bank-movements-types.component';

@NgModule({
  declarations: [BankMovementsTypesComponent, BankMovementsFormComponent],
  imports: [
    CommonModule,
    BankMovementsTypesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    ReactiveFormsModule,
    BanksSharedComponent,
  ],
})
export class BankMovementsTypesModule {}
