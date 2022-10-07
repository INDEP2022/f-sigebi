import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { APPRAISAL_COLUMNS } from './appraisal-columns';
import { ExcelService } from 'src/app/common/services/exportToExcel.service';

@Component({
  selector: 'app-c-b-a-cda-c-appraisal-consultation',
  templateUrl: './c-b-a-cda-c-appraisal-consultation.component.html',
  styles: [
  ]
})
export class CBACdaCAppraisalConsultationComponent extends BasePage implements OnInit {
  settings = TABLE_SETTINGS;
  constructor(
    private excelService:ExcelService
    ) {
      super();
      this.settings.columns = APPRAISAL_COLUMNS;
      this.settings.actions.columnTitle = "Exportar";
      this.settings.edit.editButtonContent = '<span class="icon-caret-down"></span>';
      this.settings.actions.edit = true;
    }

  ngOnInit(): void {
  }

  data = [
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
    }
  ];

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.data, 'Consulta_Avaluos');
  }

}
