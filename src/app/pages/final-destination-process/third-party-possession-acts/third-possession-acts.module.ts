import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentFormModalComponent } from './document-form-modal/document-form-modal/document-form-modal.component';
import { ThirdPossessionActsComponent } from './third-party-possession-acts/third-possession-acts.component';
import { ThirdPossessionActsRoutingModule } from './third-possession-acts-routing.module';

@NgModule({
  declarations: [ThirdPossessionActsComponent, DocumentFormModalComponent],
  imports: [
    CommonModule,
    ThirdPossessionActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class ThirdPossessionActsModule {}
