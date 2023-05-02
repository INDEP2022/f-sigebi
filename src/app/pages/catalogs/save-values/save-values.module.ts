import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SaveValueFormComponent } from './save-value-form/save-value-form.component';
import { SaveValuesListComponent } from './save-values-list/save-values-list.component';
import { SaveValuesRoutingModule } from './save-values-routing.module';

@NgModule({
  declarations: [SaveValuesListComponent, SaveValueFormComponent],

  imports: [
    CommonModule,
    SaveValuesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class SaveValuesModule {}
