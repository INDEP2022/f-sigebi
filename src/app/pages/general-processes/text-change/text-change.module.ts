import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TextChangeFormComponent } from './components/text-change-form/text-change-form.component';
import { TextChangeRoutingModule } from './text-change-routing.module';
import { TextChangeComponent } from './text-change/text-change.component';

@NgModule({
  declarations: [TextChangeComponent],
  imports: [CommonModule, TextChangeRoutingModule, TextChangeFormComponent],
})
export class TextChangeModule {}
