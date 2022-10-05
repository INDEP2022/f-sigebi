import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeductivesRoutingModule } from './deductives-routing.module';
import { DeductivesListComponent } from './deductives-list/deductives-list.component';
import { DeductiveFormComponent } from './deductive-form/deductive-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
