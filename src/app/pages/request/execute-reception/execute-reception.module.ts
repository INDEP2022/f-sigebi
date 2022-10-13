import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { SharedModule } from "src/app/shared/shared.module";
import { ExecuteReceptionFormComponent } from "./execute-reception-form/execute-reception-form.component";
import { ExecuteReceptionRoutingModule } from "./execute-reception-routing.module";
import { DocumentsListComponent} from './documents-list/documents-list.component';
import { DocumentsFormComponent } from './documents-form/documents-form.component';

@NgModule({
    declarations: [ExecuteReceptionFormComponent, DocumentsListComponent, DocumentsFormComponent],
    imports: [
        CommonModule,
        SharedModule,
        ExecuteReceptionRoutingModule,
        ModalModule.forChild()
    ],
})

export class ExecuteReceptionModule {}