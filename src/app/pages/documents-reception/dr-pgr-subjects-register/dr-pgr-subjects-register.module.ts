import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrPgrSubjectsRegisterRoutingModule } from './dr-pgr-subjects-register-routing.module';
import { DrPgrSubjectsRegisterComponent } from './dr-pgr-subjects-register/dr-pgr-subjects-register.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DrPgrSubjectsRegisterComponent],
  imports: [CommonModule, DrPgrSubjectsRegisterRoutingModule, SharedModule],
})
export class DrPgrSubjectsRegisterModule {}
