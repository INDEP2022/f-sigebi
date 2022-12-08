import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubjectsRegisterRoutingModule } from './subjects-register-routing.module';
import { SubjectsRegisterComponent } from './subjects-register/subjects-register.component';

@NgModule({
  declarations: [SubjectsRegisterComponent],
  imports: [CommonModule, SubjectsRegisterRoutingModule, SharedModule],
})
export class SubjectsRegisterModule {}
