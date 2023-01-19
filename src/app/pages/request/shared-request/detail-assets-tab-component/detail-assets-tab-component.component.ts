import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SelectAddressComponent } from '../../transfer-request/tabs/records-of-request-components/records-of-request-child-tabs-components/select-address/select-address.component';

@Component({
  selector: 'app-detail-assets-tab-component',
  templateUrl: './detail-assets-tab-component.component.html',
  styleUrls: ['./detail-assets-tab-component.component.scss'],
})
export class DetailAssetsTabComponentComponent implements OnInit, OnChanges {
  //usado para cargar los adatos de los bienes en el caso de cumplimientos de bienes y clasificacion de bienes
  @Input() detailAssets: ModelForm<any>;
  @Input() typeDoc: any;
  bsModalRef: BsModalRef;
  assetsForm: ModelForm<any>;

  selectSae = new DefaultSelect<any>();
  selectConservationState = new DefaultSelect<any>();

  goodTypeName: string = '';
  duplicity: boolean = false;

  //tipo de bien seleccionado
  otherAssets: boolean = false;
  carsAssets: boolean = false;
  boatAssets: boolean = false;
  jewelerAssets: boolean = false;
  aircraftAssets: boolean = false;
  especialMachineryAssets: boolean = false;
  mineralsAssets: boolean = false;
  immovablesAssets: boolean = false;
  manejeAssets: boolean = false; //diverso
  foodAndDrink: boolean = false; //diverso

  //selectores
  selectQuantityTransfer = new DefaultSelect<any>();
  selectPhysicalState = new DefaultSelect<any>();
  selectConcervationState = new DefaultSelect<any>();
  selectDestinyTransfer = new DefaultSelect<any>();
  selectTansferUnitMeasure = new DefaultSelect<any>();
  selectDestintSae = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectMunicipe = new DefaultSelect<any>();
  selectSuburb = new DefaultSelect<any>();
  selectCP = new DefaultSelect<any>();
  selectBrand = new DefaultSelect<any>();
  selectSubBrand = new DefaultSelect<any>();
  selectTypeUseBoat = new DefaultSelect<any>();
  selectTypeAirplane = new DefaultSelect<any>();
  selectTypeUseAirCrafte = new DefaultSelect<any>();

  typeRelevantSevice = inject(TypeRelevantService);
  genericService = inject(GenericService);

  constructor(private fb: FormBuilder, private modalServise: BsModalService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeDoc === 'clarification') {
      console.log(changes['detailAssets'].currentValue);
    }

    this.detailAssets.controls['goodTypeId'].valueChanges.subscribe(
      (data: any) => {
        console.log(this.detailAssets.getRawValue());
        if (data) {
          this.getTypeGood(this.detailAssets.controls['goodTypeId'].value);
          this.displayTypeTapInformation(Number(data));
        }
      }
    );
  }

  ngOnInit(): void {
    //this.initForm();
    console.log('tipo de bien');
    console.log(this.typeDoc);
    this.getDestinyTransfer(new ListParams());
    this.getPhysicalState(new ListParams());
    this.getConcervationState(new ListParams());

    //console.log('detalle del objeto enviado');
    //console.log(this.detailAssets);

    //this.initInputs();
    this.detailAssets.controls['transferentDestiny'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          let value = this.selectDestinyTransfer.data.filter(
            x => x.keyId === data
          );
          this.detailAssets.controls['destiny'].setValue(value[0].description);
        }
      }
    );

    /*this.detailAssets.controls['duplicity'].valueChanges.subscribe(
      (data: any) => {
        if (data == true) {
          this.detailAssets.controls['duplicity'].setValue('Y');
        } else {
          this.detailAssets.controls['duplicity'].setValue('N');
        }
      }
    );*/
  }

  initForm() {
    this.assetsForm = this.fb.group({
      noManagement: [null],
      typeAsset: [null, [Validators.pattern(STRING_PATTERN)]],
      color: [null, [Validators.pattern(STRING_PATTERN)]],
      transferQuantity: [null],
      descripTransfeAsset: [null, [Validators.pattern(STRING_PATTERN)]],
      duplicity: [false],
      capacityLts: [null, [Validators.pattern(STRING_PATTERN)]],
      volumem3: [null, [Validators.pattern(STRING_PATTERN)]],
      noExpedient: [null],
      typeUse: [null],
      conservationState: [null],
      origin: [null, [Validators.pattern(STRING_PATTERN)]],
      LigieUnitMeasure: [
        { value: '', disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      avaluo: [null],
      destinyLigie: [
        { value: '', disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      meetNoraml: [true],
      destinyTransfer: [null],
      tansferUnitMeasure: [null],
      notes: [null, [Validators.pattern(STRING_PATTERN)]],
      sae: [null],
      physicalState: [null],
      destintSae: [{ value: null, disabled: true }],
      /* tab bienes */
      address: new FormGroup({
        aliasWarehouse: new FormControl(''),
        referenceVia2: new FormControl(''),
        state: new FormControl(''),
        referenceVia3: new FormControl(''),
        municipe: new FormControl(''),
        suburb: new FormControl(''),
        cp: new FormControl(''),
        longitud: new FormControl(''),
        latitud: new FormControl(''),
        nameRoute: new FormControl(''),
        numExt: new FormControl(''),
        originRoute: new FormControl(''),
        numInt: new FormControl(''),
        routeDestination: new FormControl(''),
        referenceVia1: new FormControl(''),
        kilometerRoute: new FormControl(''),
        description: new FormControl(''),
      }),
      vehicle: new FormGroup({
        brand: new FormControl(''),
        enrollment: new FormControl(''),
        subBrand: new FormControl(''),
        serie: new FormControl(''),
        armored: new FormControl(''),
        chassis: new FormControl(''),
        model: new FormControl(''),
        numDoors: new FormControl(''),
        cabin: new FormControl(''),
        numEje: new FormControl(''),
        originVehicle: new FormControl(''),
        engineNum: new FormControl(''),
        canCirculate: new FormControl(''),
        hasTheftReport: new FormControl(''),
      }),
      boat: new FormGroup({
        boatArmored: new FormControl(''),
        operativeStatus: new FormControl(''),
        engineNumBoat: new FormControl(''),
        numEngines: new FormControl(''),
        enrollmentBoat: new FormControl(''),
        flag: new FormControl(''),
        cabinBoat: new FormControl(''),
        fretwork: new FormControl(''),
        volumem3Boat: new FormControl(''),
        eslora: new FormControl(''),
        originBoat: new FormControl(''),
        manga: new FormControl(''),
        typeUseBoat: new FormControl(''),
        boatName: new FormControl(''),
        yearProduction: new FormControl(''),
        boatRegistration: new FormControl(''),
        capacityLtsBoat: new FormControl(''),
        boats: new FormControl(''),
      }),
      jewel: new FormGroup({
        kilos: new FormControl(''),
        material: new FormControl(''),
        weight: new FormControl(''),
      }),
      aircraft: new FormGroup({
        aircraftArmored: new FormControl(''),
        yearProductionAircraft: new FormControl(''),
        modelAircraft: new FormControl(''),
        operativeStatusAircraf: new FormControl(''),
        engineNumAircraft: new FormControl(''),
        numEnginesAircraft: new FormControl(''),
        enrollmentAircraft: new FormControl(''),
        AeronauticsRegistry: new FormControl(''),
        serieAircraft: new FormControl(''),
        typeAirplane: new FormControl(''),
        originAircraft: new FormControl(''),
        flagAircraft: new FormControl(''),
        typeUseAirCraft: new FormControl(''),
      }),
      immovables: new FormGroup({
        descriptionImmovable: new FormControl(''),
        custody: new FormControl(''),
        statusImmovable: new FormControl(''),
        requireVigilance: new FormControl(''),
        levelVigilance: new FormControl(''),
        typeImmovable: new FormControl(''),
        metersWarehouse: new FormControl(''),
        metersLand: new FormControl(''),
        rooms: new FormControl(''),
        metersBuiltLand: new FormControl(''),
        bathRoom: new FormControl(''),
        kitchen: new FormControl(''),
        dinningRoom: new FormControl(''),
        livingRoom: new FormControl(''),
        studyRoom: new FormControl(''),
        garage: new FormControl(''),
        publicDeed: new FormControl(''),
        appraisedValue: new FormControl(''),
        valueDate: new FormControl(''),
        gravamen: new FormControl(''),
      }),
    });

    //this.assetsForm.controls['typeAsset'].disable();
    //this.assetsForm.disable();
    //this.assetsForm.controls['typeAsset'].enable();
  }

  getSae(event: any) {}

  getConservationState(event: any): void {}

  getQuantityTransfer(event: any) {}

  getPhysicalState(params: ListParams) {
    params.text = 'Estado Fisico';
    this.genericService.getAll(params).subscribe({
      next: (data: any) => {
        this.selectPhysicalState = new DefaultSelect(data.data, data.count);
      },
    });
  }

  getConcervationState(params: ListParams) {
    params.text = 'Estado Conservacion';
    this.genericService.getAll(params).subscribe({
      next: (data: any) => {
        this.selectConcervationState = new DefaultSelect(data.data, data.count);
      },
    });
  }

  getDestinyTransfer(params: ListParams) {
    params.text = 'Destino';
    this.genericService.getAll(params).subscribe({
      next: (data: any) => {
        this.selectDestinyTransfer = new DefaultSelect(data.data, data.count);
        this.detailAssets.controls['transferentDestiny'].setValue('1');
      },
    });
  }

  getTansferUnitMeasure(event: any) {}

  getDestintSae(event: any) {}

  getState(event: any) {}

  getMunicipe(event: any) {}

  getSuburb(event: any) {}

  getCP(event: any) {}

  getBrand(event: any) {}

  getSubBrand(event: any) {}

  getTypeUseBoat(event: any) {}

  getTypeAirplane(event: any) {}

  getTypeUseAirCrafte(event: any) {}

  modifyResponse(event: any) {
    console.log(event.currentTarget.checked);
    let checked = event.currentTarget.checked;
    let value = checked === true ? 'Y' : 'N';
    this.detailAssets.controls['duplicity'].setValue(value);
  }

  initInputs(): void {
    //control de disable de pantalla
    if (this.typeDoc === 'verify-compliance') {
      this.assetsForm.disable();
    } else if (this.typeDoc === 'classify-assets') {
      this.assetsForm.disable();
      this.assetsForm.controls['physicalState'].enable();
      this.assetsForm.controls['conservationState'].enable();
      this.assetsForm.controls['destintSae'].enable();
    } else if (this.typeDoc === 'assets') {
      this.assetsForm.controls['address'].disable();

      /* this.assetsForm.controls['referenceVia2'].disable();
      this.assetsForm.controls['state'].disable();
      this.assetsForm.controls['referenceVia3'].disable();
      this.assetsForm.controls['municipe'].disable();
      this.assetsForm.controls['cp'].disable();
      this.assetsForm.controls['longitud'].disable();
      this.assetsForm.controls['latitud'].disable();
      this.assetsForm.controls['nameRoute'].disable();
      this.assetsForm.controls['numExt'].disable();
      this.assetsForm.controls['originRoute'].disable();
      this.assetsForm.controls['numInt'].disable();
      this.assetsForm.controls['routeDestination'].disable();
      this.assetsForm.controls['referenceVia1'].disable();
      this.assetsForm.controls['kilometerRoute'].disable();
      this.assetsForm.controls['description'].disable();
      this.assetsForm.controls['suburb'].disable(); */
    }
  }

  openSelectAddressModal(): void {
    let config: ModalOptions = {
      initialState: {
        address: '',
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalServise.show(SelectAddressComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      //cargarlos en el formulario
      console.log(res);
      this.assetsForm.controls['address'].enable();
      //this.assetsForm.controls['address'].get('longitud').enable();
      //this.requestForm.get('receiUser').patchValue(res.user);
    });
  }

  getTypeGood(id: number) {
    this.typeRelevantSevice.getById(id).subscribe({
      next: (data: any) => {
        console.log('typeGood:', data);
        this.goodTypeName = data.data.description;
      },
    });
  }

  displayTypeTapInformation(typeRelevantId: number) {
    /*otherAssets: boolean = false;
    
    boatAssets: boolean = false;
    jewelerAssets: boolean = false;
    aircraftAssets: boolean = false;
    especialMachineryAssets: boolean = false;
    mineralsAssets: boolean = false;
    immovablesAssets: boolean = false;
    manejeAssets: boolean = false; //diverso
    foodAndDrink: boolean = false; //diverso*/
    switch (typeRelevantId) {
      case 2:
        this.carsAssets = true;
        break;

      default:
        break;
    }
  }

  save(): void {
    console.log('guardar los atributos de bien');
    console.log(this.assetsForm);
  }
}
