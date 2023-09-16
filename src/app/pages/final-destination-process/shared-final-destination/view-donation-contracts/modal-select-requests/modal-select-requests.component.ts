import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDonacContract } from 'src/app/core/models/ms-donation/donation-good.model';
import { DonationRequestService } from 'src/app/core/services/ms-donationgood/donation-requets.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS, propContratosSelect } from './columns';

@Component({
  selector: 'app-modal-select-requests',
  templateUrl: './modal-select-requests.component.html',
  styles: [],
})
export class ModalSelectRequestsComponent extends BasePage implements OnInit {
  op: number;
  typeRequest: string;
  contract: IDonacContract;
  formContract: FormGroup;
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  consulto: boolean = false;
  propContratosSelect: any[] = propContratosSelect;
  title: string = 'Contratos de Donación';

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private donationRequestService: DonationRequestService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COLUMNS,
      },
    };
    //this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    console.log(this.typeRequest);
    this.initForm();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.consulto) this.consult();
    });
  }

  initForm() {
    if (this.op === 1) {
      this.form = this.fb.group({
        id_donatario: [null],
        no_almacen: [null],
        tipo_solicitud: [null, [Validators.pattern(STRING_PATTERN)]],
      });
      this.form.disable();
    } else {
      this.form = this.fb.group({
        typeRequest: [null, [Validators.required]],
      });
    }
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  close() {
    this.modalRef.hide();
  }

  consult() {
    this.consulto = true;
    this.loading = true;
    const model: any = {
      id: null,
      warehouseNumber: null,
      type: this.typeRequest,
    };
    console.log(model);
    this.donationRequestService
      .getDonationData(model, this.params.value)
      .subscribe({
        next: data => {
          const dataArray = data.data.map((item: any) => {
            return {
              ...item,
              SELEC: false,
            };
          });
          console.log(dataArray);
          this.data.load(dataArray);
          this.data.refresh();
          this.totalItems = data.count;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          this.data.load([]);
          this.data.refresh();
        },
      });
  }

  async incorporar() {
    if (!this.contract) {
      this.alert(
        'warning',
        this.title,
        'No se tiene el Id de Contrato, por lo que no se pueden integrar las Solicitudes.'
      );
      return;
    }
    const array1 = await this.data.getAll();
    console.log(this.propContratosSelect);
    const newArray = array1.map((obj1: any) => {
      const matchingObj = this.propContratosSelect.find(
        (obj2: any) =>
          obj2.id_donatario === obj1.id_donatario &&
          obj2.donatario === obj1.donatario
      );
      if (matchingObj && !matchingObj.SELEC) {
        return matchingObj;
      }
      return obj1;
    });
    // Variables de estado
    let V_BAN: boolean = false;
    let V_BAN_EX: boolean = false;
    let V_BAN_MAL: boolean = false;
    let V_BAN_MAA: boolean = false;
    let V_BAN_REG: boolean = false;
    let V_NO_REG: number;
    let V_ID_DONATARIO: number;
    let V_NO_ALMACEN: number;
    let V_ID_SOLICITUD: number;
    const propContratosSelect = newArray;
    let currentIndex: number = 0;
    if (propContratosSelect.length > 0) {
      while (currentIndex < propContratosSelect.length) {
        const record = propContratosSelect[currentIndex];
        console.log(record);
        if (record.SELEC === true && !V_BAN) {
          V_BAN = true;
          V_ID_DONATARIO = record.id_donatario;
          V_NO_ALMACEN = record.no_almacen;
          V_ID_SOLICITUD = record.id_solicitud;
          V_BAN_REG = true;
        } else if (
          record.SELEC === false &&
          V_BAN &&
          V_ID_DONATARIO === record.id_donatario &&
          V_NO_ALMACEN === record.no_almacen
        ) {
          V_BAN_EX = true;
        } else if (
          record.SELEC === true &&
          V_BAN &&
          V_ID_DONATARIO !== record.id_donatario
        ) {
          V_BAN_MAL = true;
        } else if (
          record.SELEC === true &&
          V_BAN &&
          V_NO_ALMACEN !== record.no_almacen
        ) {
          V_BAN_MAA = true;
        }
        currentIndex++;
        if (V_BAN_REG) {
          currentIndex = 0;
          V_BAN_REG = false;
        }
      }

      if (!V_BAN) {
        this.alert(
          'warning',
          this.title,
          'No se ha seleccionado ninguna Solicitud'
        );
        return;
      } else if (V_BAN_MAL) {
        this.alert(
          'warning',
          this.title,
          'Se seleccionó al menos dos Donatarios diferentes.'
        );
        return;
      } else if (V_BAN_MAA) {
        const respuesta = await this.alertQuestion(
          'question',
          this.title,
          'Se seleccionó al menos dos Almacenes diferentes. ¿Es correcto?'
        );
        if (!respuesta.isConfirmed) {
          return;
        }
      }

      if (V_BAN_EX) {
        const confirmacion = await this.alertQuestion(
          'question',
          this.title,
          'Se tiene al menos un registro más que concuerda con el Donatario y Almacén. ¿Se incorporan?'
        );
        if (confirmacion.isConfirmed) {
          propContratosSelect.forEach((record: any, index: number) => {
            if (
              record.SELEC === false &&
              V_ID_DONATARIO === record.id_donatario &&
              V_NO_ALMACEN === record.no_almacen
            ) {
              propContratosSelect[index].SELEC = true;
            }
          });
        }
      }
      //currentIndex = propContratosSelect.findIndex((record: any) => record.ID_SOLICITUD === V_NO_REG);
    }

    console.log(propContratosSelect);

    const respuesta = await this.alertQuestion(
      'question',
      this.title,
      '¿Se ejecuta la incorporación?'
    );
    if (respuesta.isConfirmed) {
      const res: any[] = await this.getDonacRequest(
        V_ID_DONATARIO,
        V_ID_SOLICITUD
      );
      console.error(res[0]['justification']);
      if (res[0]) {
        this.formContract
          .get('cto')
          .setValue(res[0]['authorizeType'] === 'D' ? 'DON' : 'ASI');
        this.formContract
          .get('job')
          .setValue(
            (res[0]['authorizeCve'] || res[0]['proposalCve']).substring(0, 20)
          );
        this.contract.justification = res[0]['justification'];
      }
      this.contract.requestId = V_ID_SOLICITUD;
      this.contract.donee = V_ID_DONATARIO;
      this.updateDonacContract();
    }
  }

  getDonacRequest(doneeId: number | string, requestId: number | string) {
    return new Promise<any[]>((res, rej) => {
      const param: ListParams = {};
      param['filter.doneeId'] = `$eq:${doneeId}`;
      param['filter.requestId.id'] = `$eq:${requestId}`;
      this.donationRequestService.getDonacRequest(param).subscribe({
        next: data => {
          console.log(data.data);
          res(data.data);
        },
        error: (error: any) => {
          res([]);
        },
      });
    });
  }

  async pupSelectInventario() {
    if (!this.contract) {
      this.alert(
        'warning',
        this.title,
        'No se tiene el Id de Contrato, por lo que no se pueden integrar las Solicitudes.'
      );
      return;
    }
    const array1 = await this.data.getAll();
    const newArray = array1.map((obj1: any) => {
      const matchingObj = this.propContratosSelect.find(
        (obj2: any) =>
          obj2.id_donatario === obj1.id_donatario &&
          obj2.donatario === obj1.donatario
      );
      if (matchingObj && !matchingObj.SELEC) {
        return matchingObj;
      }
      return obj1;
    });
  }

  updateDonacContract() {
    //this.contract.paragraph1 = this.form.value;
    const contract: any = this.contract;
    contract['ContractKey'] = this.contract.contractKey;
    delete contract['donee'];
    delete contract['typeDonac'];
    delete contract['justification'];
    delete contract['requestDate'];
    delete contract['authorizeKey'];
    delete contract['authorizeDate'];
    delete contract['don'];
    delete contract['razonSocial'];
    delete contract['razonSocial'];
    delete contract['descDonatario'];
    delete contract['estado'];
    delete contract['municipio'];
    delete contract['contractKey'];
    delete contract['nbOrigin'];

    this.donationRequestService.udateDonacContract(contract).subscribe({
      next: resp => {
        this.alert(
          'success',
          this.title,
          'Se ha actualizado el contrato correctamente.'
        );
      },
      error: err => {
        this.alert(
          'error',
          this.title,
          'No se ha podido actualizar el contrato.'
        );
      },
    });
  }

  onClickSelect(event: any) {
    console.log(event);
    this.form.patchValue(event);
  }
}
