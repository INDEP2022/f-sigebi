import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { CCMMModelsRoutingModule } from './c-c-m-m-models-routing.module';
//Components
import { CCMfCModelsFormComponent } from './models-form/c-c-mf-c-models-form.component';
import { CCMlCModelsListComponent } from './models-list/c-c-ml-c-models-list.component';

@NgModule({
  declarations: [CCMlCModelsListComponent, CCMfCModelsFormComponent],
  imports: [
    CommonModule,
    CCMMModelsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class CCMMModelsModule {}
