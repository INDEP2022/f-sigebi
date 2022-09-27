import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ExampleRoutingModule } from './example-routing.module';
import { ExampleComponent } from './example/example.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExampleFormComponent } from './example-form/example-form.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExampleComponent, ExampleFormComponent],
  imports: [
    CommonModule,
    ExampleRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ExampleModule {}
