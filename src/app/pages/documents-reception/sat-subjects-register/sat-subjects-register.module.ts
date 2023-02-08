import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { SatSubjectsRegisterRoutingModule } from './sat-subjects-register-routing.module';
import { SatSubjectsRegisterComponent } from './sat-subjects-register/sat-subjects-register.component';

@NgModule({
  declarations: [SatSubjectsRegisterComponent],
  imports: [CommonModule, SatSubjectsRegisterRoutingModule, SharedModule],
})
export class SatSubjectsRegisterModule {}
