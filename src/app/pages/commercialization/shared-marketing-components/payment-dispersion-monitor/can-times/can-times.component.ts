import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
    selector: 'app-can-times',
    templateUrl: './can-times.component.html',
    styleUrls: []
})
export class CanTimesComponent extends BasePage implements OnInit{
    constructor(){
        super()
    }
    
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

}