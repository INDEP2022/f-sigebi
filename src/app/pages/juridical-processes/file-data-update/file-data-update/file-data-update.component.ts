/** BASE IMPORT */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { BsModalService } from 'ngx-bootstrap/modal';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { INotification } from '../../../../core/models/ms-notification/notification.model';
import {
  JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS,
  JURIDICAL_FILE_UPDATE_SEARCH_FIELDS,
} from '../interfaces/columns';
import { IJuridicalFileDataUpdateForm } from '../interfaces/file-data-update-form';
import { JuridicalFileUpdateService } from '../services/juridical-file-update.service';

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
  searchMode: boolean = false;
  confirmSearch: boolean = false;
  formData: Partial<IJuridicalFileDataUpdateForm> = null;
  selectedRow: INotification;
  columnsType = { ...JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS };
  fieldsToSearch = [...JURIDICAL_FILE_UPDATE_SEARCH_FIELDS];
  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    public fileUpdateService: JuridicalFileUpdateService,
    private changeDetectorRef: ChangeDetectorRef,
    private docDataService: DocumentsReceptionDataService
  ) {
    super();
  }

  ngOnInit(): void {
    //
  }

  returnToFlyers() {
    this.docDataService.flyersRegistrationParams = {
      pGestOk: 0,
      pNoTramite: null,
      pNoVolante: null,
      noTransferente: null,
      pSatTipoExp: null,
      pIndicadorSat: null,
    };
    this.router.navigateByUrl('/pages/documents-reception/flyers-registration');
  }

  checkSearchMode(searchMode: boolean) {
    this.searchMode = searchMode;
    this.changeDetectorRef.detectChanges();
  }

  confirm(confirm: boolean) {
    this.confirmSearch = confirm;
    this.changeDetectorRef.detectChanges();
  }

  search(formData: Partial<IJuridicalFileDataUpdateForm>) {
    this.formData = formData;
    this.changeDetectorRef.detectChanges();
    console.log(formData);
  }

  selectData(data: INotification) {
    this.selectedRow = data;
    this.changeDetectorRef.detectChanges();
    console.log(data);
  }
}
