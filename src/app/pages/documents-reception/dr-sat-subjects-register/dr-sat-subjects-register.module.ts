import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrSatSubjectsRegisterRoutingModule } from './dr-sat-subjects-register-routing.module';
import { DrSatSubjectsRegisterComponent } from './dr-sat-subjects-register/dr-sat-subjects-register.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DrSatSubjectsRegisterComponent],
  imports: [CommonModule, DrSatSubjectsRegisterRoutingModule, SharedModule],
})
export class DrSatSubjectsRegisterModule {}
