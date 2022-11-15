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
import { DetailAssetsTabComponentComponent } from './detail-assets-tab-component/detail-assets-tab-component.component';
import { ExpedientsTabsComponent } from './expedients-tabs/expedients-tabs.component';
import { BtnRequestComponent } from './expedients-tabs/sub-tabs/btn-request/btn-request.component';
import { DocRequestTabComponent } from './expedients-tabs/sub-tabs/doc-request-tab/doc-request-tab.component';
import { SeeInformationComponent } from './expedients-tabs/sub-tabs/doc-request-tab/see-information/see-information.component';
import { ExpedientsRequestTabComponent } from './expedients-tabs/sub-tabs/expedients-request-tab/expedients-request-tab.component';
import { GoodDocTabComponent } from './expedients-tabs/sub-tabs/good-doc-tab/good-doc-tab.component';
import { NewDocumentComponent } from './expedients-tabs/sub-tabs/new-document/new-document.component';
import { RequestOfAssetsComponent } from './expedients-tabs/sub-tabs/request-of-assets/request-of-assets.component';
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
    ExpedientsTabsComponent,
    DocRequestTabComponent,
    SeeInformationComponent,
    GoodDocTabComponent,
    ExpedientsRequestTabComponent,
    RequestOfAssetsComponent,
    BtnRequestComponent,
    NewDocumentComponent,
    DetailAssetsTabComponentComponent,
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
    ExpedientsTabsComponent,
    DocRequestTabComponent,
    SeeInformationComponent,
    GoodDocTabComponent,
    ExpedientsRequestTabComponent,
    RequestOfAssetsComponent,
    BtnRequestComponent,
    NewDocumentComponent,
    DetailAssetsTabComponentComponent,
  ],
})
export class SharedRequestModule {}
