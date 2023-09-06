import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { RapproveDonationService } from 'src/app/core/services/ms-r-approve-donation/r-approve-donation.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../../common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-partialization-goods-donation',
  templateUrl: './partialization-goods-donation.component.html',
  styles: [],
})
export class PartializationGoodsDonationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data = new LocalDataSource();
  LocalData: any[] = [];
  NoGood: number;
  user: string;
  delegation: string;
  good: any;
  classif: boolean = false;

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private authorityService: AuthorityService,
    private rapproveDonationService: RapproveDonationService,
    private screenStatusService: ScreenStatusService,
    private goodprocessService: GoodprocessService,
    private historyGoodService: HistoryGoodService,
    private authService: AuthService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();
    this.getuser();
  }

  initForm() {
    this.form = this.fb.group({
      goodNumb: [null, [Validators.required]],
      description: [null],
      quantity: [null],
      appraisedValue: [null],
      status: [null],
      statusDescrip: [null],
      proceedings: [null],
      sorterNumb: [null],
      sorterDescrip: [null],
      currency: [null],
      amount: [null],
      amountToSplit: [null],
    });
  }

  settingsChange(event: any) {
    this.settings = event;
    this.getuser();
  }

  onSubmit() {}

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.username.toUpperCase();
    console.log('User: ', token);
    this.delegation = token.department.toUpperCase();
  }

  loadGood() {
    let good = this.form.get('goodNumb').value;
    let descriptionGood: any = null;
    let classgood: any = 0;
    let cvePantalla = {
      pScreemKey: 'FACTGENPARCDON',
    };
    this.goodprocessService.getGoodByScreeen(good, cvePantalla).subscribe({
      next: response => {
        console.log('response good ', response);
        this.good = response.data[0];
        classgood = response.data[0].goodClassNumber;
        this.NoGood = response.data[0].goodId;
        let status = response.data[0].status;
        this.goodService.getAllStatus(response.data[0].status).subscribe({
          next: resp => {
            console.log('Response status ', resp);
            descriptionGood = resp.data[0].description;
            this.searchStatus('FACTGENPARCDON', status);
            this.searchClasif(response, descriptionGood, classgood, good);
          },
          error: err => {
            this.searchClasif(response, descriptionGood, classgood, good);
            this.searchStatus('FACTGENPARCDON', status);
          },
        });
      },
    });
  }

  searchStatus(vc_pantalla: any, status: any) {
    this.screenStatusService.getStatusandScreen(vc_pantalla, status).subscribe({
      next: response => {
        console.log('todo ok con el estatus');
      },
      error: err => {
        this.alert(
          'error',
          'Error',
          'El Bien que Requiere Parcializar no se Encuentra en un Estatus Adecuado para Realizar esta Acción'
        );
        return;
      },
    });
  }

  searchClasif(response: any, status: any, classGood: any, good: any) {
    let clasification: any = null;
    this.authorityService.getDescription(classGood).subscribe({
      next: respon => {
        console.log('response description class ', respon);
        clasification = respon.data[0].description;
        this.loadQuantity(response, status, clasification, good);
      },
      error: err => {
        this.loadQuantity(response, status, clasification, good);
      },
    });
  }

  loadQuantity(response: any, status: any, clasification: any, good: any) {
    let quantity: any = null;
    this.rapproveDonationService.getSum(good).subscribe({
      next: respons => {
        console.log('Response Quantity ', respons);
        quantity = respons.data[0].sum;
        this.loadData(response, status, clasification, quantity);
      },
      error: err => {
        quantity = 0;
        this.loadData(response, status, clasification, quantity);
      },
    });
  }

  loadData(response: any, status: any, clasif: any, quantity: any) {
    console.log('Load data Response ', response);
    console.log('Load data status ', status);
    console.log('Load data clasif ', clasif);
    console.log('Response All ', response);
    let classi = response.data[0].goodClassNumber;

    if (classi == 62 || classi == 1424 || classi == 1426) {
      this.classif = true;
    } else {
      this.classif = false;
    }
    let vcantdon = response.data[0].quantity - quantity;
    console.log('cantidad response');
    this.form.patchValue({
      description: response.data[0].description,
      quantity: response.data[0].quantity,
      appraisedValue: response.data[0].appraisedValue,
      status: response.data[0].status,
      statusDescrip: status,
      proceedings: response.data[0].fileNumber,
      sorterNumb: response.data[0].goodClassNumber,
      sorterDescrip: clasif,
      currency: response.data[0].val1,
      amount: response.data[0].val2,
      amountToSplit: vcantdon,
    });
  }

  Parcializa() {
    let vfactor: any;
    let vestatus: any;
    let vaccion: any;
    let vc_pantalla: any = 'FACTGENPARCDON';
    let vn_bien_new: any;
    let vobserv_padre: any;
    let vobservaciones: any;
    let goodClas = this.form.get('sorterNumb').value;
    let quantityParcializa = this.form.get('amountToSplit').value;
    let quantity = this.form.get('quantity').value;
    if (goodClas == '62' || goodClas == '1424' || goodClas == '1426') {
      this.alert('error', 'Error', 'El Bien es Numerario Efectivo');
      return;
    } else if (quantity == quantityParcializa) {
      this.alert(
        'error',
        'Error',
        'La Cantidad a Parcializar es Igual a la Cantidad del Bien'
      );
      return;
    } else if (quantityParcializa == null || quantityParcializa < 1) {
      this.alert('error', 'Error', 'No se Tiene Cantidad a Parcializar');
      return;
    } else {
      this.alertQuestion(
        'info',
        '¿Quiere Continuar con la Aplicación?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          vestatus = this.form.get('status').value;
          vaccion = 'FINAL';
          this.screenStatusService
            .getStatusScreen(vc_pantalla, vaccion)
            .subscribe({
              next: resp => {
                console.log('respuesta Status Service ', resp);
                vestatus = resp.data[0].status;
                let params = {
                  propertyNum: this.NoGood,
                  status: vestatus,
                  changeDate: new Date(),
                  userChange: this.user,
                  statusChangeProgram: vc_pantalla,
                  reasonForChange: 'Parcialización',
                };
                this.historyGoodService.PostStatus(params).subscribe({
                  next: resp => {},
                });
              },
            });
          if (this.LocalData.length > 0) {
            this.LocalData = [];
            this.data.load(this.LocalData);
            this.totalItems = 0;
          }
          //enpoint para obtener el secuencial del bien
          let valorappaised = this.form.get('amountToSplit').value;
          let cantidad = this.form.get('quantity').value;
          let valoravaluo = this.form.get('appraisedValue').value;
          let consectgood: any;
          let amount = this.form.get('amount').value;
          vfactor = valorappaised / cantidad;
          let avalue: any;
          if (valoravaluo == null) {
            avalue = valoravaluo * vfactor;
          } else {
            avalue = valoravaluo;
          }
          this.goodService.getGoodCount().subscribe({
            next: response => {
              consectgood = response.data[0].nextval;
              console.log('respuesta consecutivo good', response);
              let params = {
                id: 1,
                goodNumb: consectgood,
                description:
                  'Parcializado del bien: ' +
                  this.NoGood +
                  ', ' +
                  this.form.get('description').value +
                  ', ' +
                  ',1,1250',
                appraisedValue: avalue,
                quantity: cantidad,
                amount: amount,
              };
              this.LocalData.push(params);
              this.data.load(this.LocalData);
              this.totalItems = 1;
              vobserv_padre =
                'Bien(es) parcializado(s): ' +
                consectgood +
                ' por: ' +
                this.form.get('amountToSplit').value +
                ', ' +
                ',1,600';
              vobservaciones = 'Parcializado del bien: ' + this.NoGood;
              /*PUP_INSERTA_BIEN ( vn_bien_new,
                             vestatus,
                             :BIENES.VAL2,
                             vobservaciones,
                             vfactor,
                             vfactor );*/
              this.good.goodId = consectgood;
              this.good.id = consectgood;
              this.good.status = vestatus;
              this.good.goodReferenceNumber = consectgood;
              this.good.observations = vobservaciones;
              console.log('good ---> ', this.good);
              this.goodService.create(this.good).subscribe({
                next: respon => {
                  console.log('repuesta insert good', respon);
                  this.alert(
                    'success',
                    'Se Parcializó Correctamente',
                    'La Aplicación se Realizó con Éxito'
                  );
                },
                error: err => {},
              });
            },
          });
        }
      });
    }
  }

  Pup_Insert_good() {}
}
