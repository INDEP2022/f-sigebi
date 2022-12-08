import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { ModelsRoutingModule } from './models-routing.module';
//Components
import { ModelsFormComponent } from './models-form/models-form.component';
import { ModelsListComponent } from './models-list/models-list.component';

@NgModule({
  declarations: [ModelsListComponent, ModelsFormComponent],
  imports: [
    CommonModule,
    ModelsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class ModelsModule {}
