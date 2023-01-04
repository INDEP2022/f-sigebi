export const QUESTION_CATALOG_COLUMNS = {
  id: {
    title: 'No. Pregunta',
    sort: false,
  },
  text: {
    title: 'Texto de la pregunta',
    sort: false,
  },
  maximumScore: {
    title: 'Puntuación Máxima',
    sort: false,
  },
  type: {
    title: 'Tipo de pregunta',
    sort: false,
  },
};

export const RESPONSE_CATALOG_COLUMNS = {
  id: {
    title: 'No. Respuesta',
    sort: false,
  },
  idQuestion: {
    title: 'No. Pregunta',
    sort: false,
  },
  text: {
    title: 'Texto de la respuesta',
    sort: false,
  },
  startValue: {
    title: 'Valor inicial',
    sort: false,
  },
  endValue: {
    title: 'Valor final',
    sort: false,
  },
};
