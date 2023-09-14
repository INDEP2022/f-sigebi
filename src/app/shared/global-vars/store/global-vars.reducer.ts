import { Action, createReducer, on } from '@ngrx/store';
import { IGlobalVars } from '../models/IGlobalVars.model';
import * as GlobalVarsActions from './global-vars.actions';

export const globalVarsFeatureKey = 'globalVar';

export interface GlobalVarsState {
  globalVars: IGlobalVars;
}

export const initialState: GlobalVarsState = {
  globalVars: {
    RAST_BIEN: 'Estado Inicial',
    RAST_BIEN_REL: null,
    NO_EXPEDIENTE: null,
    RAST_EXPEDIENTE_REL: null,
    REL_BIENES: null,
    CREA_EXPEDIENTE: null,
    RAST_EXPEDIENTE: null,
    RAST_DESCRIPCION_BIEN: null,
    RAST_TIPO: null,
    gNoExpediente: null,
    noVolante: null,
    bn: null,
    gCreaExpediente: null,
    gstMensajeGuarda: null,
    gnuActivaGestion: null,
    antecede: null,
    pSatTipoExp: null,
    pIndicadorSat: null,
    gLastCheck: null,
    vTipoTramite: null,
    gCommit: null,
    gOFFCommit: null,
    noTransferente: null,
    gNoVolante: null,
    varDic: null,
    bienes_foto: 0,
    EXPEDIENTE: null,
    TIPO_DIC: null,
    VOLANTE: null,
    CONSULTA: null,
    TIPO_VO: null,
    P_GEST_OK: null,
    P_NO_TRAMITE: null,
    IMP_OF: null,
    NO_EXPEDIENTE_F: null,
    G_REGISTRO_BITACORA: null,
  },
};

export const _reducerGlobalVars = createReducer(
  initialState,
  on(GlobalVarsActions.resetAction, () => initialState),
  on(GlobalVarsActions.loadGlobalVars, state => state),
  on(
    GlobalVarsActions.setGlobalVars,
    (state: GlobalVarsState, { updateGlobalVars }) => ({
      ...state,
      globalVars: updateGlobalVars,
    })
  )
);

export function reducerGlobalVars(
  state: GlobalVarsState | undefined,
  action: Action
) {
  return _reducerGlobalVars(state, action);
}
