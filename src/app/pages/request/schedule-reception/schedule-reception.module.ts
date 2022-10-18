import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { SharedModule } from "src/app/shared/shared.module";
import { ScheduleReceptionFormComponent } from "./schedule-reception-form/schedule-reception-form.component";
import { ScheduleReceptionRoutingModule } from "./schedule-reception-routing.module";

@NgModule({
    declarations: [ScheduleReceptionFormComponent],
    imports: [
        CommonModule,
        SharedModule,
        ScheduleReceptionRoutingModule,
        ModalModule.forChild(),
    ]
})
export class ScheduleReceptionModule {}