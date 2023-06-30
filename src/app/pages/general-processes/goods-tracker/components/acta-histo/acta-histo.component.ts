import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared';
import { ACTAS_COLUMNS } from './acta-columns';

@Component({
  selector: 'app-acta-histo',
  templateUrl: './acta-histo.component.html',
  styles: [],
})
export class ActaHistoComponent extends BasePage implements OnInit {
  histo: any[];

  constructor(
    private modalService: BsModalRef,
    private proceedingService: ProceedingsDeliveryReceptionService,
    private documentService: DocumentsService
  ) {
    super();
    this.settings.columns = ACTAS_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {}

  async showDocs(data: any) {
    const folio: any = await this.getFolio(data.cve_acta);

    console.log(folio);

    if (folio) {
      if (folio.universalFolio) {
        const folioFinal: any = await this.getFolioFinally(
          folio.universalFolio
        );

        if (folioFinal) {
          console.log(folioFinal);
        } else {
          this.alert('error', 'Error', 'No tiene documentos digitalizados');
        }
      } else {
        this.alert('error', 'Error', 'No tiene documentos digitalizados');
      }
    } else {
      this.alert('error', 'Error', 'No tiene documentos digitalizados');
    }
  }

  async getFolio(cve: string) {
    return new Promise<any>((resolve, reject) => {
      const filter = new FilterParams();
      filter.addFilter('keysProceedings', cve, SearchFilter.EQ);
      this.proceedingService.getAll(filter.getParams()).subscribe({
        next: resp => resolve(resp.data[0]),
        error: () => resolve(null),
      });
    });
  }

  async getFolioFinally(folio: string) {
    return new Promise<any>((resolve, reject) => {
      const filter = new FilterParams();
      filter.addFilter('universalFolio', folio, SearchFilter.EQ);
      this.documentService.getAll(filter.getParams()).subscribe({
        next: resp => resolve(resp.data[0]),
        error: () => resolve(null),
      });
    });
  }
}
