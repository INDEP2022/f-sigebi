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
import { CCBmtMBankMovementsTypesRoutingModule } from './c-c-bmt-m-bank-movements-types-routing.module';
//Components
import { CCBmfCBankMovementsFormComponent } from './bank-movements-form/c-c-bmf-c-bank-movements-form.component';
import { CCBmtCBankMovementsTypesComponent } from './bank-movements-types/c-c-bmt-c-bank-movements-types.component';

@NgModule({
  declarations: [
    CCBmtCBankMovementsTypesComponent,
    CCBmfCBankMovementsFormComponent,
  ],
  imports: [
    CommonModule,
    CCBmtMBankMovementsTypesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    ReactiveFormsModule,
    BanksSharedComponent,
  ],
})
export class CCBmtMBankMovementsTypesModule {}
