import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { APPRAISAL_COLUMNS } from './appraisal-columns';

@Component({
  selector: 'app-appraisal-consultation',
  templateUrl: './appraisal-consultation.component.html',
  styles: [],
})
export class AppraisalConsultationComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private excelService: ExcelService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Exportar',
        edit: true,
        delete: false,
        position: 'right',
      },
      edit: {
        editButtonContent:
          '<span class="bi bi-file-earmark-excel text-warning mx-2"></span>',
      },
      columns: { ...APPRAISAL_COLUMNS },
    };
  }

  ngOnInit(): void {}

  data = [
    {
      idEvento: '31573',
      idAvaluo: '98743',
      cveAvaluo: 'SDF_DFA_186_E21673',
      cveOficio: '14',
      usuarioCaptura: 'MAROMERO',
      fechaCaptura: '20/09/20',
      no: '',
      noBien: '',
      descripcion: '',
      estatus: '',
      noClasif: '',
      descsssubtipo: '',
      descssubtipo: '',
      descsubtipo: '',
      desctipo: '',
      fechaAvaluo: '',
      fechaVigAvaluo: '',
      estatusAvaluo: '',
    },
    {
      idEvento: '21673',
      idAvaluo: '32243',
      cveAvaluo: 'IEV_DIV_186_E21673',
      cveOficio: '77',
      usuarioCaptura: 'MAROMERO',
      fechaCaptura: '19/09/20',
      no: '',
      noBien: '',
      descripcion: '',
      estatus: '',
      noClasif: '',
      descsssubtipo: '',
    },
  ];

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'Consulta_Avaluos');
  }
}
