import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IGlobalGoodsCapture } from './interfaces/good-capture-global';
import { IGoodCaptureParams } from './interfaces/goods-capture-params';
import { GOOD_CAPTURE_FORM } from './utils/good-capture-form';

export class GoodsCaptureMain extends BasePage {
  params: Partial<IGoodCaptureParams> = {
    origin: null,
    transferId: null,
    recordId: null,
    satSubject: '99016',
    pOfficeNumber: '800-36-00-06-00-2011-16989',
    iden: '',
  };
  global: IGlobalGoodsCapture = {
    satIndicator: null,
    gNoExpediente: null,
    gRastBien: '1',
    gRastBienExpedienteRel: null,
    gRastBienRel: null,
    gRastDescripcionBien: null,
    gRastTipo: '5',
    gRastSubtipo: '17',
    gRastSsubtipo: '1',
    gRastSssubtipo: '1',
    gCreaExpediente: null,
    gClasifNumber: null,
    vPgrOficio: null,
    gCommit: 'N',
    gFlag: 0,
    val1: null,
    val2: null,
    val3: null,
    val4: null,
    contador: 0,
    gnuActivaGestion: null,
    pIndicadorSat: 0,
  };
  txtNoClasifBien: string = null;
  SAT_RECORD: number;
  ligieButtonEnabled: boolean = true;
  normsButtonEnabled: boolean = true;
  regulationsButtonEnabled: boolean = true;
  types = new DefaultSelect<IGoodType>();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();
  assetsForm;
  select = new DefaultSelect();
  modalRef: BsModalRef;
  vCount: number;
  vPartida: number;

  constructor(fb: FormBuilder) {
    super();
    this.assetsForm = fb.group(GOOD_CAPTURE_FORM);
  }

  protected showError(message: string) {
    this.onLoadToast('error', 'Error', message);
  }

  // ? ----------------- La pantalla es llamada desde Registro de volantes

  isCalledFrom(origin: string) {
    return this.params.origin == origin;
  }

  setIdenParam(identifier: string) {
    if (!identifier) {
      return;
    }

    const firstTwo = identifier.slice(0, 2);
    const first = identifier.slice(0, 1);
    const five = identifier.slice(0, 5);
    if (firstTwo == '4T') {
      this.params.iden = '4TON';
    } else if (firstTwo == '4M') {
      this.params.iden = '4MT';
    } else if (first == '6') {
      this.params.iden = '6TON';
    } else if (five == 'TRANS') {
      this.params.iden = 'TRANS';
    }
  }
}
