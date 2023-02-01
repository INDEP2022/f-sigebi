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
export class PgrSubjectsRegisterService {
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
   * Funciones de Gestión Trámite PGR
   */

  /**
   * Obtener el listado de Estatus del proceso de acuerdo a los criterios de búsqueda
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getStatusBySearch(params: ListParams) {
    return this.procedureManagementRepository.getManagamentProcessSatArea(
      params
    );
  }

  /**
   * Obtener el resultado de la busqueda para el listado de gestion de trámite PGR
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getGestionTramiteSatBySearch(params: ListParams) {
    return this.procedureManagementRepository.getManagamentProcessPgr(params);
  }

  /**
   * Funciones de Pgr Transferencia
   */

  /**
   * Obtener el resultado de la busqueda para el listado de transferencias PGR
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getPgrTransferenciaBySearch(params: ListParams) {
    return this.satInterfaceService.getVSatTransferencia(params);
  }
}
