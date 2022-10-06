/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
    selector: 'app-pj-ade-c-file-data-update',
    templateUrl: './pj-ade-c-file-data-update.component.html',
    styleUrls: ['./pj-ade-c-file-data-update.component.scss']
})
export class PJADEFileDataUpdateComponent extends BasePage implements OnInit, OnDestroy{
    
    constructor() {
        super();
    }
  
    ngOnInit(): void {
        this.loading = true;
    }
    
}

  