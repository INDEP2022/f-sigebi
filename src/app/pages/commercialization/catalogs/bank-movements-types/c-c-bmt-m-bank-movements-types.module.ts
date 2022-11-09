import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//@Standalone Components
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
//Routing
import { CCBmtMBankMovementsTypesRoutingModule } from './c-c-bmt-m-bank-movements-types-routing.module';
//Components
import { CCBmtCBankMovementsTypesComponent } from './bank-movements-types/c-c-bmt-c-bank-movements-types.component';


@NgModule({
  declarations: [
    CCBmtCBankMovementsTypesComponent
  ],
  imports: [
    CommonModule,
    CCBmtMBankMovementsTypesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BanksSharedComponent
  ]
})
export class CCBmtMBankMovementsTypesModule { }
