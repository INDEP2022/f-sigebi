/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
    selector: 'app-pj-aen-c-notification-file-update',
    templateUrl: './pj-aen-c-notification-file-update.component.html',
    styleUrls: ['./pj-aen-c-notification-file-update.component.scss']
})
export class PJAENNotificationFileUpdateComponent extends BasePage implements OnInit, OnDestroy{
    
    constructor() {
        super();
    }
  
    ngOnInit(): void {
        this.loading = true;
    }
    
}

  