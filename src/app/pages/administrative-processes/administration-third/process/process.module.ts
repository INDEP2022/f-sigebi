import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProcessFormComponent } from './process-form/process-form.component';
import { ProcessRoutingModule } from './process-routing.module';
import { ProcessComponent } from './process/process.component';

@NgModule({
  declarations: [ProcessComponent, ProcessFormComponent],
  imports: [CommonModule, ProcessRoutingModule, SharedModule],
})
export class ProcessModule {}
