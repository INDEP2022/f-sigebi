/* JACG 01-07-19 A partir de aquí, todo es nuevo. */
DECLARE
   c_MENSAJE VARCHAR2(100);
   l_BAN     BOOLEAN;
BEGIN
   IF :BLK_CONTROL.ID_EVENTO IS NULL THEN
      LIP_MENSAJE('Debe especificar el Evento.','S');  	
      RAISE FORM_TRIGGER_FAILURE;
   END IF;
   IF :BLK_CONTROL.FEC_VIGENCIA IS NOT NULL THEN
      c_MENSAJE := 'La Fecha de vigencia será '||TO_CHAR(:BLK_CONTROL.FEC_VIGENCIA,'DD/MM/YYYY')||'. ¿Continúa con la carga?';
      l_BAN     := TRUE;
   ELSE
      c_MENSAJE := 'La Fecha de vigencia se tomará de la tabla. ¿Continúa con la carga?';
      l_BAN     := FALSE;
   END IF;
   IF PUF_MENSAJE_SI_NO(c_MENSAJE) = 'N' THEN
      RAISE FORM_TRIGGER_FAILURE;
   END IF;
   PUP_CARGA_CHEQ_PORTAL(:BLK_CONTROL.ID_EVENTO, l_BAN);
   LIP_COMMIT_SILENCIOSO;
   BEGIN
      :BLK_CONTROL.WHEREF := PUF_GEN_WHERE('TMP_LC_COMER',
                                            NULL,
                                            NULL,
                                            NULL,
                                            NULL,
                                            :BLK_CONTROL.ID_OPERACION,
                                            NULL,
                                            NULL    
                                           );
   EXCEPTION
      WHEN OTHERS THEN
         LIP_MENSAJE('Error al generar la busqueda.','A');
   END;      
   SET_BLOCK_PROPERTY('TMP_LC_COMER',DELETE_ALLOWED,PROPERTY_TRUE);
   SET_BLOCK_PROPERTY('TMP_LC_COMER',UPDATE_ALLOWED,PROPERTY_TRUE);
   SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'NORMAL');
   PUP_GEN_CONSULTA('TMP_LC_COMER','CONSULTA',:BLK_CONTROL.WHEREF);
   GO_BLOCK('BLK_CIF_CHEQ_PORTAL');
   FIRST_RECORD;
   IF :BLK_CIF_CHEQ_PORTAL.CREADOPOR IS NULL THEN
      GO_BLOCK('TMP_LC_COMER');
   END IF;
   SYNCHRONIZE;
   LIP_MENSAJE('Carga de Cheques terminada.','A');
END;


--------------------------- este es el procedimiento

PROCEDURE PUP_CARGA_CHEQ_PORTAL (p_ID_EVENTO COMER_EVENTOS.ID_EVENTO%TYPE, p_FLAG BOOLEAN) IS
 -- VARIABLES --
   CONNECTION_ID      EXEC_SQL.CONNTYPE;
   BISCONNECTED       BOOLEAN;
   CURSORID           EXEC_SQL.CURSTYPE;
   LS_SQLSTR          VARCHAR2(3100);
   NIGN               PLS_INTEGER;
   b_INSERT           BOOLEAN := TRUE;
   b_FLAG             BOOLEAN;  -- BANDERA QUE INDICA SI SE UTILIZA LA FECHA DADA POR EL USUARIO (TRUE) O LA LEÍDA DEL ARCHIVO (FALSE) 
   
   RFC                VARCHAR2(20);
   PALETAID           VARCHAR2(10);
   EVENTO             VARCHAR2(7);
   LOTE               VARCHAR2(8);
   MONTO_IN           VARCHAR2(17);
   NO_CHEQUE_IN       VARCHAR2(15);
   EXP_CHEQUE_IN      VARCHAR2(30);
   FECVIGENCIA_IN     VARCHAR2(10);
   CREADOPOR          VARCHAR2(50);

   n_ID_CLIENTE       COMER_CLIENTES.ID_CLIENTE%TYPE; 
   c_RFC              COMER_CLIENTES.RFC%TYPE;
   n_PALETAID         TMP_LC_COMER.ID_PALETA%TYPE;
   n_EVENTO           COMER_EVENTOS.ID_EVENTO%TYPE;
   n_LOTE             COMER_LOTES.LOTE_PUBLICO%TYPE;
   n_ID_LOTE          COMER_LOTES.ID_LOTE%TYPE;
   n_MONTO_IN         TMP_LC_COMER.MONTO%TYPE;
   n_NO_CHEQUE_IN     TMP_LC_COMER.NO_CHEQUE%TYPE;
   c_EXP_CHEQUE_IN    TMP_LC_COMER.BANCO_EXP_CHEQUE%TYPE;
   f_FECVIGENCIA_IN   TMP_LC_COMER.FEC_VIGENCIA%TYPE;
   n_ID_EVENTO_LOC    COMER_EVENTOS.ID_EVENTO%TYPE;
   n_ID_OPERACION     TMP_LC_COMER.ID_OPERACION%TYPE;
   c_CREADOPOR        VARCHAR2(50);
   l_BAN              BOOLEAN;
  


   PROCEDURE CHECA_CONEXION IS
   BEGIN
      LOOP
         IF BISCONNECTED THEN
            EXIT;
         ELSE
            --CONNECTION_ID := EXEC_SQL.OPEN_CONNECTION ('IZQSIAB/izsiab@odbc:Subastas'); -- conexion de pruebas
            CONNECTION_ID := EXEC_SQL.OPEN_CONNECTION ('UserSIABSubastas/Sub4st4sS14B@odbc:Subastas');
            BISCONNECTED := EXEC_SQL.IS_CONNECTED (CONNECTION_ID);
            IF BISCONNECTED THEN
               CURSORID := EXEC_SQL.OPEN_CURSOR (CONNECTION_ID);
            END IF;
         END IF;
      END LOOP; 
   END CHECA_CONEXION;
BEGIN
   SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'BUSY');
   n_ID_EVENTO_LOC := p_ID_EVENTO;
   b_FLAG := p_FLAG; 
   n_ID_OPERACION := PUF_OBT_CONSEC_OPER;
   :BLK_CONTROL.ID_OPERACION      := n_ID_OPERACION;
   :BLK_CONTROL.ID_OPERACION_PROC := n_ID_OPERACION;
   GO_BLOCK('TMP_LC_COMER');
   CLEAR_BLOCK;
   GO_BLOCK('BLK_CIF_CHEQ_PORTAL');
   CLEAR_BLOCK;
   BEGIN
      IF n_ID_EVENTO_LOC IS NOT NULL THEN
         --CONNECTION_ID := EXEC_SQL.OPEN_CONNECTION ('IZQSIAB/izsiab@odbc:Subastas');  -- Conexion de Pruebas
         CONNECTION_ID := EXEC_SQL.OPEN_CONNECTION ('UserSIABSubastas/Sub4st4sS14B@odbc:Subastas');
         BISCONNECTED  := EXEC_SQL.IS_CONNECTED(CONNECTION_ID);
         IF BISCONNECTED THEN
            CURSORID := EXEC_SQL.OPEN_CURSOR(CONNECTION_ID);
            LS_SQLSTR := 'SELECT RFC, PALETAID, EVENTO, LOTE, SUM(MONTO_IN) MONTO_IN, NO_CHEQUE_IN, EXP_CHEQUE_IN, CONVERT(VARCHAR(10),CONVERT(DATE,FECVIGENCIA_IN,106),103) AS FECVIGENCIA_IN, CreadoPor FROM VW_GetChequeLC WHERE EVENTO = '||TO_CHAR(n_ID_EVENTO_LOC)||' GROUP BY RFC, PALETAID, EVENTO, LOTE, NO_CHEQUE_IN, EXP_CHEQUE_IN, CONVERT(VARCHAR(10),CONVERT(DATE,FECVIGENCIA_IN,106),103), CreadoPor';
            CHECA_CONEXION;
            EXEC_SQL.PARSE(CONNECTION_ID, CURSORID, LS_SQLSTR);
            EXEC_SQL.DEFINE_COLUMN(CONNECTION_ID, CURSORID, 1,  RFC, 20);
            EXEC_SQL.DEFINE_COLUMN(CONNECTION_ID, CURSORID, 2,  PALETAID, 10);
            EXEC_SQL.DEFINE_COLUMN(CONNECTION_ID, CURSORID, 3,  EVENTO, 7);
            EXEC_SQL.DEFINE_COLUMN(CONNECTION_ID, CURSORID, 4,  LOTE, 8);
            EXEC_SQL.DEFINE_COLUMN(CONNECTION_ID, CURSORID, 5,  MONTO_IN, 17);
            EXEC_SQL.DEFINE_COLUMN(CONNECTION_ID, CURSORID, 6,  NO_CHEQUE_IN, 15);
            EXEC_SQL.DEFINE_COLUMN(CONNECTION_ID, CURSORID, 7,  EXP_CHEQUE_IN, 30);
            EXEC_SQL.DEFINE_COLUMN(CONNECTION_ID, CURSORID, 8,  FECVIGENCIA_IN, 10);
            EXEC_SQL.DEFINE_COLUMN(CONNECTION_ID, CURSORID, 9,  CREADOPOR, 50);
            NIGN := EXEC_SQL.EXECUTE(CONNECTION_ID, CURSORID);
            WHILE (EXEC_SQL.FETCH_ROWS(CONNECTION_ID, CURSORID) > 0) LOOP
                   EXEC_SQL.COLUMN_VALUE(CONNECTION_ID, CURSORID,  1, RFC);
                   EXEC_SQL.COLUMN_VALUE(CONNECTION_ID, CURSORID,  2, PALETAID);
                   EXEC_SQL.COLUMN_VALUE(CONNECTION_ID, CURSORID,  3, EVENTO);
                   EXEC_SQL.COLUMN_VALUE(CONNECTION_ID, CURSORID,  4, LOTE);
                   EXEC_SQL.COLUMN_VALUE(CONNECTION_ID, CURSORID,  5, MONTO_IN);
                   EXEC_SQL.COLUMN_VALUE(CONNECTION_ID, CURSORID,  6, NO_CHEQUE_IN);
                   EXEC_SQL.COLUMN_VALUE(CONNECTION_ID, CURSORID,  7, EXP_CHEQUE_IN);
                   EXEC_SQL.COLUMN_VALUE(CONNECTION_ID, CURSORID,  8, FECVIGENCIA_IN);
                   EXEC_SQL.COLUMN_VALUE(CONNECTION_ID, CURSORID,  9, CREADOPOR);
               c_RFC            := RFC;
               n_PALETAID       := TO_NUMBER(PALETAID);
               n_EVENTO         := TO_NUMBER(EVENTO);
               n_LOTE           := TO_NUMBER(LOTE);
               n_MONTO_IN       := TO_NUMBER(MONTO_IN);
               n_NO_CHEQUE_IN   := TO_NUMBER(NO_CHEQUE_IN);
               c_EXP_CHEQUE_IN  := EXP_CHEQUE_IN;
               f_FECVIGENCIA_IN := TO_DATE(FECVIGENCIA_IN,'DD/MM/YYYY');
               c_CREADOPOR      := SUBSTR(CREADOPOR, INSTR(CREADOPOR,'\') + 1, LENGTH(CREADOPOR) - INSTR(CREADOPOR,'\'));
               IF c_CREADOPOR LIKE 'subastador%' THEN
                  c_CREADOPOR := 'subastador';
               END IF;
               BEGIN
                  SELECT ID_CLIENTE
                    INTO n_ID_CLIENTE
                    FROM COMER_CLIENTES
                   WHERE RFC = c_RFC;
                  BEGIN
                     SELECT ID_LOTE
                       INTO n_ID_LOTE
                       FROM COMER_LOTES
                      WHERE ID_EVENTO = n_EVENTO
                        AND LOTE_PUBLICO = n_LOTE;
                     b_INSERT := TRUE;
                  EXCEPTION
                     WHEN OTHERS THEN
                        LIP_MENSAJE('Lote inexistente ('||TO_CHAR(n_LOTE)||')','S');
                        b_INSERT := FALSE;
                  END;
               EXCEPTION
                  WHEN OTHERS THEN
                     LIP_MENSAJE('R.F.C inexistente ('||c_RFC||')','S');
                     b_INSERT := FALSE;
               END;
               IF b_INSERT THEN
                  /* Se determina que fecha será usada */
                  IF b_FLAG THEN
                     f_FECVIGENCIA_IN := :BLK_CONTROL.FEC_VIGENCIA; 
                  END IF;
                  BEGIN
                     INSERT INTO TMP_LC_COMER (ID_OPERACION,
                                               ID_CLIENTE, 
                                               ID_PALETA,
                                               ID_LOTE, 
                                               MONTO, 
                                               NO_CHEQUE,
                                               BANCO_EXP_CHEQUE,
                                               FEC_VIGENCIA
                                              )
                                       VALUES (n_ID_OPERACION,
                                               n_ID_CLIENTE,
                                               n_PALETAID,
                                               n_ID_LOTE,
                                               n_MONTO_IN,
                                               n_NO_CHEQUE_IN,
                                               c_EXP_CHEQUE_IN,
                                               f_FECVIGENCIA_IN);
                     UPDATE TMP_LC_COMER
                        SET USR_INSERT = c_CREADOPOR
                      WHERE ID_LOTE = n_ID_LOTE
                        AND NO_CHEQUE = n_NO_CHEQUE_IN
                        AND BANCO_EXP_CHEQUE = c_EXP_CHEQUE_IN;
                     l_BAN := TRUE;
                     FIRST_RECORD;
                     IF :BLK_CIF_CHEQ_PORTAL.CREADOPOR IS NOT NULL THEN
                        LOOP
                           IF :BLK_CIF_CHEQ_PORTAL.CREADOPOR = c_CREADOPOR THEN
                              :BLK_CIF_CHEQ_PORTAL.NUM_REGISTROS := :BLK_CIF_CHEQ_PORTAL.NUM_REGISTROS + 1; 
                              :BLK_CIF_CHEQ_PORTAL.IMPORTE := :BLK_CIF_CHEQ_PORTAL.IMPORTE + n_MONTO_IN;
                              l_BAN := FALSE;
                              EXIT;
                           END IF;
                           EXIT WHEN :SYSTEM.LAST_RECORD = 'TRUE';
                           NEXT_RECORD;
                        END LOOP;
                     END IF;
                     IF l_BAN THEN
                        IF :BLK_CIF_CHEQ_PORTAL.CREADOPOR IS NOT NULL THEN
                           CREATE_RECORD;
                        END IF;
                        :BLK_CIF_CHEQ_PORTAL.CREADOPOR := c_CREADOPOR;
                        :BLK_CIF_CHEQ_PORTAL.NUM_REGISTROS := 1; 
                        :BLK_CIF_CHEQ_PORTAL.IMPORTE := n_MONTO_IN;
                     END IF;
                     --SYNCHRONIZE;
                  EXCEPTION
                     WHEN OTHERS THEN
                        LIP_MENSAJE(SQLERRM||', Al Insertar Lote: '||TO_CHAR(n_LOTE)||', Cheque: '||n_NO_CHEQUE_IN,'S');
                  END; 
               END IF;
            END LOOP;   
         ELSE
            SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
            LIP_MENSAJE('ERROR EN LA CONEXION A SIRSAE','S');
         END IF;
      END IF;
      SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
   EXCEPTION 
      WHEN EXEC_SQL.PACKAGE_ERROR THEN
         SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
         LIP_MENSAJE('ERROR1 '||EXEC_SQL.LAST_ERROR_MESG(CONNECTION_ID)||' ('||TO_CHAR(n_EVENTO)||')','S');
      WHEN OTHERS THEN
         SET_APPLICATION_PROPERTY(CURSOR_STYLE, 'DEFAULT');
         LIP_MENSAJE('ERROR2 '|| DBMS_ERROR_TEXT||' ('||TO_CHAR(n_EVENTO)||')','S');
   END;
END;


FUNCTION PUF_OBT_CONSEC_OPER RETURN NUMBER IS

		V_CONSEC NUMBER(10);

BEGIN
		
		SELECT  NVL(MAX(ID_OPERACION),0) +1
		INTO V_CONSEC
    		FROM TMP_LC_COMER;
		
		RETURN V_CONSEC;
		
END;