import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeductiveFormComponent } from './deductive-form/deductive-form.component';
import { DeductivesListComponent } from './deductives-list/deductives-list.component';
import { DeductivesRoutingModule } from './deductives-routing.module';

@NgModule({
  declarations: [DeductivesListComponent, DeductiveFormComponent],
  imports: [
    CommonModule,
    DeductivesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DeductivesModule {}
