import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrPgrSubjectsRegisterRoutingModule } from './dr-pgr-subjects-register-routing.module';
import { DrPgrSubjectsRegisterComponent } from './dr-pgr-subjects-register/dr-pgr-subjects-register.component';

@NgModule({
  declarations: [DrPgrSubjectsRegisterComponent],
  imports: [CommonModule, DrPgrSubjectsRegisterRoutingModule, SharedModule],
})
export class DrPgrSubjectsRegisterModule {}
