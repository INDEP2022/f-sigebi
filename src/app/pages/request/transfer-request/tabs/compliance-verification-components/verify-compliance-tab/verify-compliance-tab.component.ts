import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { BasePage } from 'src/app/core/shared/base-page';
import { VERIRY_COMPLIANCE_COLUMNS } from './verify-compliance-columns';
import { Articulo3, Articulo12 } from './articulos';
import { DETAIL_ESTATE_COLUMNS } from './detail-estates-columns';
import { IDetailEstate } from './detail-estates.model';

var bienes: IDetailEstate[] = [
  {
    id: 4,
    gestion: 'string',
    descripEstateTransfe: 'string',
    descriptionEstateSAE: '',
    typeEstate: 'string',
    quantityTransfe: 'string',
    measureUnit: 'string',
    uniqueKey: 'string',
    physicalState: 'string',
    stateConservation: 'string',
    destinyLigie: 'string',
    transferDestina: 'string',
  },
  {
    id: 5,
    gestion: 'string',
    descripEstateTransfe: 'string',
    descriptionEstateSAE: '',
    typeEstate: 'string',
    quantityTransfe: 'string',
    measureUnit: 'string',
    uniqueKey: 'string',
    physicalState: 'string',
    stateConservation: 'string',
    destinyLigie: 'string',
    transferDestina: 'string',
  },
];

@Component({
  selector: 'app-verify-compliance-tab',
  templateUrl: './verify-compliance-tab.component.html',
  styleUrls: ['./verify-compliance-tab.component.scss'],
})
export class VerifyComplianceTabComponent extends BasePage implements OnInit {
  verifComplianceForm: ModelForm<any>;
  settingsEstate = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  paragraphsTable1: any[] = [];
  paragraphsTable2: any[] = [];
  detallesBienes: IDetailEstate[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  arreglo: Array<any>;
  article3array: Array<any> = new Array<any>();
  article12and13array: Array<any> = new Array<any>();

  constructor() {
    super();
    this.arreglo = new Array();
  }

  ngOnInit(): void {
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
    this.settings.columns = VERIRY_COMPLIANCE_COLUMNS;
    this.settingsEstate.columns = DETAIL_ESTATE_COLUMNS;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.paragraphsTable1 = Articulo3;
    this.paragraphsTable2 = Articulo12;
    this.detallesBienes = bienes;
  }

  article3Selected(event: any): void {
    this.article3array = [];
    this.article3array = event.selected;
  }

  article12y13Selected(event: any): void {
    this.article12and13array = [];
    this.article12and13array = event.selected;
  }

  selectAll(event?: any) {
    this.arreglo = [];
    if (event.target.checked) {
      this.detallesBienes.forEach(x => {
        x.checked = event.target.checked;
        this.arreglo.push(x);
      });
    } else {
      this.detallesBienes.forEach(x => {
        x.checked = event.target.checked;
        this.arreglo = [];
      });
    }
    console.log(this.arreglo);
  }

  selectOne(event: any) {
    if (event.target.checked == true) {
      this.arreglo.push(
        this.detallesBienes.find(x => x.id == event.target.value)
      );
    } else {
      let index = this.arreglo.indexOf(
        this.detallesBienes.find(x => x.id == event.target.value)
      );
      this.arreglo.splice(index, 1);
    }
    console.log(this.arreglo);
  }

  confirm() {
    if (
      this.article3array.length == 3 &&
      this.article12and13array.length >= 3
    ) {
      this.msgModal(
        'Clasificar Bien',
        '¿Deseas turnar la solicitud con Folio: (Insertar el No. solicitud)',
        'Confirmacion',
        ''
      );
    } else {
      this.alert(
        'error',
        'Error',
        'Para que la solicitud sea procedente se deben seleccionar al menos los prmeros 3 cumplimientos del Articulo 3 Ley y 3 del Articulo 12'
      );
    }
  }

  msgModal(btnTitle: string, message: string, title: string, typeMsg: any) {
    this.alertQuestion(typeMsg, title, message, btnTitle).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
