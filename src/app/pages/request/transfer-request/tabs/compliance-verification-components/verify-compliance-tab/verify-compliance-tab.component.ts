import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IFormGroup, ModelForm } from 'src/app/core/interfaces/model-form';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { Articulo12, Articulo3 } from './articulos';
import { DETAIL_ESTATE_COLUMNS } from './detail-estates-columns';
import { VERIRY_COMPLIANCE_COLUMNS } from './verify-compliance-columns';

@Component({
  selector: 'app-verify-compliance-tab',
  templateUrl: './verify-compliance-tab.component.html',
  styleUrls: ['./verify-compliance-tab.component.scss'],
})
export class VerifyComplianceTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() requestObject: any;
  @Input() typeDoc: string = '';
  verifComplianceForm: ModelForm<any>;
  domicilieObject: IDomicilies;

  goodSettings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  //paragraphsEstate = new BehaviorSubject<FilterParams>(new FilterParams());
  goodData: any = [];
  //detallesBienes: IDetailEstate[] = [];
  columns = DETAIL_ESTATE_COLUMNS;

  paragraphsTable1: any[] = [];
  paragraphsTable2: any[] = [];

  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;

  detailArray: IFormGroup<IGood>;
  article3array: Array<any> = new Array<any>();
  article12and13array: Array<any> = new Array<any>();
  goodsSelected: any = [];

  constructor(
    private fb: FormBuilder,
    private goodServices: GoodService,
    private typeRelevantService: TypeRelevantService,
    private genericService: GenericService,
    private goodDomicilieService: GoodDomiciliesService
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
          this.setDescriptionGoodSae(data);
        });
      },
    };
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData());
    }
  }

  initForm() {
    this.detailArray = this.fb.group({
      id: [null],
      goodId: [null],
      ligieSection: [null],
      ligieChapter: [null],
      ligieLevel1: [null],
      ligieLevel2: [null],
      ligieLevel3: [null],
      ligieLevel4: [null],
      requestId: [null],
      goodTypeId: [null],
      color: [null],
      goodDescription: [null],
      quantity: [1],
      duplicity: ['N'],
      capacity: [null],
      volume: [null],
      fileeNumber: [null],
      useType: [null],
      physicalStatus: [null],
      stateConservation: [null],
      origin: [null],
      goodClassNumber: [null],
      ligieUnit: [null],
      appraisal: [null],
      destiny: [null], //preguntar Destino ligie
      transferentDestiny: [null],
      compliesNorm: [null],
      notesTransferringEntity: [null],
      unitMeasure: [null], // preguntar Unidad Medida Transferente
      saeDestiny: [null],
      brand: [null],
      subBrand: [null],
      armor: [null],
      model: [null],
      doorsNumber: [null],
      axesNumber: [null],
      engineNumber: [null], //numero motor
      tuition: [null],
      serie: [null],
      chassis: [null],
      cabin: [null],
      fitCircular: [null],
      theftReport: [null],
      addressId: [null],
      operationalState: [null],
      manufacturingYear: [null],
      enginesNumber: [null], // numero de motores
      flag: [null],
      openwork: [null],
      sleeve: [null],
      length: [null],
      shipName: [null],
      publicRegistry: [null], //registro public
      ships: [null],
      dgacRegistry: [null], //registro direccion gral de aereonautica civil
      airplaneType: [null],
      caratage: [null], //kilatage
      material: [null],
      weight: [null],
      descriptionGoodSae: [null],
    });
  }

  setDescriptionGoodSae(data: any) {
    this.goodData.map((item: any) => {
      if (item.id === data.data.id) {
        item.descriptionGoodSae = data.text;
      }
    });
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
      error: error => {
        this.loading = false;
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

  getDomicilieGood(id: number) {
    this.goodDomicilieService.getById(id).subscribe({
      next: resp => {
        this.domicilieObject = resp as IDomicilies;
      },
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

  selectGood(event: any) {
    console.log('good', event);
    this.detailArray.reset();
    this.goodsSelected = event.selected;
    if (this.goodsSelected.length === 1) {
      setTimeout(() => {
        this.detailArray.patchValue(this.goodsSelected[0] as IGood);
        this.getDomicilieGood(this.goodsSelected[0].addressId);
      }, 3000);
    }
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
