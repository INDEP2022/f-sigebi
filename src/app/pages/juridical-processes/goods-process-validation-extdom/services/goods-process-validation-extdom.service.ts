import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IHistoricGoodsAsegExtdom } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IProceduremanagement } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';

export interface ITypeMailSelect {
  previous: string;
  wheelNumber: number;
  expedientNumber: number;
}

@Injectable({
  providedIn: 'root',
})
export class GoodsProcessValidationExtdomService {
  constructor(
    private msNotificationService: NotificationService,
    private msAffairService: AffairService,
    private msIndiciadosService: IndiciadosService,
    private msMinPubService: MinPubService,
    private msCourtService: CourtService,
    private msDelegationService: DelegationService,
    private msParametersService: ParametersService,
    private msStateOfRepublicService: StateOfRepublicService,
    private msCityService: CityService,
    private msTransferenteService: TransferenteService,
    private msStationService: StationService,
    private msAuthorityService: AuthorityService,
    private msGoodService: GoodService,
    private msHistoryGoodService: HistoryGoodService,
    private msProcedureManagementService: ProcedureManagementService,
    private datePipe: DatePipe
  ) {}
  getNotificationByFilters(params: _Params) {
    return this.msNotificationService.getAllFilter(params);
  }
  updateNotification(
    wheelNumber: number,
    notification: Partial<INotification>
  ) {
    return this.msNotificationService.update(wheelNumber, notification);
  }
  getAffair(params: ListParams) {
    return this.msAffairService.getAll(params);
  }
  getIndiciados(params: ListParams) {
    return this.msIndiciadosService.getAllFiltered(params);
  }
  getMinpub(params: string) {
    return this.msMinPubService.getAllWithFilters(params);
  }
  getCourt(params: ListParams) {
    return this.msCourtService.getAll(params);
  }
  getDelegation(params: ListParams) {
    return this.msDelegationService.getAllPaginated(params);
  }
  faStageCreda(dateCreate: string) {
    return this.msParametersService.getFaStageCreda(dateCreate);
  }
  getStateOfRepublic(params: ListParams) {
    return this.msStateOfRepublicService.getAll(params);
  }
  getCity(params: ListParams) {
    return this.msCityService.getAllCitys(params);
  }
  getTransferente(params: ListParams) {
    return this.msTransferenteService.getAll(params);
  }
  getStation(params: ListParams) {
    return this.msStationService.getAll(params);
  }
  getAuthority(params: ListParams) {
    return this.msAuthorityService.getAll(params);
  }
  getGoods(params: string) {
    return this.msGoodService.getAllFilter(params);
  }
  getHistoryGood(params: _Params) {
    return this.msHistoryGoodService.getAllFilterHistoricGoodsAsegExtdom(
      params
    );
  }
  updateProcedureManagement(id: number, body: Partial<IProceduremanagement>) {
    return this.msProcedureManagementService.update(id, body);
  }
  getProcedureManagement(params: string) {
    return this.msProcedureManagementService.getAllFiltered(params);
  }
  getProcedureManagementById(id: number) {
    return this.msProcedureManagementService.getById(id);
  }
  updateGood(body: Partial<IGood>) {
    return this.msGoodService.update(body);
  }
  createHistoryGood(body: Partial<IHistoricGoodsAsegExtdom>) {
    return this.msHistoryGoodService.createHistoricGoodsAsegExtdom(body);
  }
  updateHistoryGood(body: Partial<IHistoricGoodsAsegExtdom>) {
    return this.msHistoryGoodService.updateHistoricGoodsAsegExtdom(body);
  }

  /** VALIDAR TIPO DE MENSAJES DE CORREO */

  validTypeMessageMail(selectType: string, data: ITypeMailSelect) {
    let textMessage: string = '';
    let currentDate: any = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    if (selectType == 'P1') {
      textMessage =
        'De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal,' +
        'en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7 del ordenamiento ' +
        'invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo,' +
        'la Suspensión "Provisional y/o definitiva", respecto de los bienes relacionados a continuación:\n\n' +
        (data.previous != null ? data.previous : '') +
        '\n\n' +
        'Dicha de notificación se hizo del conocimiento de esta área mediante el Volante SIAB número ' +
        +(data.wheelNumber != null ? data.wheelNumber : '') +
        ' de Fecha ' +
        currentDate +
        ', relacionado con el expediente ' +
        (data.expedientNumber != null ? data.expedientNumber : '') +
        '.\n\n' +
        'Lo anterior, con la finalidad de que en el ámbito de su competencia, obedezca el auto de ' +
        'suspensión debidamente notificado a este Organismo, toda vez que la omisión es sancionada en ' +
        'los términos del Código Penal aplicable en materia Federal para el delito de abuso de autoridad, ' +
        'por cuanto a la desobediencia cometida; independientemente de cualquier otro delito en que incurra ' +
        '(art. 206 de la Ley de Amparo).\n\n' +
        'Atentamente\n\n' +
        'Coordinación Fiscal y de Amparos';
    } else if (selectType == 'P2') {
      textMessage =
        'De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, ' +
        'en el artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7 del ordenamiento ' +
        'invocado, se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, ' +
        'la Suspensión "Provisional y/o definitiva", respecto de los bienes relacionados a continuación:\n\n' +
        (data.previous != null ? data.previous : '') +
        '\n\n' +
        'Dicha de notificación se hizo del conocimiento de esta área mediante el Volante SIAB número ' +
        +(data.wheelNumber != null ? data.wheelNumber : '') +
        ' de Fecha ' +
        currentDate +
        ', relacionado con el expediente ' +
        (data.expedientNumber != null ? data.expedientNumber : '') +
        '.\n\n' +
        'En dicho acuerdo la autoridad competente negó la suspensión en los términos precisados en la ' +
        'notificación arriba citada; se recomienda que dichos bienes mantengan el mismo status que se ' +
        'encontraban hasta antes de esta notificación y esperar a que se resuelva en definitiva el juicio de amparo.\n\n' +
        'Atentamente\n\n' +
        'Coordinación Fiscal y de Amparos';
    } else if (selectType == 'P3') {
      textMessage =
        'De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el ' +
        'artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7 del ordenamiento invocado, ' +
        'se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, el auto ' +
        'que ordena que a causado ejecutoria el juicio de amparo, relacionado con el Volante SIAB número ' +
        +(data.wheelNumber != null ? data.wheelNumber : '') +
        ' de Fecha ' +
        currentDate +
        ', del expediente ' +
        (data.expedientNumber != null ? data.expedientNumber : '') +
        '.\n\n' +
        'En donde la Justicia de la Nación amparó y protegió al quejoso, para los efectos precisados en el ' +
        'acuerdo antes citado, respecto de los siguientes bienes:\n\n' +
        (data.previous != null ? data.previous : '') +
        '\n\n' +
        'Atentamente\n\n' +
        'Coordinación Fiscal y de Amparos';
    } else if (selectType == 'P4') {
      textMessage =
        'De conformidad con las funciones encomendadas a la Dirección Ejecutiva de Soporte Legal, en el ' +
        'artículo 30 del Estatuto Orgánico del SAE, y parte última del artículo 7 del ordenamiento invocado, ' +
        'se hace de su conocimiento que se notificó en las Oficinas Centrales de este Organismo, el auto ' +
        'que ordena que a causado ejecutoria el juicio de amparo, relacionado con el Volante SIAB número ' +
        +(data.wheelNumber != null ? data.wheelNumber : '') +
        ' de Fecha ' +
        currentDate +
        ', del expediente ' +
        (data.expedientNumber != null ? data.expedientNumber : '') +
        '.\n\n' +
        'En donde la Justicia de la Nación no amparó, ni protegió al quejoso.\n\n' +
        'Atentamente\n\n' +
        'Coordinación Fiscal y de Amparos';
    }
    // console.log(textMessage);
    let subStgMessage = textMessage.substring(0, 1999); // Recortar mensaje desde 1 hasta 2000
    return subStgMessage;
  }
}
