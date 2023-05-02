import { IAffair } from 'src/app/core/models/ms-notification/notification.model';

export const NOTIFICATION_ASSOCIATION_COLUMNS = {
  wheelNumber: {
    title: 'No. Volante',
    sort: false,
  },
  identifier: {
    title: 'Identifica',
    sort: false,
  },
  wheelType: {
    title: 'Tipo Volante',
    sort: false,
  },
  affair: {
    title: 'Asunto',
    sort: false,
    valuePrepareFunction: (affair: IAffair) => affair?.description,
  },
  captureDate: {
    title: 'Fec. Captura',
    sort: false,
    valuePrepareFunction: (date: string) => new Date(date).toLocaleDateString(),
  },
  protectionKey: {
    title: 'CVE Amparo',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    sort: false,
  },
  // expedientNumber: {
  //   title: 'No. Expediente',
  //   sort: false,
  //   showAlways: true,
  // },
};

export const NOTIFICATION_ASSOCIATION_EXAMPLE_DATA = [
  {
    noVolante: 123456,
    identifica: 'ASEG',
    tipoVolante: 'P',
    asunto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    fecCaptura: new Date().toISOString(),
    cveAmparo: '',
    averPrevia: 'ASFD/DFAD',
    causaPenal: 'DFS',
    noExpediente: '123',
  },
  {
    noVolante: 123456,
    identifica: 'ASEG',
    tipoVolante: 'P',
    asunto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    fecCaptura: new Date().toISOString(),
    cveAmparo: '',
    averPrevia: 'ASFD/DFAD',
    causaPenal: 'DFS',
    noExpediente: '123',
  },
  {
    noVolante: 123456,
    identifica: 'ASEG',
    tipoVolante: 'P',
    asunto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    fecCaptura: new Date().toISOString(),
    cveAmparo: '',
    averPrevia: 'ASFD/DFAD',
    causaPenal: 'DFS',
    noExpediente: '123',
  },
  {
    noVolante: 123456,
    identifica: 'ASEG',
    tipoVolante: 'P',
    asunto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    fecCaptura: new Date().toISOString(),
    cveAmparo: '',
    averPrevia: 'ASFD/DFAD',
    causaPenal: 'DFS',
    noExpediente: '123',
  },
  {
    noVolante: 123456,
    identifica: 'ASEG',
    tipoVolante: 'P',
    asunto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    fecCaptura: new Date().toISOString(),
    cveAmparo: '',
    averPrevia: 'ASFD/DFAD',
    causaPenal: 'DFS',
    noExpediente: '123',
  },
  {
    noVolante: 123456,
    identifica: 'ASEG',
    tipoVolante: 'P',
    asunto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
    fecCaptura: new Date().toISOString(),
    cveAmparo: '',
    averPrevia: 'ASFD/DFAD',
    causaPenal: 'DFS',
    noExpediente: '123',
  },
];
