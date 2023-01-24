import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { Articulo12, Articulo3 } from './articulos';
import { DETAIL_ESTATE_COLUMNS } from './detail-estates-columns';
import { IDetailEstate } from './detail-estates.model';
import { VERIRY_COMPLIANCE_COLUMNS } from './verify-compliance-columns';

var bienes: IDetailEstate[] = [
  {
    id: 4,
    gestion: 'texto de prueba',
    descripEstateTransfe: 'texto de prueba',
    descriptionEstateSAE: '',
    typeEstate: 'texto de prueba',
    quantityTransfe: 'texto de prueba',
    measureUnitLigia: 'texto de prueba',
    measureUnit: 'texto de prueba',
    uniqueKey: 'texto de prueba',
    physicalState: 'texto de prueba',
    stateConservation: 'texto de prueba',
    destinyLigie: 'texto de prueba',
    transferDestina: 'texto de prueba',
  },
  {
    id: 5,
    gestion: 'string',
    descripEstateTransfe: 'string',
    descriptionEstateSAE: '',
    typeEstate: 'string',
    quantityTransfe: 'string',
    measureUnitLigia: 'string',
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
  @Input() dataObject: any;
  @Input() typeDoc: string = '';
  verifComplianceForm: ModelForm<any>;

  settingsEstate = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  paragraphsEstate = new BehaviorSubject<ListParams>(new ListParams());
  detallesBienes: IDetailEstate[] = [];
  columns = DETAIL_ESTATE_COLUMNS;

  paragraphsTable1: any[] = [];
  paragraphsTable2: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  detailArray: any;
  article3array: Array<any> = new Array<any>();
  article12and13array: Array<any> = new Array<any>();

  constructor() {
    super();
    this.detailArray = new Array();
  }

  ngOnInit(): void {
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
    this.settings.columns = VERIRY_COMPLIANCE_COLUMNS;
    this.settingsEstate.columns = DETAIL_ESTATE_COLUMNS;

    this.columns.descriptionEstateSAE = {
      ...this.columns.descriptionEstateSAE,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          console.log(data);
        });
      },
    };
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

  clicked(event: any) {
    console.log('table');
    console.log(event);
  }

  selectAll(event?: any) {
    this.detailArray = [];
    if (event.target.checked) {
      this.detallesBienes.forEach(x => {
        x.checked = event.target.checked;
        this.detailArray.push(x);
      });
    } else {
      this.detallesBienes.forEach(x => {
        x.checked = event.target.checked;
        this.detailArray = [];
      });
    }
    console.log(this.detailArray);
  }

  selectOne(event: any) {
    if (event.target.checked == true) {
      this.detailArray.push(
        this.detallesBienes.find(x => x.id == event.target.value)
      );
    } else {
      let index = this.detailArray.indexOf(
        this.detallesBienes.find(x => x.id == event.target.value)
      );
      this.detailArray.splice(index, 1);
    }
    console.log(this.detailArray);
  }

  getTableElements(event: any) {
    console.log(event);
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
