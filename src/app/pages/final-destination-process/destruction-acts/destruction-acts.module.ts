import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { DestructionActsRoutingModule } from './destruction-acts-routing.module';
import { DestructionActsComponent } from './destruction-acts/destruction-acts.component';
@NgModule({
  declarations: [DestructionActsComponent],
  imports: [
    CommonModule,
    DestructionActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class DestructionActsModule {}
