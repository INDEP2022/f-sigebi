import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { DrSatSubjectsRegisterRoutingModule } from './dr-sat-subjects-register-routing.module';
import { DrSatSubjectsRegisterComponent } from './dr-sat-subjects-register/dr-sat-subjects-register.component';

@NgModule({
  declarations: [DrSatSubjectsRegisterComponent],
  imports: [CommonModule, DrSatSubjectsRegisterRoutingModule, SharedModule],
})
export class DrSatSubjectsRegisterModule {}
