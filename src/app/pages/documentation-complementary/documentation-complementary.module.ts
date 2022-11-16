import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssociateExpedientComponent } from './components/associate-expedient/associate-expedient.component';
import { DocumentEstateComponent } from './components/document-estate/document-estate.component';
import { DocumentExpedientComponent } from './components/document-expedient/document-expedient.component';
import { DocumentRequestComponent } from './components/document-request/document-request.component';
import { EstatesInventoryComponent } from './components/estates-inventory/estates-inventory.component';
import { PhotosGoodComponent } from './components/photos-good/photos-good.component';
import { RegisterDocumentationComponent } from './components/register-documentation/register-documentation.component';
import { RequestExpedientComponent } from './components/request-expedient/request-expedient.component';
import { DocumentationComplementaryFormComponent } from './documentation-complementary-form/documentation-complementary-form.component';
import { DocumentationComplementaryRegisterFormComponent } from './documentation-complementary-register-form/documentation-complementary-register-form.component';
import { DocumentationComplementaryRoutingModule } from './documentation-complementary-routing.module';
import { ExpedientListComponent } from './expedient-list/expedient-list.component';

@NgModule({
  declarations: [
    DocumentationComplementaryFormComponent,
    DocumentationComplementaryRegisterFormComponent,
    ExpedientListComponent,
    DocumentRequestComponent,
    DocumentExpedientComponent,
    EstatesInventoryComponent,
    AssociateExpedientComponent,
    RegisterDocumentationComponent,
    RequestExpedientComponent,
    DocumentEstateComponent,
    PhotosGoodComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DocumentationComplementaryRoutingModule,
    ModalModule.forRoot(),
    TabsModule,
  ],
})
export class DocumentationComplementaryModule {}
