import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPCCatDocRequireModalComponent } from './c-p-c-cat-doc-require-modal/c-p-c-cat-doc-require-modal.component';
import { CPCCatDocRequireComponent } from './c-p-c-cat-doc-require/c-p-c-cat-doc-require.component';
import { CPMCatDocRequireRoutingModule } from './c-p-m-cat-doc-require-routing.module';

@NgModule({
  declarations: [CPCCatDocRequireComponent, CPCCatDocRequireModalComponent],
  imports: [
    CommonModule,
    CPMCatDocRequireRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCatDocRequireModule {}
