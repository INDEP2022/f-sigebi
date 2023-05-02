import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFederative } from 'src/app/core/models/administrative-processes/siab-sami-interaction/federative.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { IComerLotsEG } from 'src/app/core/models/ms-parametercomer/parameter';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-responsibility-letters-report',
  templateUrl: './responsibility-letters-report.component.html',
  styles: [],
})
export class ResponsibilityLettersReportComponent
  extends BasePage
  implements OnInit
{
  goodList: IGood;
  dataGood: any;
  totalItems: number = 0;
  idEvent: number = 0;
  idGood: number = null;
  valid: boolean = false;
  idDelegation: number = null;
  description: string;
  idEntidad: number = null;
  selectedDelegation = new DefaultSelect<IDelegation>();
  selectEvent = new DefaultSelect<IComerLotsEG>();
  selectLot = new DefaultSelect<IComerLotsEG>();
  entidad = new DefaultSelect<IFederative>();
  idLot: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      ...RELEASE_REPORT_COLUMNS,
    },
    noDataMessage: 'No se encontrarón registros',
  };
  setting2 = {
    ...this.settings,
    actions: false,
    columns: { ...RELEASE_REPORT_COLUMNS },
  };

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private comerLotService: ComerLotService,
    private datePipe: DatePipe,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private delegationService: DelegationService,
    private entFedService: EntFedService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getEvent(this.params.getValue());
    this.getLot(this.params.getValue());
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      lote: [null, [Validators.required]],
      adjudicatorio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      domicilio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      colonia: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegacion: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      cp: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      // puesto: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      parrafo1: [null, [Validators.pattern(STRING_PATTERN)]],
      parrafo2: [null, [Validators.pattern(STRING_PATTERN)]],
      parrafo3: [null, [Validators.pattern(STRING_PATTERN)]],
      bienes: [null],
    });
  }

  cleanForm(): void {
    this.form.reset();
  }

  getDelegation(params?: ListParams) {
    this.delegationService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          this.idDelegation = data.id;
          data.description = `${data.id}- ${data.description}`;
          return data;
        });

        this.selectedDelegation = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectedDelegation = new DefaultSelect();
      },
    });
  }

  getEvent(params?: ListParams) {
    params['filter.event.statusvtaId'] = `$ilike:${params.text}`;
    params['filter.event.id'] = `$eq:${this.idEvent}`;
    this.comerLotService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.description = `${data.event.id}- ${data.event.statusvtaId}`;
          this.valid = true;
          return data;
        });
        this.selectEvent = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectEvent = new DefaultSelect();
      },
    });
  }
  getLot(params?: ListParams) {
    params['filter.event.id'] = `$eq:${this.idEvent}`;
    this.comerLotService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          this.idGood = data.goodNumber;
          this.valid = true;
          data.description = `${data.lotId}- ${data.description}`;
          return data;
        });
        this.selectLot = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectLot = new DefaultSelect();
      },
    });
  }
  getEntidad(params?: ListParams) {
    params['filter.id'] = `$eq:${this.idEntidad}`;
    this.entFedService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          this.description = `${data.id} - ${data.otWorth}`;
          console.log(data);
          return data;
        });
        this.entidad = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.entidad = new DefaultSelect();
      },
    });
  }
  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
  getGood(search: any) {
    this.comerLotService.findGood(search).subscribe({
      next: data => {
        this.goodList = data.data;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  Generar() {
    let params = {
      DESTYPE: this.idEvent,
      DOMICILIO: this.form.controls['domicilio'].value,
      ID_LOTE: this.form.controls['lote'].value,
      COLONIA: this.form.controls['colonia'].value,
      DELEGACION: this.form.controls['delegacion'].value,
      ESTADO: this.form.controls['estado'].value,
      CP: this.form.controls['cp'].value,
      PARRAFO1: this.form.controls['parrafo1'].value,
      ADJUDICATARIO: this.form.controls['adjudicatorio'].value,
      PARRAFO2: this.form.controls['parrafo2'].value,
      PARRAFO3: this.form.controls['parrafo3'].value,
    };

    this.siabService
      .fetchReport('FCOMERCARTARESP', params)
      .subscribe(response => {
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {
                if (data) {
                  data.map((item: any) => {
                    return item;
                  });
                }
              },
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }
}

export const RELEASE_REPORT_COLUMNS = {
  goodNumber: {
    title: 'Bien',
    type: 'text',
    sort: true,
  },
  description: {
    title: 'Descripcion',
    type: 'text',
    sort: true,
  },
  amount: {
    title: 'Valor',
    type: 'text',
    sort: true,
  },
};
