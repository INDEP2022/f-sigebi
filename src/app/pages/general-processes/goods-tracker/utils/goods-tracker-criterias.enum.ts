export enum GoodsTrackerCriteriasEnum {
  GOOD_CLASIFICATION = 'good-clasification',
  GOOD_DATA = 'good-data',
  GOOD_RECORD_NOTIFICATION = 'good-record-notification',
  GOOD_RECEPTION_CERTIFICATE = 'good-reception-certificate',
  GOOD_TRANSFER = 'good-transfer',
  GOOD_LOCATION = 'good-location',
}

export const GOODS_TRACKER_CRITERIAS = [
  {
    label: 'Clasificación de Bienes (Tipo, Subtipo, Ssubtipo, Sssubtipo)',
    value: GoodsTrackerCriteriasEnum.GOOD_CLASIFICATION,
  },
  {
    label: 'Datos del Bien',
    value: GoodsTrackerCriteriasEnum.GOOD_DATA,
  },
  {
    label: 'Expediente Notificación y Dictamen',
    value: GoodsTrackerCriteriasEnum.GOOD_RECORD_NOTIFICATION,
  },
  {
    label: 'Actas de Recepción y Actas o Procesos de Destino',
    value: GoodsTrackerCriteriasEnum.GOOD_RECEPTION_CERTIFICATE,
  },
  {
    label: 'Catálogo de Transferente | Emisora | Autoridad',
    value: GoodsTrackerCriteriasEnum.GOOD_TRANSFER,
  },
  {
    label: 'Ubicación del Bien',
    value: GoodsTrackerCriteriasEnum.GOOD_LOCATION,
  },
];
