import { Injectable } from '@angular/core';
//httpClient
import { HttpClient } from '@angular/common/http';
//params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
//services
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { SatInterfaceService } from 'src/app/core/services/sat-interface/sat-interface.service';

@Injectable({
  providedIn: 'root',
})
export class SatSubjectsRegisterService {
  constructor(
    private httClient: HttpClient,
    private satInterfaceService: SatInterfaceService,
    private delegationService: DelegationService,
    private procedureManagementRepository: ProcedureManagementService
  ) {}

  /**
   * Funciones de Catalogos
   */

  /**
   * Obtener el listado de Coordinadores de acuerdo a los criterios de búsqueda
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getCoordinadorBySearch(params: ListParams) {
    return this.delegationService.getAll(params);
  }

  /**
   * Funciones de Gestión Trámite Sat
   */

  /**
   * Obtener el listado de Estatus del proceso de acuerdo a los criterios de búsqueda
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getStatusBySearch(params: ListParams) {
    return this.procedureManagementRepository.getManagamentArea(params);
  }

  /**
   * Obtener el resultado de la busqueda para el listado de gestion tramite SAT
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getGestionTramiteSatBySearch(params: ListParams) {
    return this.procedureManagementRepository.getManagamentProcessSat(params);
  }

  /**
   * Funciones de Sat Transferencia
   */

  /**
   * Obtener el resultado de la busqueda para el listado de transferencias SAT
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getSatTransferenciaBySearch(params: ListParams) {
    return this.satInterfaceService.getVSatTransferencia(params);
  }

  getReport(params: ListParams, tipoReport: string) {
    console.log(tipoReport, params);
    if (tipoReport == 'gestion_sat') {
      return this.procedureManagementRepository.getReportProcedureManage(
        params
      );
    } else {
      return this.procedureManagementRepository.getReportTransferenciaSat(
        params
      );
    }
  }
}
