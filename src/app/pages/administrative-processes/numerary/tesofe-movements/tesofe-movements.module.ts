import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { TesofeMovementsRoutingModule } from './tesofe-movements-routing.module';
import { TesofeMovementsComponent } from './tesofe-movements/tesofe-movements.component';

@NgModule({
  declarations: [TesofeMovementsComponent],
  imports: [
    CommonModule,
    TesofeMovementsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class TesofeMovementsModule {}
