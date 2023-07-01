/** BASE IMPORT */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
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
    private activateRoute: ActivatedRoute,
    private router: Router,
    public fileUpdateService: JuridicalFileUpdateService,
    private changeDetectorRef: ChangeDetectorRef,
    private docDataService: DocumentsReceptionDataService
  ) {
    super();
  }
  wheelNumber: string | null = null;
  previousRoute: string | null = null;
  ngOnInit(): void {
    this.previousRoute =
      this.activateRoute.snapshot.queryParams?.['previousRoute'] || null;
    this.wheelNumber =
      this.activateRoute.snapshot.queryParams?.['wheelNumber'] || null;
    console.log(this.previousRoute, 'previa ruta');
  }

  returnToFlyers() {
    this.docDataService.flyersRegistrationParams = {
      pGestOk: 0,
      pNoTramite: null,
      pNoVolante: this.wheelNumber as any,
      noTransferente: null,
      pSatTipoExp: null,
      pIndicadorSat: null,
    };

    this.router.navigate(['/pages/documents-reception/flyers-registration'], {
      queryParams: {
        pGestOk: 0,
        pNoTramite: null,
        pNoVolante: this.wheelNumber,
        noTransferente: null,
        pSatTipoExp: null,
        pIndicadorSat: null,
      },
    });
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
  }

  selectData(data: INotification) {
    this.selectedRow = data;
    this.changeDetectorRef.detectChanges();
  }
}
