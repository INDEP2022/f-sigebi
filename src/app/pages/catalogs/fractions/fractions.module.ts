import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { FractionsFormComponent } from './fractions-form/fractions-form.component';
import { FractionsListComponent } from './fractions-list/fractions-list.component';
import { FractionsRoutingModule } from './fractions-routing.module';

@NgModule({
  declarations: [FractionsListComponent, FractionsFormComponent],

  imports: [
    CommonModule,
    FractionsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class FractionsModule {}
