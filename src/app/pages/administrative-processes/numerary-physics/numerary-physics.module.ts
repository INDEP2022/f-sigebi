import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';
import { NumeraryPhysicsRoutingModule } from './numerary-physics-routing.module';
import { NumeraryPhysicsComponent } from './numerary-physics/numerary-physics.component';

@NgModule({
  declarations: [NumeraryPhysicsComponent],
  imports: [
    CommonModule,
    NumeraryPhysicsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class NumeraryPhysicsModule {}
