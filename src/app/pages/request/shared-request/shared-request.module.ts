import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssociateFileButtonComponent } from './associate-file/associate-file-button/associate-file-button.component';
import { AssociateFileComponent } from './associate-file/associate-file.component';
import { NewFileModalComponent } from './associate-file/new-file-modal/new-file-modal.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RequestInformationComponent } from './request-information/request-information.component';
import { SearchInventoryGoodsComponent } from './search-inventory-goods/search-inventory-goods.component';
import { SearchRequestsComponent } from './search-requests/search-requests.component';
import { AddGoodsButtonComponent } from './select-goods/add-goods-button/add-goods-button.component';
import { ReserveGoodModalComponent } from './select-goods/reserve-good-modal/reserve-good-modal.component';
import { SelectGoodsComponent } from './select-goods/select-goods.component';
import { ViewFileButtonComponent } from './select-goods/view-file-button/view-file-button.component';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';

@NgModule({
  declarations: [
    RequestFormComponent,
    UsersSelectedToTurnComponent,
    RequestInformationComponent,
    AssociateFileComponent,
    NewFileModalComponent,
    SearchRequestsComponent,
    AssociateFileComponent,
    AssociateFileButtonComponent,
    SearchInventoryGoodsComponent,
    SelectGoodsComponent,
    AddGoodsButtonComponent,
    ViewFileButtonComponent,
    ReserveGoodModalComponent,
  ],
  imports: [
    CommonModule,
    ModalModule.forChild(),
    TabsModule,
    SharedModule,
    NgScrollbarModule,
    CollapseModule.forRoot(),
  ],
  exports: [
    RequestFormComponent,
    UsersSelectedToTurnComponent,
    RequestInformationComponent,
    AssociateFileComponent,
    SelectGoodsComponent,
  ],
})
export class SharedRequestModule {}
