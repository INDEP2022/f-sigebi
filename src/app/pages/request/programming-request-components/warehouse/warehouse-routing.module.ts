import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WarehouseShowComponent } from "./warehouse-show/warehouse-show.component";

const routes: Routes = [
    {
        path:'',
        component: WarehouseShowComponent
    },

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class WarehouseRoutingModule {}