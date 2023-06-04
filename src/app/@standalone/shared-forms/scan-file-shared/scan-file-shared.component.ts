import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormLoaderComponent } from "../../form-loader/form-loader.component";
import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: 'app-scan-file-shared',
    standalone: true,
    imports: [CommonModule, SharedModule, FormLoaderComponent],
    templateUrl: './scan-file-shared.component.html'
})

export class ScanFileSharedComponent implements OnInit {
    
    @Input() form: FormGroup
    @Input() folioEscaneo: string = 'folioEscaneo'
    
    ngOnInit(): void {
        
    }

    prepareForm(){
        
    }

    replicateFolio(){

    }

    generateFolio(){
        console.log('Funciona')
        this.form.get(this.folioEscaneo).setValue('666')
        console.log(this.form.get(this.folioEscaneo).value)
        this.form.updateValueAndValidity();
    }

    onChangeFolio(){
    
    }
}