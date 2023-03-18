import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { SatInterfaceService } from 'src/app/core/services/sat-interface/sat-interface.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { WorkMailboxService } from '../work-mailbox.service';
import { WORK_MAILBOX_COLUMNS } from './work-mailbox-columns';

@Component({
  selector: 'app-work-mailbox',
  templateUrl: './work-mailbox.component.html',
  styles: [
    `
      form-check .form-control {
        padding-top: -15px !important;
        padding-bottom: -15px !important;
        margin-top: -15px !important;
        margin-bottom: -15px !important;
      }
    `,
  ],
})
export class WorkMailboxComponent extends BasePage implements OnInit {
  dataTable: LocalDataSource = new LocalDataSource();
  data: any[] = [];
  dataSelect: any = {};
  satTypeProceedings = '';

  form = this.fb.group({
    verTramite: [null],
    actualizarBuzon: [null],
    pendientes: [null],
    observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
  });
  constructor(
    private fb: FormBuilder,
    private workService: WorkMailboxService,
    private satInterface: SatInterfaceService,
    private docsDataService: DocumentsReceptionDataService,
    private procedureManagementService: ProcedureManagementService,
    private router: Router
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = WORK_MAILBOX_COLUMNS;
  }

  ngOnInit(): void {
    this.workService.getView().subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.data) {
          resp.data.forEach((item: any) => {
            this.data.push({
              columname: item.royalProceesDate,
              columname2: item.naturalDays,
              columname3: item.processEntryDate,
              columname4: item.processStatus,
              columname5: item.flierNumber,
              columname6: item.userATurn,
              columname7: item.priority,
              idOffice: item.officeNumber,
            });
          });

          this.dataTable.load(this.data);
        }
      },
    });
  }

  selectEvent(e: any) {
    console.log(e);
    this.dataSelect = {};
    if (e.selected.length > 0) {
      this.dataSelect = e.data;
      let body = {
        officeKey: this.dataSelect.idOffice,
      };
      this.satInterface.getSatTransfer(body).subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp) {
            this.satTypeProceedings = resp.data[0].satTypeProceedings;
          }
        },
      });
    }
  }

  trabajar() {
    this.procedureManagementService
      .getManagamentArea({ 'filter.id': 'OP' })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.data[0].screenKey === 'FACTOFPREGRECDOCM') {
              this.docsDataService.flyersRegistrationParams = {
                pIndicadorSat: 0, // 0 / 1
                pGestOk: 1,
                pNoVolante: null, //  !== null
                pNoTramite: this.dataSelect.columname5,
                pSatTipoExp: this.satTypeProceedings, // != null
                noTransferente: null,
              };
              this.router.navigateByUrl(
                '/pages/documents-reception/flyers-registration'
              );
            }
          }
        },
      });
  }
}
