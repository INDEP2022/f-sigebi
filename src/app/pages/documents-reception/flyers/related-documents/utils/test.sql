PROCEDURE PUP_PREVIEW_DATOS_CSV IS
   CONNECTION_ID       EXEC_SQL.CONNTYPE;
   BISCONNECTED        BOOLEAN;
   CURSORID            EXEC_SQL.CURSTYPE;
   LS_SQLSTR           VARCHAR2(2000);
   NIGN                PLS_INTEGER;
   LFIARCHIVO          TEXT_IO.FILE_TYPE;
   LST_ARCHIVO_DESTINO VARCHAR2(4000);
   LST_CADENA          VARCHAR2(4000);
   V_NO_BIEN           VARCHAR2(255);
   V_NO_EXPEDIENTE     VARCHAR2(255);
   VN_REGISTRO         NUMBER;
   V_VALID_BIEN        NUMBER;
   V_VALID_EXP         NUMBER;
   V_CONT              NUMBER;
BEGIN
   LST_ARCHIVO_DESTINO := 'c:\IMTMPSIAB\'||:GLOBAL.VG_DIRUSR||'\CAREXPDESAHOGO.CSV';
   GO_BLOCK('TMP_ERRORES');
   CLEAR_BLOCK(NO_COMMIT);
   DELETE FROM TMP_ERRORES WHERE ID_PROCESO = 12345;
   GO_BLOCK('TMP_EXP_DESAHOGO');
   CLEAR_BLOCK(NO_COMMIT);
   DELETE FROM TMP_EXP_DESAHOGOB;
   LIP_COMMIT_SILENCIOSO;
   BEGIN
      LFIARCHIVO := TEXT_IO.FOPEN(LST_ARCHIVO_DESTINO, 'r');
      V_CONT := 0;
      LOOP
         TEXT_IO.GET_LINE(LFIARCHIVO, LST_CADENA);
         V_CONT := V_CONT+1;
         V_NO_BIEN := GETWORDCSV( LST_CADENA , 1);
         V_NO_EXPEDIENTE := GETWORDCSV( LST_CADENA , 2);
         V_VALID_BIEN := ISNUMBER (V_NO_BIEN);
         V_VALID_EXP := ISNUMBER (V_NO_EXPEDIENTE);
         IF V_VALID_BIEN = 1 AND V_VALID_EXP = 1 THEN
            GO_BLOCK('TMP_EXP_DESAHOGO');
            IF :TMP_EXP_DESAHOGO.NO_BIEN IS NOT NULL THEN
               CREATE_RECORD;
            END IF;
            :TMP_EXP_DESAHOGO.NO_BIEN := TO_NUMBER(V_NO_BIEN,'999999999.99');
            :TMP_EXP_DESAHOGO.NO_EXPEDIENTE := TO_NUMBER(V_NO_EXPEDIENTE,'999999999.99');
         ELSE
            GO_BLOCK('TMP_ERRORES');
            IF :TMP_ERRORES.ID_PROCESO IS NOT NULL THEN
               CREATE_RECORD;
            END IF;
            :TMP_ERRORES.ID_PROCESO := 12345;
            :TMP_ERRORES.DESCRIPCION := 'REGISTRO: '||TO_CHAR(V_CONT)||',CONTENIDO: '||SUBSTR(LST_CADENA,1,1000);
         END IF;
      END LOOP;
   EXCEPTION
      WHEN NO_DATA_FOUND THEN
         TEXT_IO.FCLOSE(LFIARCHIVO);  
   END;	
   LIP_COMMIT_SILENCIOSO;
   GO_BLOCK('TMP_ERRORES');
   FIRST_RECORD;
   GO_BLOCK('TMP_EXP_DESAHOGO');
   FIRST_RECORD;
EXCEPTION
   WHEN OTHERS THEN
      LIP_MENSAJE('Error en proceso de inicialización.','S');
END;