import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SelectAddressComponent } from '../../transfer-request/tabs/records-of-request-components/records-of-request-child-tabs-components/select-address/select-address.component';

@Component({
  selector: 'app-detail-assets-tab-component',
  templateUrl: './detail-assets-tab-component.component.html',
  styleUrls: ['./detail-assets-tab-component.component.scss'],
})
export class DetailAssetsTabComponentComponent implements OnInit, OnChanges {
  //usado para cargar los adatos de los bienes en el caso de cumplimientos de bienes y clasificacion de bienes
  @Input() detailAssets: any;
  @Input() typeDoc: any;
  bsModalRef: BsModalRef;
  assetsForm: ModelForm<any>;
  selectSae = new DefaultSelect<any>();
  selectConservationState = new DefaultSelect<any>();

  //tipo de bien seleccionado
  otherAssets: boolean = false;
  carsAssets: boolean = true;
  boatAssets: boolean = true;
  jewelerAssets: boolean = true;
  aircraftAssets: boolean = true;
  especialMachineryAssets: boolean = true;
  mineralsAssets: boolean = false;
  immovablesAssets: boolean = false;
  manejeAssets: boolean = false; //diverso
  foodAndDrink: boolean = true; //diverso

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

  constructor(private fb: FormBuilder, private modalServise: BsModalService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeDoc === 'clarification') {
      console.log(changes['detailAssets'].currentValue);
    }
  }

  ngOnInit(): void {
    this.initForm();
    console.log('tipo de bien');
    console.log(this.typeDoc);
    //console.log('detalle del objeto enviado');
    //console.log(this.detailAssets);

    this.initInputs();
  }

  initForm() {
    this.assetsForm = this.fb.group({
      noManagement: [null],
      typeAsset: [null],
      color: [null],
      transferQuantity: [null],
      descripTransfeAsset: [null],
      duplicity: [false],
      capacityLts: [null],
      volumem3: [null],
      noExpedient: [null],
      typeUse: [null],
      conservationState: [null],
      origin: [null],
      LigieUnitMeasure: [{ value: '', disabled: true }],
      avaluo: [null],
      destinyLigie: [{ value: '', disabled: true }],
      meetNoraml: [true],
      destinyTransfer: [null],
      tansferUnitMeasure: [null],
      notes: [null],
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

  getPhysicalState(event: any) {}

  getConcervationState(event: any) {}

  getDestinyTransfer(event: any) {}

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

  initInputs(): void {
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

  save(): void {
    console.log('guardar los atributos de bien');
    console.log(this.assetsForm);
  }
}
