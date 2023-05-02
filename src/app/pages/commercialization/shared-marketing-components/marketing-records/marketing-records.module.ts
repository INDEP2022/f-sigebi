import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
//Ngx Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Standalone Components
import { CitiesSharedComponent } from 'src/app/@standalone/shared-forms/cities-shared/cities-shared.component';
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
//Routing
import { MarketingRecordsRoutingModule } from './marketing-records-routing.module';
//Components
import { AddDocsComponent } from './add-docs/add-docs.component';
import { ChooseDocumentComponent } from './components/choose-document/choose-document.component';
import { CppControlComponent } from './components/cpp-control/cpp-control.component';
import { CppFormComponent } from './components/cpp-form/cpp-form.component';
import { MarketingRecordsComponent } from './marketing-records/marketing-records.component';

@NgModule({
  declarations: [
    MarketingRecordsComponent,
    AddDocsComponent,
    ChooseDocumentComponent,
    CppControlComponent,
    CppFormComponent,
  ],
  imports: [
    CommonModule,
    MarketingRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    UsersSharedComponent,
    CitiesSharedComponent,
    GoodsSharedComponent,
  ],
})
export class MarketingRecordsModule {}
