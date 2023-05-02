import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ThirdPossessionActsComponent } from './third-party-possession-acts/third-possession-acts.component';
import { ThirdPossessionActsRoutingModule } from './third-possession-acts-routing.module';

@NgModule({
  declarations: [ThirdPossessionActsComponent],
  imports: [
    CommonModule,
    ThirdPossessionActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class ThirdPossessionActsModule {}
