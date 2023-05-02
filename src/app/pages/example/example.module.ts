import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExampleFormComponent } from './example-form/example-form.component';
import { ExampleRoutingModule } from './example-routing.module';
import { ExampleComponent } from './example/example.component';

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
