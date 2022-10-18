import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PerformProgrammingFormComponent } from "./perform-programming-form/perform-programming-form.component";


const routes: Routes = [
    {
        path: '',
        component: PerformProgrammingFormComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class PerformProgrammingRoutingModule {}