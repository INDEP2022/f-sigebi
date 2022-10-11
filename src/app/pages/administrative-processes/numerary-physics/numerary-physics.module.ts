import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumeraryPhysicsRoutingModule } from './numerary-physics-routing.module';
import { NumeraryPhysicsComponent } from './numerary-physics/numerary-physics.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
