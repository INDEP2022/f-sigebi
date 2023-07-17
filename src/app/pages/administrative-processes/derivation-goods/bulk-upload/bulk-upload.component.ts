import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IbulkLoadGoods } from 'src/app/core/models/good/good.model';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';

interface NotData {
  id: number;
  reason: string;
}
interface IDs {
  No_bien: number;
}
@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styles: [],
})
export class BulkUploadComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  pGoodFatherNumber: any;
  expedientNumber: any;
  Number: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Reactive Forms
  form: FormGroup;
  data: LocalDataSource = new LocalDataSource();
  ids: IDs[];
  fileName: string = '';
  good: IbulkLoadGoods;

  get numberGoodFather() {
    return this.form.get('numberGoodFather');
  }
  get numberDossier() {
    return this.form.get('numberDossier');
  }
  get fileLoad() {
    return this.form.get('fileLoad');
  }

  //Data Table
  settings0 = {
    //selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    noDataMessage: 'No se encontraron registros',
    mode: 'external', // ventana externa
    columns: {
      CLASIFICADOR: {
        title: 'Clasif.',
        width: '10%',
        sort: false,
      },
      DESCRIPCION: {
        title: 'Descripcion',
        width: '20%',
        sort: false,
      },
      CANTIDAD: {
        title: 'Cantidad',
        width: '10%',
        sort: false,
      },
      UNIDAD: {
        title: 'Unidad',
        width: '10%',
        sort: false,
      },
      TIPO: {
        title: 'Tipo',
        width: '10%',
        sort: false,
      },
      MATERIAL: {
        title: 'Material',
        width: '10%',
        sort: false,
      },
      EDOFISICO: {
        title: 'Edo. Fisico',
        width: '10%',
        sort: false,
      },
    },
  };
  //Data Table
  settings1 = {
    //selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    noDataMessage: 'No se encontraron registros',
    mode: 'external', // ventana externa
    columns: {
      numberGood: {
        title: 'No. Renglon',
        width: '20%',
        sort: false,
      },
      description: {
        title: 'Descripcion',
        width: '60%',
        sort: false,
      },
    },
  };

  data1: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private serviceGood: GoodService,
    private goodProcessService: GoodProcessService
  ) {
    super();
    this.route.queryParams.subscribe(params => {
      this.pGoodFatherNumber = params['pGoodFatherNumber'] || null;
      this.expedientNumber = params['expedientNumber'] || null;
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      numberGoodFather: [null, [Validators.required]],
      numberDossier: [null, [Validators.required]],
      fileLoad: [null, [Validators.required]],
    });
    this.numberGoodFather.setValue(this.pGoodFatherNumber);
    this.numberDossier.setValue(this.expedientNumber);
  }

  fileLoadBtn() {}

  enterGoods() {
    this.serviceGood.getById(this.form.value.numberGoodFather).subscribe(
      async res => {
        console.log('goodData:', res['data'][0]);
        const respuesta: any = await this.data;
        console.log('GGGGG', respuesta);
        /*if (this.data.length < 0) {

        }*/
        if (respuesta['data'].length == 0) {
          alert('No se tiene bienes a ingresar S');
        }
        if (res['data'][0].status == 'CVD') {
          alert('El bien ya ha sido convertido, anteriormente S');
        }
        if (!this.pGoodFatherNumber) {
          alert('No se localizó el bien padreS');
        }

        const arrayMasive = respuesta['data'].map(
          (i: any) => i.CLASIFICADOR && i.DESCRIPCION && i.CANTIDAD
        );
        //("Array Mavise: " + arrayMasive);

        //ejecutar loop
      },
      err => {
        console.log(err);
      }
    );
  }

  exit() {
    this.router.navigate(['pages/administrative-processes/derivation-goods']);
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    this.fileName = files[0].name;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    //  try {
    this.data.load([]);
    /*this.goods = [];
      this.availableToUpdate = [];
      this.idsNotExist = [];
      this.goodStatus.reset();
      this.observation.reset();
      this.showError = false;
      this.showStatus = false;*/

    this.ids = this.excelService.getData(binaryExcel);
    console.log('TESREADER', this.ids);
    this.data.load(this.ids);
    this.loadGood(this.ids);

    /*END POINT http://sigebimstest.indep.gob.mx/goodprocess/api/v1/update-good-status/curSearchGood?page=1&limit=10&filter.no_clasif_bien=$eq:1349 */
    /*this.serviceGood
        .getFolioActaConversion(this.actConvertion)
        .subscribe(item => {
          this.numberFoli = item.data[0].folio_universal
        });*/
    /* if (this.ids[0].No_bien === undefined) {
        this.alert(
          'error',
          'Ocurrio un error al leer el archivo',
          'El archivo no cuenta con la estructura requerida'
        );
        return;
      } else {
        this.loadGood(this.ids);
        this.alert('success', 'Archivo subido', '');
      }
    } catch (error) {
      this.alert('error', 'Ocurrio un error al leer el archivo', '');
    }*/
  }
  loadGood(data: any[]) {
    // this.loading = true;
    let count = 0;
    /* data.forEach(good => {
      count = count + 1;
      this.goodServices.getById(good.No_bien).subscribe({
        next: response => {
          this.goods.push({
            ...JSON.parse(JSON.stringify(response)).data[0],
            avalaible: null,
          });
          console.log(this.goods);
          this.addStatus();
          /* this.validGood(JSON.parse(JSON.stringify(response)).data[0]); */ //!SE TIENE QUE REVISAR
    /*  },
        error: err => {
          if (err.error.message === 'No se encontrarón registros')
            this.idsNotExist.push({
              id: good.goodNumber,
              reason: err.error.message,
            });
        },
      });
      if (count === data.length) {
        this.loading = false;
        this.showError = true;
        this.availableToAssing = true;
      }
    });*/
  }

  //Tabla de los bienes
  rowsSelected(event: any) {
    const mappedData: IbulkLoadGoods = {
      noClasifGood: event.data.CLASIFICADOR,
      noGoodFather: this.pGoodFatherNumber,
      quantity: event.data.CANTIDAD,
      description: event.data.DESCRIPCION,
      unit: event.data.UNIDAD ?? null,
      type: event.data.TIPO ?? null,
      material: event.data.MATERIAL ?? null,
      edoPhisical: event.data.EDOFISICO ?? null,
    };

    this.good = mappedData;
    //console.log((JSON.stringify(event.data)));
    //console.log("------------");
    //console.log((JSON.stringify(mappedData)));
    //console.log(this.good);
  }

  postDatatableItemBtn() {
    if (!this.good) {
      this.alert('error', 'No se tiene bienes a ingresar S', '');
    } else {
      this.goodProcessService.postGoodMasiveForm(this.good).subscribe(
        async res => {
          //console.log("res -> " + JSON.stringify(res));
          const message = res['message'][0];
          this.alert('success', 'Guardado', message);
        },
        err => {
          this.alert('error', 'Error', err);
        }
      );
    }
  }
}
