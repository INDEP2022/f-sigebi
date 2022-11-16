import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssociateFileButtonComponent } from './associate-file/associate-file-button/associate-file-button.component';
import { AssociateFileComponent } from './associate-file/associate-file.component';
import { NewFileModalComponent } from './associate-file/new-file-modal/new-file-modal.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { RegisterDocumentationFormComponent } from './register-documentation-form/register-documentation-form.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RequestInformationSimilarGoodsComponent } from './request-information-similar-goods/request-information-similar-goods.component';
import { RequestInformationComponent } from './request-information/request-information.component';
import { SearchInventoryGoodsComponent } from './search-inventory-goods/search-inventory-goods.component';
import { SearchRequestsComponent } from './search-requests/search-requests.component';
import { AddGoodsButtonComponent } from './select-goods/add-goods-button/add-goods-button.component';
import { ReserveGoodModalComponent } from './select-goods/reserve-good-modal/reserve-good-modal.component';
import { SelectGoodsComponent } from './select-goods/select-goods.component';
import { ViewFileButtonComponent } from './select-goods/view-file-button/view-file-button.component';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';
import { GuidelinesRevisionComponent } from './guidelines/guidelines-revision/guidelines-revision.component';
import { GuidelinesObservationsComponent } from './guidelines/guidelines-observations/guidelines-observations.component';
import { GuidelinesRevisionViewComponent } from './guidelines/guidelines-revision-view/guidelines-revision-view.component';

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
    RegisterDocumentationFormComponent,
    GoodsListComponent,
    GuidelinesComponent,
    RequestInformationSimilarGoodsComponent,
    GuidelinesRevisionComponent,
    GuidelinesObservationsComponent,
    GuidelinesRevisionViewComponent,
  ],
  imports: [
    CommonModule,
    ModalModule.forChild(),
    TabsModule,
    SharedModule,
    NgScrollbarModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    RequestFormComponent,
    UsersSelectedToTurnComponent,
    RequestInformationComponent,
    AssociateFileComponent,
    SelectGoodsComponent,
    RegisterDocumentationFormComponent,
    GoodsListComponent,
    GuidelinesComponent,
    RequestInformationSimilarGoodsComponent,
  ],
})
export class SharedRequestModule {}
