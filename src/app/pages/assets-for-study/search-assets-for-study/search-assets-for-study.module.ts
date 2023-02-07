import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../shared/shared.module';
import { SharedRequestModule } from '../../request/shared-request/shared-request.module';
import { AfsSharedComponentsModule } from '../afs-shared-components/afs-shared-components.module';
import { AssetsFilterComponent } from './assets-filter/assets-filter.component';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { SearchAssetsForStudyRoutingModule } from './search-assets-for-study-routing.module';
import { SearchAssetsComponent } from './search-assets/search-assets.component';

@NgModule({
  declarations: [
    SearchAssetsComponent,
    AssetsFilterComponent,
    AssetsListComponent,
  ],
  imports: [
    CommonModule,
    SearchAssetsForStudyRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedRequestModule,
    TabsModule,
    AfsSharedComponentsModule,
  ],
  exports: [AssetsListComponent],
})
export class SearchAssetsForStudyModule {}
