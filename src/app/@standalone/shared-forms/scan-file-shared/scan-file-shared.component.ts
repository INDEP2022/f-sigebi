import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormLoaderComponent } from "../../form-loader/form-loader.component";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-scan-file-shared',
    standalone: true,
    imports: [CommonModule, SharedModule, FormLoaderComponent],
    templateUrl: './scan-file-shared.component.html'
})

export class ScanFileSharedComponent implements OnInit {
    
    ngOnInit(): void {
        
    }
}