import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { ScanFileSharedComponent } from 'src/app/@standalone/shared-forms/scan-file-shared/scan-file-shared.component';
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
    FormLoaderComponent,
    ScanFileSharedComponent,
  ],
})
export class DestructionActsModule {}
