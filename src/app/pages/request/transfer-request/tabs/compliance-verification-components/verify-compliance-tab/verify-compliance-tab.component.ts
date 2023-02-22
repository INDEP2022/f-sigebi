import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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
export class VerifyComplianceTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  //@Input() dataObject: any;
  @Input() requestObject: any;
  @Input() typeDoc: string = '';
  verifComplianceForm: ModelForm<any>;

  goodSettings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  //paragraphsEstate = new BehaviorSubject<FilterParams>(new FilterParams());
  goodData: any = [];
  //detallesBienes: IDetailEstate[] = [];
  columns = DETAIL_ESTATE_COLUMNS;

  paragraphsTable1: any[] = [];
  paragraphsTable2: any[] = [];

  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;

  detailArray: ModelForm<any>;
  article3array: Array<any> = new Array<any>();
  article12and13array: Array<any> = new Array<any>();

  //goodSettings = { ...TABLE_SETTINGS, actions: false };

  constructor(
    private goodServices: GoodService,
    private typeRelevantService: TypeRelevantService,
    private genericService: GenericService
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
    this.settings.columns = VERIRY_COMPLIANCE_COLUMNS;
    this.goodSettings.columns = DETAIL_ESTATE_COLUMNS;

    this.paragraphsTable1 = Articulo3;
    this.paragraphsTable2 = Articulo12;

    this.columns.descriptionGoodSae = {
      ...this.columns.descriptionGoodSae,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          console.log(data);
        });
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData());
    }
  }

  getData() {
    this.loading = true;
    this.params.value.addFilter('requestId', this.requestObject.id);
    const filter = this.params.getValue().getParams();
    this.goodServices.getAll(filter).subscribe({
      next: resp => {
        var result = resp.data.map(async (item: any) => {
          const goodTypeName = await this.getTypeGood(item.goodTypeId);
          item['goodTypeName'] = goodTypeName;

          const physicalStatus = await this.getByTheirStatus(
            item.physicalStatus,
            'Estado Fisico'
          );
          item['physicstateName'] = physicalStatus;

          const stateConservation = await this.getByTheirStatus(
            item.stateConservation,
            'Estado Conservacion'
          );
          item['stateConservationName'] = stateConservation;

          const transferentDestiny = await this.getByTheirStatus(
            item.transferentDestiny,
            'Destino'
          );
          item['transferentDestinyName'] = transferentDestiny;

          const destiny = await this.getByTheirStatus(item.destiny, 'Destino');
          item['destinyName'] = destiny;
        });

        Promise.all(result).then(data => {
          this.goodData = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        });
      },
    });
  }

  getTypeGood(id: number) {
    return new Promise((resolve, reject) => {
      if (id) {
        this.typeRelevantService.getById(id).subscribe({
          next: resp => {
            resolve(resp.description);
          },
        });
      } else {
        resolve(null);
      }
    });
  }

  getByTheirStatus(id: number | string, typeName: string) {
    return new Promise((resolve, reject) => {
      if (id) {
        var params = new ListParams();
        params['filter.name'] = `$eq:${typeName}`;
        params['filter.keyId'] = `$eq:${id}`;
        this.genericService.getAll(params).subscribe({
          next: resp => {
            resolve(resp.data[0].description);
          },
        });
      } else {
        resolve(null);
      }
    });
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

  /*  selectAll(event?: any) {
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
  } */

  /* selectOne(event: any) {
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
  } */

  selectGood(event: any) {
    console.log('good', event);
    //this.detailArray.patchValue(event.data);
    //console.log(this.detailArray.getRawValue());

    //requestObject;
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
