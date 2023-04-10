/*
*PROCESO:				PB_GEN_LC;
*DESCRIPCION:		'GENERAR LCS';
*OBJETIVO: 			GENERAR LAS LC, DE ACUERDO A LOS REGISTROS DEL BLOQUE.
*/

DECLARE
	
BEGIN
	  -------------------------------------------------------------------
		--Valida Información
		-------------------------------------------------------------------
		IF :TMP_LC_COMER.ID_LOTE IS NULL THEN
				LIP_MENSAJE('No existe información para generar las LCs.','S');
				RAISE FORM_TRIGGER_FAILURE;
		END IF;	
		
		IF :TMP_LC_COMER.MONTO IS NULL THEN
				LIP_MENSAJE('No existe información para generar las LCs.','S');
				RAISE FORM_TRIGGER_FAILURE;
		END IF;	

		/*
		IF :COMER_REF_GARANTIAS.ID_LCG IS NOT NULL THEN
				LIP_MENSAJE('Ya se han generado las LCs. ','S');
				RAISE FORM_TRIGGER_FAILURE;
		END IF;
		*/
		-------------------------------------------------------------------
		
		IF PUF_MENSAJE_SI_NO('¿Generar las Líneas de Captura? ') = 'N' THEN
		  	GO_ITEM('TMP_LC_COMER.ID_EVENTO');
		    RAISE FORM_TRIGGER_FAILURE;
		ELSE
				PUP_GEN_LCS_MASIV;
				IF :BLK_CONTROL.WHEREF IS NOT NULL THEN
						PUP_GEN_CONSULTA('COMER_REF_GARANTIAS','CONSULTA',:BLK_CONTROL.WHEREF);
						PUP_GEN_CONSULTA('TMP_LC_COMER','UPDATE',:BLK_CONTROL.WHEREF);
						COMMIT;
						PUP_GEN_CONSULTA('TMP_LC_COMER','CONSULTA',:BLK_CONTROL.WHEREF);
				ELSIF :BLK_CONTROL.WHEREF IS NULL THEN	
						NULL;
				END IF;	
				LIP_COMMIT_SILENCIOSO;
		END IF;
		LIP_MENSAJE('Líneas de Captura, Proceso Terminado.','A');	
	
END;	







PROCEDURE PUP_GEN_LCS_MASIV IS

   V_CONT	          NUMBER(5);
   n_TPEVENTO       COMER_EVENTOS.ID_TPEVENTO%TYPE;
   c_DIRECCION      COMER_EVENTOS.DIRECCION%TYPE;
   n_NUM_DIAS       PLS_INTEGER;
   c_TIPO_LC        VARCHAR2 (20);
   c_TABLA_APLICA   VARCHAR2(20);
   c_IND_FEC        VARCHAR2(20);  
   c_IND_MONTO      VARCHAR2(20); 
   c_RESUL          VARCHAR2(300);
   f_FEC_FALLO      COMER_EVENTOS.FEC_FALLO%TYPE;
   l_BAN            BOOLEAN := FALSE;
BEGIN
		--V_CONT := 0;
		GO_BLOCK('TMP_LC_COMER');	
		FIRST_RECORD;
		LOOP
			  IF :TMP_LC_COMER.ESTATUS = 0 AND :TMP_LC_COMER.OBSERVACIONES IS NULL THEN
						BEGIN
								--LIP_MENSAJE('LOTE: '||:TMP_LC_COMER.ID_LOTE||', CLIENTE: '||:TMP_LC_COMER.ID_CLIENTE||', MONTO:'||:TMP_LC_COMER.MONTO||', FEC_VIG: '||TO_CHAR(:TMP_LC_COMER.FEC_VIGENCIA,'DD/MM/YYYY')||', NO_CHEQUE: '||:TMP_LC_COMER.NO_CHEQUE||', BANCO_EXP:'||:TMP_LC_COMER.BANCO_EXP_CHEQUE,'A');					
                /* >> JACG 17-04-18 Se cambia el procedimiento de generación de LC´s para priorizar la fecha capturada. */
                IF :TMP_LC_COMER.FEC_VIGENCIA IS NULL THEN
                   SELECT ID_TPEVENTO,
                          DIRECCION,
                          NVL(FEC_FALLO, FEC_EVENTO)
                     INTO n_TPEVENTO,
                          c_DIRECCION,
                          f_FEC_FALLO
                     FROM COMER_EVENTOS
                    WHERE ID_EVENTO = :TMP_LC_COMER.ID_EVENTO;
                   PK_COMER_LC.P_OBT_DATLC ('GSE',
                                            n_TPEVENTO,  
                                            c_DIRECCION,
                                            'C',
                                            n_NUM_DIAS,
                                            c_TIPO_LC,
                                            c_TABLA_APLICA,
                                            c_IND_FEC,
                                            c_IND_MONTO,
                                            c_RESUL);
                   :TMP_LC_COMER.FEC_VIGENCIA := PK_COMER_LC.OBTENER_POST_FECHA_HABIL (f_FEC_FALLO,
                                                                                       n_NUM_DIAS,
                                                                                       c_RESUL);
                   l_BAN := TRUE;
                END IF;
                PK_COMER_LC.SP_GEN_RG (:TMP_LC_COMER.ID_LOTE,
                                       :TMP_LC_COMER.ID_CLIENTE,
                                       'GSE',
                                       :TMP_LC_COMER.MONTO,
                                       'C',
                                       TO_CHAR(:TMP_LC_COMER.FEC_VIGENCIA,'DD/MM/YYYY'),
                                       :TMP_LC_COMER.NO_CHEQUE,
                                       :TMP_LC_COMER.BANCO_EXP_CHEQUE,
                                       NULL);
								/*PA_REFGARANTIAS_SPBM(
																				:TMP_LC_COMER.ID_CLIENTE,
																				:TMP_LC_COMER.ID_LOTE,
																				:TMP_LC_COMER.MONTO,
																				TO_CHAR(:TMP_LC_COMER.FEC_VIGENCIA,'DD/MM/YYYY'),
																				:TMP_LC_COMER.NO_CHEQUE,
																				:TMP_LC_COMER.BANCO_EXP_CHEQUE
								                     );*/
                /* << JACG 17-04-18 Se cambia el procedimiento de generación de LC´s para priorizar la fecha capturada. */
								SYNCHRONIZE;								                     
								--V_CONT := V_CONT+1;								                     
						EXCEPTION
								WHEN OTHERS THEN
										LIP_MENSAJE('Al generar la line de captura del lote: '||:TMP_LC_COMER.ID_LOTE||' y cliente: '||:TMP_LC_COMER.ID_CLIENTE||'. - '||SQLERRM,'S');
						END;			  					  
			  END IF;	 
 				EXIT WHEN :system.last_record = 'TRUE';	
				NEXT_RECORD;
		END LOOP;	
    IF l_BAN THEN
       LIP_COMMIT_SILENCIOSO;
    END IF;
		--:BLK_CONTROL.REG_LC_GEN := V_CONT; 		
  	
END;



PROCEDURE PUP_GEN_CONSULTA (P_TABLA VARCHAR2, P_TIPO_PROC VARCHAR2, P_WHERE VARCHAR2) IS
   OLDMSG VARCHAR2(2) := :SYSTEM.MESSAGE_LEVEL;
BEGIN

		IF P_TIPO_PROC = 'CONSULTA' THEN
        :SYSTEM.MESSAGE_LEVEL := '10';
				IF P_TABLA = 'TMP_LC_COMER' THEN 
						SET_BLOCK_PROPERTY('TMP_LC_COMER',DEFAULT_WHERE, P_WHERE);
						GO_BLOCK('TMP_LC_COMER');
						EXECUTE_QUERY;
				ELSIF P_TABLA = 'COMER_REF_GARANTIAS' THEN 
						SET_BLOCK_PROPERTY('COMER_REF_GARANTIAS',DEFAULT_WHERE, 'ESTATUS = ''GEN''
																																	    AND USER_GENERA = ''TERCERO''
																																	    AND EXISTS (SELECT    1
																																	                        FROM TMP_LC_COMER TCL
																																	                        WHERE        TCL.ID_LOTE = CRG.ID_LOTE
																																	                        AND       TCL.ID_CLIENTE = CRG.ID_CLIENTE
																																	                        AND     TCL.FEC_VIGENCIA = CRG.FEC_VIGENCIA
																																	                        AND  TRUNC(FEC_INSERT) = TRUNC(SYSDATE) 
																																	                        AND '||P_WHERE||')');
						GO_BLOCK('COMER_REF_GARANTIAS');
						EXECUTE_QUERY;
				END IF;	
        :SYSTEM.MESSAGE_LEVEL := OLDMSG;
		ELSIF P_TIPO_PROC = 'UPDATE' THEN
					PUP_EXEC_SQL('UPDATE TMP_LC_COMER TCL 
													SET ESTATUS = 1 
														WHERE ESTATUS = 0 
												    AND EXISTS (SELECT  1
												                    FROM COMER_REF_GARANTIAS CRG
												                    WHERE CRG.ID_LOTE = TCL.ID_LOTE
												                    AND CRG.NO_CHEQUE = TCL.NO_CHEQUE
												                    AND UPPER(CRG.BANCO_EXP_CHEQUE) = UPPER(TCL.BANCO_EXP_CHEQUE)   
												               ) 
														AND '||P_WHERE
											);		
					PUP_EXEC_SQL('COMMIT');				
		END IF;	

END;