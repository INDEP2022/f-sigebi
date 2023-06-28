PROCEDURE P_ELIMINA_BIENES_DICTAMEN IS
	
VA_ESTATUS_VAL		NUMBER;
VA_ESTATUS		VARCHAR2(3);

BEGIN  
  
   BEGIN
	    GO_BLOCK('TMP_EXP_DESAHOGO');			
			FIRST_RECORD;						
	  		  LOOP
				     BEGIN
      			    SELECT COUNT(0)
        					INTO VA_ESTATUS_VAL
  		  					FROM HISTORICO_ESTATUS_BIEN HEB, BIENES B
   		 					 WHERE HEB.NO_BIEN = B.NO_BIEN
     		 					 AND HEB.NO_REGISTRO = (SELECT MAX(NO_REGISTRO)
                   					                FROM HISTORICO_ESTATUS_BIEN
                       										 WHERE NO_BIEN = B.NO_BIEN
                                   					 AND ESTATUS != (SELECT ESTATUS 
                                             					         FROM BIENES 
                                                    					WHERE NO_BIEN = B.NO_BIEN))
         					 AND B.NO_BIEN = :TMP_EXP_DESAHOGO.no_bien
         					 AND EXISTS (SELECT 1
         					 					     FROM ESTATUS_X_PANTALLA
                      					WHERE ESTATUS = HEB.ESTATUS
                        					AND CVE_PANTALLA = 'FACTJURDICTAMASG'); 
   					 EXCEPTION
   					    WHEN OTHERS THEN
   					    LIP_MENSAJE('VERIFICA '||SQLERRM,'S');
   					 END;
				
	              IF VA_ESTATUS_VAL = 0 THEN		   	
	 	               LIP_MENSAJE('EL ESTATUS ANTERIOR DEL BIEN '||:TMP_EXP_DESAHOGO.no_bien||' NO CORRESPONDE A UN ESTATUS DE DICTAMINACION','S');
	 	               RAISE FORM_TRIGGER_FAILURE;
	              END IF;
					NEXT_RECORD;	              
	        EXIT WHEN :system.last_record = 'TRUE';
	        END LOOP;
	 END;

  GO_BLOCK('TMP_EXP_DESAHOGO');
  FIRST_RECORD;
  
   LOOP   	
			  -- Eliminacion de los bienes del Dictamen
			  DELETE DOCUMENTOS_DICTAMEN_X_BIEN_M
				WHERE  no_bien = :TMP_EXP_DESAHOGO.no_bien
				AND	   tipo_dictaminacion = 'PROCEDENCIA';
				
				DELETE DICTAMINACION_X_BIEN1
				WHERE  no_bien = :TMP_EXP_DESAHOGO.no_bien
				AND	   tipo_dictaminacion = 'PROCEDENCIA';
				
				-- Actualizar el Estatus de los bienes eliminados.
								
       BEGIN
                SELECT HEB.ESTATUS
                  INTO VA_ESTATUS
  								FROM HISTORICO_ESTATUS_BIEN HEB, BIENES B
   							 WHERE HEB.NO_BIEN = B.NO_BIEN
     							 AND HEB.NO_REGISTRO = (SELECT MAX(NO_REGISTRO)
                                            FROM HISTORICO_ESTATUS_BIEN
                       										WHERE NO_BIEN = B.NO_BIEN
                                            AND ESTATUS != (SELECT ESTATUS 
                                                              FROM BIENES 
                                                             WHERE NO_BIEN = B.NO_BIEN))
                   AND B.NO_BIEN = :TMP_EXP_DESAHOGO.no_bien; 
             
                		 
								UPDATE BIENES 
									 SET estatus = VA_ESTATUS
								 WHERE no_bien = :TMP_EXP_DESAHOGO.no_bien;
       EXCEPTION
       	WHEN OTHERS THEN 
       	   LIP_MENSAJE('PROBLEMAS PARA REGRESAR AL ESTATUS ANTERIOR'||SQLERRM,'S');
			 END;	
			
				DELETE_RECORD;
				--NEXT_RECORD;					    
		    IF :TMP_EXP_DESAHOGO.No_Bien IS NULL  THEN
			     LIP_MENSAJE('Proceso Terminado','A');
			     LIP_COMMIT_SILENCIOSO;
		       PUP_Inicializa_Forma;
	  	   	EXIT;
		    END IF; 
  END LOOP;
END;



















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
   LST_ARCHIVO_DESTINO := 'c:\IMTMPSIAB\'
      ||:GLOBAL.VG_DIRUSR
      ||'\CAREXPDESAHOGO.CSV';
   GO_BLOCK('TMP_ERRORES');
   CLEAR_BLOCK(NO_COMMIT);
   DELETE FROM TMP_ERRORES
   WHERE
      ID_PROCESO = 12345;
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
         V_NO_BIEN := GETWORDCSV( LST_CADENA, 1);
         V_NO_EXPEDIENTE := GETWORDCSV( LST_CADENA, 2);
         V_VALID_BIEN := ISNUMBER (V_NO_BIEN);
         V_VALID_EXP := ISNUMBER (V_NO_EXPEDIENTE);
         IF V_VALID_BIEN = 1 AND V_VALID_EXP = 1 THEN
            GO_BLOCK('TMP_EXP_DESAHOGO');
            IF :TMP_EXP_DESAHOGO.NO_BIEN IS NOT NULL THEN
               CREATE_RECORD;
            END IF;
            :TMP_EXP_DESAHOGO.NO_BIEN := TO_NUMBER(V_NO_BIEN, '999999999.99');
            :TMP_EXP_DESAHOGO.NO_EXPEDIENTE := TO_NUMBER(V_NO_EXPEDIENTE, '999999999.99');
         ELSE
            GO_BLOCK('TMP_ERRORES');
            IF :TMP_ERRORES.ID_PROCESO IS NOT NULL THEN
               CREATE_RECORD;
            END IF;
            :TMP_ERRORES.ID_PROCESO := 12345;
            :TMP_ERRORES.DESCRIPCION := 'REGISTRO: '
               ||TO_CHAR(V_CONT)
               ||',CONTENIDO: '
               ||SUBSTR(LST_CADENA, 1, 1000);
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

















