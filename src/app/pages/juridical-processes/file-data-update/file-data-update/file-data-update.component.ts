/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { BsModalService } from 'ngx-bootstrap/modal';

/** SERVICE IMPORTS */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-file-data-update',
  templateUrl: './file-data-update.component.html',
  styleUrls: ['./file-data-update.component.scss'],
})
export class FileDataUpdateComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  returnToFlyers() {
    this.router.navigateByUrl('/pages/documents-reception/flyers-registration');
  }
}
