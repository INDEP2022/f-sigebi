import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/good/good.model';
import { IAttribGoodBad, IGoodSiab } from '../../models/ms-good/good';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class GoodService extends HttpService implements ICrudMethods<IGood> {
  private readonly route: string = 'pendiente/parametros';
  constructor(
    private goodRepository: Repository<IGood>,
    private http: HttpClient
  ) {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: ListParams): Observable<IListResponse<IGood>> {
    return this.goodRepository.getAllPaginated('good/good', params);
  }

  getGoodByStatusPDS(
    params?: ListParams | string
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}`;
    return this.get<IListResponse<IGood>>(route, params);
  }

  getAllFilterDetail(params?: string): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(
      `${GoodEndpoints.Good}/getAllGoodWDetail?${params}`
    );
  }

  getByFilter(
    params?: HttpParams,
    id?: string
  ): Observable<IListResponse<IGood>> {
    return this.get(`good?${id}`, params);
  }

  getById(id: string | number): Observable<any> {
    return this.goodRepository.getById('good/good', id);
  }

  getById2(id: string | number) {
    const route = `${GoodEndpoints.Good}`;
    return this.get<IListResponse<IGood>>(`${route}?filter.id=$eq:${id}`).pipe(
      map(items => {
        return items.data
          ? items.data.length > 0
            ? items.data[0]
            : null
          : null;
      })
    );
  }

  getByIdv3(goodId: string | number) {
    const route = `${GoodEndpoints.Good}`;
    return this.get<IListResponse<IGood>>(
      `${route}?filter.goodId=$eq:${goodId}`
    ).pipe(
      map(items => {
        return items.data
          ? items.data.length > 0
            ? items.data[0]
            : null
          : null;
      })
    );
  }

  getAllStatusGood(params: ListParams) {
    return this.get(`${GoodEndpoints.OnlyStatus}`, params);
  }

  getGoodByIds(id: string | number): Observable<any> {
    const route = `good/good/getGoodById/${id}/${id}`;
    return this.goodRepository.getGoodByIds(route);
  }

  getDataByGoodFather(goodFather: number) {
    return this.goodRepository.getById(
      'good/good/getDataByGoodFather',
      goodFather
    );
  }

  getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }

  getGoodAtributesByClasifNum(clasifNum: number) {
    const route = `good/status-good/getAttribGoodData/${clasifNum}`;
    const params = { inicio: 1, pageSize: 150 };
    return this.goodRepository.getAllPaginated(route, params);
  }

  updateStatusGood(model: IGood): Observable<Object> {
    const route = 'good/good';
    return this.goodRepository.update7(route, model);
  }

  getStatusAll(params: ListParams | string) {
    return this.goodRepository.getAllPaginated('good/status-good', params);
  }
  getStatusByGood(idGood: string | number): Observable<any> {
    const route = 'good/good/getDescAndStatus';
    return this.goodRepository.getById(route, idGood);
  }
  getDataGoodByDeparture(departureNum: number | string) {
    const route = 'good/good/dataGoodByDeparture';
    return this.goodRepository.getById(route, departureNum);
  }

  getTempGood(body: any) {
    const route = 'good/status-good/tmpGoodAllSelect';
    return this.goodRepository.create(route, body) as any;
  }

  create(model: IGood): Observable<IGood> {
    return this.goodRepository.create('good/good', model);
  }

  update(id: string | number, model: IGood): Observable<Object> {
    return this.goodRepository.update('good/good', id, model);
  }
  updateStatus(id: string | number, status: string): Observable<Object> {
    return this.goodRepository.update22(
      `good/good/updateGoodStatus/${id}/${status}`,
      status
    );
  }
  updateStatusActasRobo(id: string | number, status: string) {
    const route = `good/api/v1/good/updateGoodStatus`;
    return this.http.put(
      `${environment.API_URL}/${route}/${id}/${status}`,
      status
    );
  }

  updateByBody(formData: Object) {
    const route = `good/api/v1/good`;
    return this.http.put(`${environment.API_URL}${route}`, formData);
  }

  getByExpedientAndStatus(
    expedient: string | number,
    status: string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = `?filter.fileNumber=$eq:${expedient}&filter.status=$eq:${status}`;
    return this.goodRepository.getAllPaginated(`good/good${route}`, params);
  }

  getGoodsDomicilies(params?: ListParams) {
    return this.goodRepository.getAllPaginated(`good/domicilies`, params);
  }

  getByStatus(idStatus: string) {
    return this.goodRepository.getById('good/status-good/', idStatus);
  }
  getByIdNew(id: string | number, goodId: number | string): Observable<any> {
    const route = `good/api/v1/good/getGoodbyId`;
    return this.http.get(`${environment.API_URL}${route}/${id}/${goodId}`);
  }

  getAttribGoodBadAll(
    params?: _Params
  ): Observable<IListResponse<IAttribGoodBad>> {
    return this.get<IListResponse<IAttribGoodBad>>(
      GoodEndpoints.AttribGoodBad,
      params
    );
  }

  getGoodSiabAll(params?: _Params): Observable<IListResponse<IGoodSiab>> {
    return this.get<IListResponse<IGoodSiab>>(
      GoodEndpoints.GoodGetSiab,
      params
    );
  }
  getAttribGoodBadFilter(
    params?: _Params
  ): Observable<IListResponse<IAttribGoodBad>> {
    return this.get<IListResponse<IAttribGoodBad>>(
      GoodEndpoints.AttribGoodBad,
      params
    );
  }

  getByExpedient(id: number) {
    const URL = `${environment.API_URL}/good/api/v1/good/`;
    const headers = new HttpHeaders();
    let params = new HttpParams().append('filter.fileNumber', `$eq:${id}`);

    return this.http
      .get<any>(URL, { headers: headers, params: params })
      .pipe(map(res => res));
  }

  getByExpedient_(id: number, _params?: ListParams) {
    _params['filter.fileNumber'] = `$eq:${id}`;
    const URL = `${environment.API_URL}/good/api/v1/good/`;
    const headers = new HttpHeaders();
    let params = new HttpParams().append('filter.fileNumber', `$eq:${id}`);

    return this.http
      .get<any>(URL, { headers: headers, params: _params })
      .pipe(map(res => res));
  }

  getByRequestId(Norequest: string | number) {
    return this.get<IListResponse<IGood>>(
      `${GoodEndpoints.Good}?filter.requestId=$eq:${Norequest}`
    );
  }

  getByExpedientFilter(expedient: any) {
    const route = `${GoodEndpoints.goodStatus}?filter.fileNumber=$eq:${expedient}`;
    return this.get(route);
  }

  getByGood(good: any) {
    const route = `${GoodEndpoints.GetAllGoodQuery}?filter.goodId=$eq:${good}`;
    return this.get(route);
  }

  getExcel() {
    return this.get<any>(GoodEndpoints.ExportExcelGoodBad);
  }
  donwloadExcel(token: string) {
    return this.get(`${GoodEndpoints.ExportExcelGoodBad}/${token}`);
  }

  getAllGood(good: any) {
    const route = `${GoodEndpoints.GetAllGoodQuery}?filter.goodId=$eq:${good}`;
    return this.get(route);
  }

  getAllStatus(status: any) {
    const route = `${GoodEndpoints.OnlyStatus}?filter.status=$ilike:${status}`;
    return this.get(route);
  }

  filterStatusGood(params: any) {
    return this.get(
      `${GoodEndpoints.goodStatus}?filter.status=$ilike:VPT`,
      params
    );
  }

  putStatusGood(good: number, status: string) {
    return this.put(`${GoodEndpoints.UpdateStatusGood}/${good}/${status}`);
  }

  getGoodCount() {
    const route = `${GoodEndpoints.goodSec}`;
    return this.get(route);
  }
  getByGood2(params: ListParams) {
    const route = `${GoodEndpoints.GetAllGoodQuery}`;
    return this.get(route, params);
  }

  getStatus(status: any) {
    const route = `${GoodEndpoints.OnlyStatus}/${status}`;
    return this.get(route);
  }

  getDescriptionGoods(good: number) {
    const route = `${GoodEndpoints.GoodDescription}/${good}`;
    return this.get(route);
  }

  updateGoodTable(good: IGood | any) {
    //Homologar descripción
    good.description = good?.goodDescription ?? good.description;

    //Para homologar los atributos
    switch (Number(good?.goodTypeId)) {
      case 8:
        console.log('ACTUALIZANDO DIVERSOS');
        //Estado Físico
        good.val1 = good?.physicalStatus === 1 ? 'BUENO' : good.val1;
        good.val1 = good?.physicalStatus === 2 ? 'MALO' : good.val1;

        //Procedencia
        good.origin = good?.val2 ?? good.origin;

        break;

      case 5:
        console.log('ACTUALIZANDO JOYAS');

        //Estado Físico
        good.val1 = good?.physicalStatus === 1 ? 'BUENO' : good.val1;
        good.val1 = good?.physicalStatus === 2 ? 'MALO' : good.val1;
        //Kilataje
        good.caratage = good?.val2 ?? good.caratage;
        //Material
        good.material = good?.val61 ?? good.material;
        //Peso
        good.weight = good.val62 ?? good.weight;

        break;

      case 4:
        console.log('ACTUALIZANDO AERONAVES');

        //AÑO DE FABRICACION
        good.manufacturingYear = good?.val1 ?? good.manufacturingYear;

        //ESTADO OPERATIVO
        good.operationalState = good?.val3 ?? good.operationalState;

        //MATRICULA
        good.tuition = good?.val5 ?? good.tuition;

        //MODELO
        good.model = good?.val7 ?? good.model;

        //NUMERO DE MOTORES
        good.enginesNumber = good?.val8 ?? good.enginesNumber;

        //NUMERO DE SERIE
        good.serie = good?.val9 ?? good.serie;

        //PROCEDENCIA
        good.origin = good?.val14 ?? good.origin;

        //TIPO DE AVION
        good.airplaneType = good?.val16 ?? good.airplaneType;

        //REGISTRO DGAC
        good.dgacRegistry = good?.val15 ?? good.dgacRegistry;

        //BLINDAJE
        good.armor = good?.val19 ?? good.armor;

        //NUMERO DE MOTOR
        good.engineNumber = good?.val20 ?? good.engineNumber;

        //BANDERA
        good.flag = good?.val38 ?? good.flag;

        //TIPO DE USO
        good.useType = good?.val22 ?? good.useType;

        break;

      case 3:
        console.log('ACTUALIZANDO EMBARCACIONES');

        //Estado Operativo
        good.operationalState = good?.val3 ?? good.operationalState;

        //Marca
        good.brand = good?.val9 ?? good.brand;

        //Matrícula
        good.tuition = good?.val13 ?? good.tuition;

        //Nombre de Embarcación
        good.shipName = good?.val15 ?? good.shipName;

        //No. Motor
        good.engineNumber = good?.val16 ?? good.engineNumber;

        //Procedencia
        good.origin = good?.val20 ?? good.origin;

        //Registro Público
        good.publicRegistry = good?.val21 ?? good.publicRegistry;

        //Blindaje
        good.armor = good?.val61 ?? good.armor;

        //No. Motores
        good.enginesNumber = good?.val62 ?? good.enginesNumber;

        //Bandera
        good.flag = good?.val63 ?? good.flag;

        //cabina
        good.cabin = good?.val64 ?? good.cabin;

        //Calado
        good.openwork = good?.val65 ?? good.openwork;

        //Volumen
        good.volume = good?.val66 ?? good.volume;

        //Eslora
        good.length = good?.val67 ?? good.length;

        //Manga
        good.sleeve = good?.val68 ?? good.sleeve;

        //Tipo de Uso
        good.useType = good?.val69 ?? good.useType;

        //Año de fabración
        good.manufacturingYear = good?.val70 ?? good.manufacturingYear;

        //Capacidad lts
        good.capacity = good?.val71 ?? good.capacity;

        //Embarcaciones
        good.ships = good?.val72 ?? good.ships;

        break;

      case 2:
        console.log('ACTUALIZANDO VEHÍCULOS');

        good.val2 = good?.physicalStatus === 1 ? 'BUENO' : good.val2;
        good.val2 = good?.physicalStatus === 2 ? 'MALO' : good.val2;

        //NUMERO DE EJES
        good.axesNumber = good?.val5 ?? good.axesNumber;

        //ESTADO FISICO
        //good.physicalStatus = good?.val2 ?? good.physicalStatus;

        //MARCA
        good.brand = good?.val3 ?? good.brand;

        //MODELO
        good.model = good?.val4 ?? good.model;

        //NUMERO DE MOTOR
        good.engineNumber = good?.val6 ?? good.engineNumber;

        //NUMERO DE SERIE
        good.serie = good?.val8 ?? good.serie;

        //PROCEDENCIA
        good.origin = good?.val9 ?? good.origin;

        //SUBMARCA
        good.subBrand = good?.val10 ?? good.subBrand;

        //APTO PARA CIRCULAR
        if (good.val8 != null || good.val8 != '') {
          good.fitCircular = 'N';
          good.val25 = 'NO APTO PARA CIRCULAR';
        } else {
          good.fitCircular = good?.val25 === 'APTO PARA CIRCULAR' ? 'Y' : 'N';
        }

        //REPORTE DE ROBO
        good.theftReport = good?.val26 === 'CON REPORTE DE ROBO' ? 'Y' : 'N';

        //MATRICULA
        good.tuition = good?.val61 ?? good.tuition;

        //BLINDAJE
        good.armor = good?.val62 ?? good.armor;

        //CHASIS
        good.chassis = good?.val63 ?? good.chassis;

        //NUMERO DE PUERTAS
        good.doorsNumber = good?.val64 ?? good.doorsNumber;

        break;

      case 1:
        console.log('ACTUALIZANDO INMUEBLES');

        //SITUACION JURIDICA

        //CALLE

        //COLONIA

        //DELEGACION O MUNICIPIO

        //ENTIDAD FEDERATIVA

        //SUPERFICIE DEL TERRENO

        //SUPERFICIE CONSTRUIDA

        //TIPO DE INMUEBLE

        //CARACTERÍSTICAS DEL INMUEBLE

        //VALOR DE REGISTRO CONTABLE

        //FOLIO DE ESCRITURA

        //ESTADO FISICO MENAJE

        //IMPORTE TOTAL DEL MENAJE

        //INSTALAC. ESPECIALES

        //CON AVALUO

        //NUMERO DEPARTAMENTOS

        //NUMERO DEPARTAMENTOS OCUPADOS

        //SEGUROS

        //NUMERO PISOS O NIVELES

        //PREDIAL

        //REGISTRO PUBLICO DE LA PROPIED

        //VALOR CONSTRUCCION HAB

        //VALOR CONSTRUCCION COMERCIAL

        //VIGILANCIA

        //DOCUMENTOS COLINDANCIA

        //CLAVE DE SITUACIONES JURIDICAS

        //AGUA

        //FECHA DE SOLICITUD AL RPP

        //HABITADO

        //MENAJE

        //NOMBRE DEL INMUEBLE

        //OFICIO SOLICITUD EN EL RPP

        //DOMICILIO

        //NUMERO EXTERIOR

        //CODIGO POSTAL

        //DESCRIPCION DE UBICACIÓN

        //MANZANA

        //VALOR OTROS

        //LOTE

        //FECHA DEL AVALUO

        //VALOR INSTALACIONES ESP

        //VALOR TERRENO

        //FECHA DE ESCRITURA

        //NUMERO DE ESCRITURA

        //CATÁLOGO COMERCIAL

        //OPCIONALES CATÁLOGO COMERCIAL

        //NUMERO INTERIOR

        //ESTATUS

        //NIVEL DE VIGILANCIA

        //METROS DE BODEGA

        //COCINA

        //SALA

        //COMEDOR

        //CERT. LIBERACION GRAVAMEN

        //ESTUDIO

        //ESPACIO DE ESTACIONAMIENTO

        //FECHA DE PASO AL FISCO

        //FECHA CERTIFICADO LIBERACION GRAVAMEN

        //EMBARGO

        //GRAVAMEN A FAVOR DE TERCERO

        //CO-PROPIEDAD

        //GRAVAMEN A FAVOR DE TRANSFERENTE

        //EMBARGO A FAVOR DE TERCERO

        //DECRETO_EXPRO_PROC

        //NUMERO DE COPROPIETARO

        //DECLARACION REMEDIACION

        //DECRETO_EXPRO_SUPE

        //PATRIMONIO

        //PROVISION ECOLOGICA

        //NUMERO PREVISION ECOLOGICA

        //COMPROBANTES DE AGUA

        //ADEUDOS

        //POSESION FISICA

        //CLAUSURADO

        //PATRIMONIO DE FAMILIA

        //DESCRIPCION DE PROBLEMÁTICA

        //PROBLEMATICAS

        //FOTOS ADJUNTAS

        //GUARDA CUSTODIA

        break;
    }

    const route = `${GoodEndpoints.Good}`;
    return this.put(route, good);
  }

  getAllStatusGood_(params: _Params) {
    return this.get(`${GoodEndpoints.OnlyStatus}`, params);
  }
}
