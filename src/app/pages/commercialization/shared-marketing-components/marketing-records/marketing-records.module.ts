import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MarketingRecordsComponent } from './marketing-records/marketing-records.component';

@NgModule({
  declarations: [MarketingRecordsComponent, AddDocsComponent],
  imports: [
    CommonModule,
    MarketingRecordsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    UsersSharedComponent,
    CitiesSharedComponent,
    GoodsSharedComponent,
  ],
})
export class MarketingRecordsModule {}
