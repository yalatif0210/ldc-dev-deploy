--
-- TOC entry 4991 (class 0 OID 17298)
-- Dependencies: 240
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.role (id, role) VALUES (1, 'SUPER_ADMIN');
INSERT INTO public.role (id, role) VALUES (2, 'ADMIN');
INSERT INTO public.role (id, role) VALUES (3, 'SUPERVISOR');
INSERT INTO public.role (id, role) VALUES (4, 'LABORATORY_USER');
INSERT INTO public.role (id, role) VALUES (5, 'PHARMACY_USER');


--
-- TOC entry 4989 (class 0 OID 17280)
-- Dependencies: 238
-- Data for Name: region; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.region (id, name) VALUES (1, 'ABIDJAN 1');
INSERT INTO public.region (id, name) VALUES (2, 'ABIDJAN 2');
INSERT INTO public.region (id, name) VALUES (3, 'AGNEBY-TIASSA');
INSERT INTO public.region (id, name) VALUES (4, 'BAFING');
INSERT INTO public.region (id, name) VALUES (5, 'BAGOUE');
INSERT INTO public.region (id, name) VALUES (6, 'BELIER');
INSERT INTO public.region (id, name) VALUES (7, 'BERE');
INSERT INTO public.region (id, name) VALUES (8, 'BOUNKANI');
INSERT INTO public.region (id, name) VALUES (9, 'CAVALLY');
INSERT INTO public.region (id, name) VALUES (10, 'FOLON');
INSERT INTO public.region (id, name) VALUES (11, 'GBEKE');
INSERT INTO public.region (id, name) VALUES (12, 'GBOKLE');
INSERT INTO public.region (id, name) VALUES (13, 'GOH');
INSERT INTO public.region (id, name) VALUES (14, 'GONTOUGO');
INSERT INTO public.region (id, name) VALUES (15, 'GRANDS PONTS');
INSERT INTO public.region (id, name) VALUES (16, 'GUEMON');
INSERT INTO public.region (id, name) VALUES (17, 'HAMBOL');
INSERT INTO public.region (id, name) VALUES (18, 'HAUT-SASSANDRA');
INSERT INTO public.region (id, name) VALUES (19, 'IFFOU');
INSERT INTO public.region (id, name) VALUES (20, 'INDENIE-DJUABLIN');
INSERT INTO public.region (id, name) VALUES (21, 'KABADOUGOU');
INSERT INTO public.region (id, name) VALUES (22, 'LOH-DJIBOUA');
INSERT INTO public.region (id, name) VALUES (23, 'MARAHOUE');
INSERT INTO public.region (id, name) VALUES (24, 'ME');
INSERT INTO public.region (id, name) VALUES (25, 'MORONOU');
INSERT INTO public.region (id, name) VALUES (26, 'NAWA');
INSERT INTO public.region (id, name) VALUES (27, 'N''ZI');
INSERT INTO public.region (id, name) VALUES (28, 'PORO');
INSERT INTO public.region (id, name) VALUES (29, 'SAN PEDRO');
INSERT INTO public.region (id, name) VALUES (30, 'SUD-COMOE');
INSERT INTO public.region (id, name) VALUES (31, 'TCHOLOGO');
INSERT INTO public.region (id, name) VALUES (32, 'TONKPI');
INSERT INTO public.region (id, name) VALUES (33, 'WORODOUGOU');


--
-- TOC entry 4969 (class 0 OID 17205)
-- Dependencies: 218
-- Data for Name: district; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.district (id, name, region_id) VALUES (1, 'ABOBO-EST', 1);
INSERT INTO public.district (id, name, region_id) VALUES (2, 'ABOBO-OUEST', 1);
INSERT INTO public.district (id, name, region_id) VALUES (3, 'ANYAMA', 1);
INSERT INTO public.district (id, name, region_id) VALUES (4, 'YOPOUGON-EST', 1);
INSERT INTO public.district (id, name, region_id) VALUES (5, 'YOPOUGON-OUEST-SONGON', 1);
INSERT INTO public.district (id, name, region_id) VALUES (6, 'ADJAME-PLATEAU-ATTECOUBE', 2);
INSERT INTO public.district (id, name, region_id) VALUES (7, 'COCODY-BINGERVILLE', 2);
INSERT INTO public.district (id, name, region_id) VALUES (8, 'KOUMASSI', 2);
INSERT INTO public.district (id, name, region_id) VALUES (9, 'PORT BOUET-VRIDI', 2);
INSERT INTO public.district (id, name, region_id) VALUES (10, 'TREICHVILLE-MARCORY', 2);
INSERT INTO public.district (id, name, region_id) VALUES (11, 'AGBOVILLE', 3);
INSERT INTO public.district (id, name, region_id) VALUES (12, 'SIKENSI', 3);
INSERT INTO public.district (id, name, region_id) VALUES (13, 'TIASSALE', 3);
INSERT INTO public.district (id, name, region_id) VALUES (14, 'KORO', 4);
INSERT INTO public.district (id, name, region_id) VALUES (15, 'OUANINOU', 4);
INSERT INTO public.district (id, name, region_id) VALUES (16, 'TOUBA', 4);
INSERT INTO public.district (id, name, region_id) VALUES (17, 'BOUNDIALI', 5);
INSERT INTO public.district (id, name, region_id) VALUES (18, 'KOUTO', 5);
INSERT INTO public.district (id, name, region_id) VALUES (19, 'TENGRELA', 5);
INSERT INTO public.district (id, name, region_id) VALUES (20, 'DIDIEVI', 6);
INSERT INTO public.district (id, name, region_id) VALUES (21, 'TIEBISSOU', 6);
INSERT INTO public.district (id, name, region_id) VALUES (22, 'TOUMODI', 6);
INSERT INTO public.district (id, name, region_id) VALUES (23, 'YAMOUSSOUKRO', 6);
INSERT INTO public.district (id, name, region_id) VALUES (24, 'DIANRA', 7);
INSERT INTO public.district (id, name, region_id) VALUES (25, 'KOUNAHIRI', 7);
INSERT INTO public.district (id, name, region_id) VALUES (26, 'MANKONO', 7);
INSERT INTO public.district (id, name, region_id) VALUES (27, 'BOUNA', 8);
INSERT INTO public.district (id, name, region_id) VALUES (28, 'DOROPO', 8);
INSERT INTO public.district (id, name, region_id) VALUES (29, 'NASSIAN', 8);
INSERT INTO public.district (id, name, region_id) VALUES (30, 'TEHINI', 8);
INSERT INTO public.district (id, name, region_id) VALUES (31, 'TRANSUA', 8);
INSERT INTO public.district (id, name, region_id) VALUES (32, 'BLOLEQUIN', 9);
INSERT INTO public.district (id, name, region_id) VALUES (33, 'GUIGLO', 9);
INSERT INTO public.district (id, name, region_id) VALUES (34, 'TAI', 9);
INSERT INTO public.district (id, name, region_id) VALUES (35, 'TOULEPLEU', 9);
INSERT INTO public.district (id, name, region_id) VALUES (36, 'KANIASSO', 10);
INSERT INTO public.district (id, name, region_id) VALUES (37, 'MINIGNAN', 10);
INSERT INTO public.district (id, name, region_id) VALUES (38, 'BEOUMI', 11);
INSERT INTO public.district (id, name, region_id) VALUES (39, 'BOTRO', 11);
INSERT INTO public.district (id, name, region_id) VALUES (40, 'BOUAKE NORD-EST', 11);
INSERT INTO public.district (id, name, region_id) VALUES (41, 'BOUAKE NORD-OUEST', 11);
INSERT INTO public.district (id, name, region_id) VALUES (42, 'BOUAKE SUD', 11);
INSERT INTO public.district (id, name, region_id) VALUES (43, 'SAKASSOU', 11);
INSERT INTO public.district (id, name, region_id) VALUES (44, 'FRESCO', 12);
INSERT INTO public.district (id, name, region_id) VALUES (45, 'SASSANDRA', 12);
INSERT INTO public.district (id, name, region_id) VALUES (46, 'GAGNOA 1', 13);
INSERT INTO public.district (id, name, region_id) VALUES (47, 'GAGNOA 2', 13);
INSERT INTO public.district (id, name, region_id) VALUES (48, 'OUME', 13);
INSERT INTO public.district (id, name, region_id) VALUES (49, 'BONDOUKOU', 14);
INSERT INTO public.district (id, name, region_id) VALUES (50, 'KOUN FAO', 14);
INSERT INTO public.district (id, name, region_id) VALUES (51, 'SANDEGUE', 14);
INSERT INTO public.district (id, name, region_id) VALUES (52, 'TANDA', 14);
INSERT INTO public.district (id, name, region_id) VALUES (53, 'DABOU', 15);
INSERT INTO public.district (id, name, region_id) VALUES (54, 'GRAND-LAHOU', 15);
INSERT INTO public.district (id, name, region_id) VALUES (55, 'JACQUEVILLE', 15);
INSERT INTO public.district (id, name, region_id) VALUES (56, 'BANGOLO', 16);
INSERT INTO public.district (id, name, region_id) VALUES (57, 'DUEKOUE', 16);
INSERT INTO public.district (id, name, region_id) VALUES (58, 'KOUIBLY', 16);
INSERT INTO public.district (id, name, region_id) VALUES (59, 'DABAKALA', 17);
INSERT INTO public.district (id, name, region_id) VALUES (60, 'KATIOLA', 17);
INSERT INTO public.district (id, name, region_id) VALUES (61, 'NIAKARAMADOUGOU', 17);
INSERT INTO public.district (id, name, region_id) VALUES (62, 'DALOA', 18);
INSERT INTO public.district (id, name, region_id) VALUES (63, 'ISSIA', 18);
INSERT INTO public.district (id, name, region_id) VALUES (64, 'VAVOUA', 18);
INSERT INTO public.district (id, name, region_id) VALUES (65, 'ZOUKOUGBEU', 18);
INSERT INTO public.district (id, name, region_id) VALUES (66, 'DAOUKRO', 19);
INSERT INTO public.district (id, name, region_id) VALUES (67, 'M''BAHIAKRO', 19);
INSERT INTO public.district (id, name, region_id) VALUES (68, 'PRIKRO', 19);
INSERT INTO public.district (id, name, region_id) VALUES (69, 'ABENGOUROU', 20);
INSERT INTO public.district (id, name, region_id) VALUES (70, 'AGNIBILEKROU', 20);
INSERT INTO public.district (id, name, region_id) VALUES (71, 'BETTIE', 20);
INSERT INTO public.district (id, name, region_id) VALUES (72, 'MADINANI', 21);
INSERT INTO public.district (id, name, region_id) VALUES (73, 'ODIENNE', 21);
INSERT INTO public.district (id, name, region_id) VALUES (74, 'DIVO', 22);
INSERT INTO public.district (id, name, region_id) VALUES (75, 'GUITRY', 22);
INSERT INTO public.district (id, name, region_id) VALUES (76, 'LAKOTA', 22);
INSERT INTO public.district (id, name, region_id) VALUES (77, 'BOUAFLE', 23);
INSERT INTO public.district (id, name, region_id) VALUES (78, 'SINFRA', 23);
INSERT INTO public.district (id, name, region_id) VALUES (79, 'ZUENOULA', 23);
INSERT INTO public.district (id, name, region_id) VALUES (80, 'ADZOPE', 24);
INSERT INTO public.district (id, name, region_id) VALUES (81, 'AKOUPE', 24);
INSERT INTO public.district (id, name, region_id) VALUES (82, 'ALEPE', 24);
INSERT INTO public.district (id, name, region_id) VALUES (83, 'YAKASSE-ATTOBROU', 24);
INSERT INTO public.district (id, name, region_id) VALUES (84, 'ARRAH', 25);
INSERT INTO public.district (id, name, region_id) VALUES (85, 'BONGOUANOU', 25);
INSERT INTO public.district (id, name, region_id) VALUES (86, 'M''BATTO', 25);
INSERT INTO public.district (id, name, region_id) VALUES (87, 'BUYO', 26);
INSERT INTO public.district (id, name, region_id) VALUES (88, 'GUEYO', 26);
INSERT INTO public.district (id, name, region_id) VALUES (89, 'MEAGUI', 26);
INSERT INTO public.district (id, name, region_id) VALUES (90, 'SOUBRE', 26);
INSERT INTO public.district (id, name, region_id) VALUES (91, 'BOCANDA', 27);
INSERT INTO public.district (id, name, region_id) VALUES (92, 'DIMBOKRO', 27);
INSERT INTO public.district (id, name, region_id) VALUES (93, 'KOUASSI KOUASSIKRO', 27);
INSERT INTO public.district (id, name, region_id) VALUES (94, 'DIKODOUGOU', 28);
INSERT INTO public.district (id, name, region_id) VALUES (95, 'KORHOGO 1', 28);
INSERT INTO public.district (id, name, region_id) VALUES (96, 'KORHOGO 2', 28);
INSERT INTO public.district (id, name, region_id) VALUES (97, 'M''BENGUE', 28);
INSERT INTO public.district (id, name, region_id) VALUES (98, 'SINEMATIALI', 28);
INSERT INTO public.district (id, name, region_id) VALUES (99, 'SAN PEDRO', 29);
INSERT INTO public.district (id, name, region_id) VALUES (100, 'TABOU', 29);
INSERT INTO public.district (id, name, region_id) VALUES (101, 'ABOISSO', 30);
INSERT INTO public.district (id, name, region_id) VALUES (102, 'ADIAKE', 30);
INSERT INTO public.district (id, name, region_id) VALUES (103, 'GRAND-BASSAM', 30);
INSERT INTO public.district (id, name, region_id) VALUES (104, 'TIAPOUM', 30);
INSERT INTO public.district (id, name, region_id) VALUES (105, 'FERKESSEDOUGOU', 31);
INSERT INTO public.district (id, name, region_id) VALUES (106, 'KONG', 31);
INSERT INTO public.district (id, name, region_id) VALUES (107, 'OUANGOLODOUGOU', 31);
INSERT INTO public.district (id, name, region_id) VALUES (108, 'BIANKOUMA', 32);
INSERT INTO public.district (id, name, region_id) VALUES (109, 'DANANE', 32);
INSERT INTO public.district (id, name, region_id) VALUES (110, 'MAN', 32);
INSERT INTO public.district (id, name, region_id) VALUES (111, 'ZOUAN-HOUNIEN', 32);
INSERT INTO public.district (id, name, region_id) VALUES (112, 'KANI', 33);
INSERT INTO public.district (id, name, region_id) VALUES (113, 'SEGUELA', 33);


--
-- TOC entry 4993 (class 0 OID 17304)
-- Dependencies: 242
-- Data for Name: structure; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.structure (id, active, code, name, district_id) VALUES (1, false, 30300010, 'CHR ABOBO', 1);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (2, false, 60300500, 'CSU COM ABOBO BANCO SUD', 1);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (3, false, 60300510, 'CSU COM ABOBO BC', 1);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (4, false, 60300150, 'CSU COM KENNEDY', 1);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (5, false, 60300220, 'FSU COM ABOBO AKEIKOI', 1);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (6, false, 60300230, 'FSU COM ABOBO AVOCATIER', 1);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (7, false, 60300250, 'FSU COM ABOBO-BAOULE', 1);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (8, false, 60300490, 'CSU COM ASSOMIN', 2);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (9, false, 60300120, 'CSU COM BOCABO', 2);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (10, false, 60300130, 'CSU COM CARREFOUR PK 18 AGOUETO', 2);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (11, false, 50300020, 'DISTRICT SANITAIRE ABOBO OUEST', 2);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (12, false, 60300240, 'FSU COM ABOBO SAGBE', 2);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (13, false, 60300260, 'FSU COM ANONKOUA-KOUTE', 2);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (14, false, 50300040, 'DISTRICT SANITAIRE ANYAMA', 3);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (15, false, 40300030, 'HOPITAL GENERAL ANYAMA', 3);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (16, false, 50200050, 'DISTRICT SANITAIRE YOPOUGON EST', 4);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (17, false, 60200050, 'FSU COM ANDOKOI', 4);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (18, false, 60200060, 'FSU COM KOWEIT', 4);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (19, false, 60200070, 'FSU COM YOPOUGON ATTIE-OUASSAKARA', 4);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (20, false, 60200120, 'FSU COM YOPOUGON TOIT ROUGE', 4);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (21, false, 60200210, 'CSU COM AZITO', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (22, false, 60200160, 'CSU SONGON KASSEMBLE', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (23, false, 50200060, 'DISTRICT SANITAIRE YOPOUGON OUEST SONGON', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (24, false, 40200040, 'HOPITAL GENERAL YOPOUGON ATTIE', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (25, false, 60300060, 'CSU COM AGBAN VILLAGE', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (26, false, 60300200, 'CSU COM WILLIAMSVILLE', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (27, false, 50300030, 'DISTRICT SANITAIRE ADJAME PLATEAU ATTECOUBE', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (28, false, 60300350, 'FSU ABOBO DOUME', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (29, false, 60300370, 'FSU ATTECOUBE CENTRE', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (30, false, 60300410, 'FSU EDMOND BASQUE ( PLATEAU)', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (31, false, 60300420, 'FSU LOCODJORO', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (32, false, 60300430, 'FSU WILLIAMSVILLE', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (33, false, 40300020, 'HOPITAL GENERAL ADJAME', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (34, false, 20300060, 'INSTITUT NATIONAL DE LA SANTE PUBLIQUE', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (35, false, 80300940, 'ASAPSU (1) ASS.SOUTIEN.AUTOPROMO.SANIT', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (36, false, 10300010, 'CHU ANGRE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (37, false, 60300090, 'CSU COM ANGRE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (38, false, 60300100, 'CSU COM ANONO VILLAGE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (39, false, 60300170, 'CSU COM PALMERAIE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (40, false, 50300050, 'DISTRICT SANITAIRE COCODY BINGERVILLE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (41, false, 60300380, 'FSU BLOCKHAUSS', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (42, false, 60300400, 'FSU COCODY PMI', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (43, false, 40300040, 'HOPITAL GENERAL BINGERVILLE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (44, false, 60300470, 'PMI COMBES-BINGERVILLE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (45, false, 50200040, 'DISTRICT SANITAIRE KOUMASSI', 8);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (46, false, 60300070, 'CSU COM AKLOMIABLA', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (47, false, 60300140, 'CSU COM GONZAGUEVILLE', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (48, false, 60300160, 'CSU COM KOUMASSI-DIVO', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (49, false, 60300180, 'CSU COM PANGOLIN', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (50, false, 50300060, 'DISTRICT SANITAIRE PORT BOUET VRIDI', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (51, false, 60300270, 'FSU COM KOUMASSI GRAND CAMPEMENT', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (52, false, 40300070, 'HOPITAL GENERAL KOUMASSI', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (53, false, 40300090, 'HOPITAL GENERAL PORT-BOUET', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (54, false, 60300440, 'HOPITAL MUNICIPAL VRIDI CITE', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (55, false, 20300020, 'CENTRE NATIONAL DE TRANSFUSION SANGUINE', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (56, false, 80301000, 'CENTRE SOCIO-MEDICAL HOPE CI (CSMH)', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (57, false, 10300030, 'CHU TREICHVILLE', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (58, false, 50300070, 'DISTRICT SANITAIRE TREICHVILLE MARCORY', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (59, false, 60300290, 'FSU COM VRIDI CANAL', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (60, false, 40300050, 'HOPITAL GENERAL DE TREICHVILLE (JEAN DELAFOSSE)', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (61, false, 40300080, 'HOPITAL GENERAL MARCORY', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (62, false, 30400020, 'CHR AGBOVILLE', 11);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (63, false, 50400020, 'DISTRICT SANITAIRE AGBOVILLE', 11);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (64, false, 50400050, 'DISTRICT SANITAIRE SIKENSI', 12);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (65, false, 40400060, 'HOPITAL GENERAL SIKENSI', 12);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (66, false, 60400010, 'CSU N''DOUCI', 13);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (67, false, 50400060, 'DISTRICT SANITAIRE TIASSALE', 13);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (68, false, 40400070, 'HOPITAL GENERAL TAABO', 13);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (69, false, 42800070, 'HOPITAL GENERAL TIASSALE', 13);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (70, false, 40400090, 'HOPITAL SAINT JEAN- BAPTISTE', 13);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (71, false, 51900030, 'DISTRICT SANITAIRE KORO', 14);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (72, false, 41900040, 'HOPITAL GENERAL KORO', 14);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (73, false, 51900060, 'DISTRICT SANITAIRE OUANINOU', 15);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (74, false, 41900060, 'HOPITAL GENERAL OUANINOU', 15);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (75, false, 31900020, 'CHR TOUBA', 16);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (76, false, 51900070, 'DISTRICT SANITAIRE TOUBA', 16);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (77, false, 50500010, 'DISTRICT SANITAIRE BOUNDIALI', 17);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (78, false, 40500010, 'HOPITAL GENERAL BOUNDIALI', 17);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (79, false, 50500020, 'DISTRICT SANITAIRE KOUTO', 18);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (80, false, 40500020, 'HOPITAL GENERAL KOUTO', 18);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (81, false, 50500030, 'DISTRICT SANITAIRE TENGRELA', 19);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (82, false, 40500030, 'HOPITAL GENERAL TENGRELA', 19);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (83, false, 50600010, 'DISTRICT SANITAIRE DIDIEVI', 20);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (84, false, 40600020, 'HOPITAL GENERAL DIDIEVI', 20);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (85, false, 51100070, 'DISTRICT SANITAIRE TIEBISSOU', 21);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (86, false, 40600050, 'HOPITAL GENERAL TIEBISSOU', 21);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (87, false, 50600020, 'DISTRICT SANITAIRE TOUMODI', 22);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (88, false, 40600030, 'HOPITAL GENERAL DJEKANOU', 22);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (89, false, 40600040, 'HOPITAL GENERAL KOCOUMBO', 22);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (90, false, 40600060, 'HOPITAL GENERAL TOUMODI', 22);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (91, false, 30600010, 'CHR YAMOUSSOUKRO', 23);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (92, false, 50600030, 'DISTRICT SANITAIRE YAMOUSSOUKRO', 23);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (93, false, 53100010, 'DISTRICT SANITAIRE DIANRA', 24);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (94, false, 43100010, 'HOPITAL GENERAL DIANRA', 24);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (95, false, 50700010, 'DISTRICT SANITAIRE KOUNAHIRI', 25);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (96, false, 40700010, 'HOPITAL GENERAL KOUNAHIRI', 25);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (97, false, 53100030, 'DISTRICT SANITAIRE MANKONO', 26);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (98, false, 43100030, 'HOPITAL GENERAL MANKONO', 26);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (99, false, 40800020, 'HOPITAL GENERAL BOUNA', 27);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (100, false, 50800030, 'DISTRICT SANITAIRE DOROPO', 28);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (101, false, 40800030, 'HOPITAL GENERAL DOROPO', 28);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (102, false, 40800060, 'HOPITAL GENERAL NASSIAN', 29);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (103, false, 50800080, 'DISTRICT SANITAIRE TEHINI', 30);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (104, false, 40800090, 'HOPITAL GENERAL TEHINI', 30);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (105, false, 50900020, 'DISTRICT SANITAIRE BLOLEQUIN', 32);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (106, false, 40900010, 'HOPITAL GENERAL BLOLEQUIN', 32);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (107, false, 30900010, 'CHR GUIGLO', 33);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (108, false, 50900060, 'DISTRICT SANITAIRE TAI', 34);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (109, false, 40900040, 'HOPITAL GENERAL TAI', 34);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (110, false, 50900070, 'DISTRICT SANITAIRE TOULEPLEU', 35);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (111, false, 40900050, 'HOPITAL GENERAL TOULEPLEU', 35);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (112, false, 51900020, 'DISTRICT SANITAIRE KANIASSO', 36);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (113, false, 41900030, 'HOPITAL GENERAL KANIASSO', 36);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (114, false, 51900040, 'DISTRICT SANITAIRE MINIGNAN', 37);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (115, false, 41900050, 'HOPITAL GENERAL MINIGNAN', 37);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (116, false, 51100010, 'DISTRICT SANITAIRE BEOUMI', 38);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (117, false, 41100010, 'HOPITAL GENERAL BEOUMI', 38);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (118, false, 51100020, 'DISTRICT SANITAIRE BOTRO', 39);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (119, false, 41100020, 'HOPITAL GENERAL BOTRO', 39);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (120, false, 31100010, 'CHR BOUAKE', 40);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (121, false, 51100030, 'DISTRICT SANITAIRE BOUAKE EST', 40);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (122, false, 51100040, 'DISTRICT SANITAIRE BOUAKE NORD-OUEST', 41);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (123, false, 51100050, 'DISTRICT SANITAIRE BOUAKE SUD', 42);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (124, false, 51100060, 'DISTRICT SANITAIRE SAKASSOU', 43);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (125, false, 41100030, 'HOPITAL GENERAL SAKASSOU', 43);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (126, false, 51200010, 'DISTRICT SANITAIRE FRESCO', 44);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (127, false, 41200020, 'HOPITAL GENERAL FRESCO', 44);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (128, false, 51200040, 'DISTRICT SANITAIRE SASSANDRA', 45);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (129, false, 41200030, 'HOPITAL GENERAL SASSANDRA', 45);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (130, false, 31300010, 'CHR GAGNOA', 46);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (131, false, 61300030, 'CSU OURAGAHIO', 46);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (132, false, 51300010, 'DISTRICT SANITAIRE GAGNOA', 46);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (133, false, 41300010, 'HOPITAL GENERAL GAGNOA', 46);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (134, false, 51300020, 'DISTRICT SANITAIRE GAGNOA 2', 47);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (135, false, 51300030, 'DISTRICT SANITAIRE OUME', 48);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (136, false, 41300020, 'HOPITAL GENERAL OUME', 48);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (137, false, 30800010, 'CHR BONDOUKOU', 49);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (138, false, 50800010, 'DISTRICT SANITAIRE BONDOUKOU', 49);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (139, false, 50800040, 'DISTRICT SANITAIRE KOUN FAO', 50);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (140, false, 50800060, 'DISTRICT SANITAIRE SANDEGUE', 51);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (141, false, 40800070, 'HOPITAL GENERAL SANDEGUE', 51);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (142, false, 50800070, 'DISTRICT SANITAIRE TANDA', 52);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (143, false, 40800040, 'HOPITAL GENERAL KOUASSI-DATEKRO', 52);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (144, false, 40800050, 'HOPITAL GENERAL KOUN FAO', 52);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (145, false, 40800080, 'HOPITAL GENERAL TANDA', 52);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (146, false, 40800100, 'HOPITAL GENERAL TRANSUA', 52);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (147, false, 50200010, 'DISTRICT SANITAIRE DABOU', 53);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (148, false, 40200010, 'HOPITAL GENERAL DABOU', 53);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (149, false, 50200020, 'DISTRICT SANITAIRE GRAND-LAHOU', 54);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (150, false, 40200020, 'HOPITAL GENERAL GRAND-LAHOU', 54);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (151, false, 50200030, 'DISTRICT SANITAIRE JACQUEVILLE', 55);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (152, false, 40200030, 'HOPITAL GENERAL JACQUEVILLE', 55);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (153, false, 50900010, 'DISTRICT SANITAIRE BANGOLO', 56);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (154, false, 43000010, 'HOPITAL GENERAL BANGOLO', 56);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (155, false, 50900030, 'DISTRICT SANITAIRE DUEKOUE', 57);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (156, false, 40900020, 'HOPITAL GENERAL DUEKOUE', 57);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (157, false, 50900050, 'DISTRICT SANITAIRE KOUIBLY', 58);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (158, false, 40900030, 'HOPITAL GENERAL KOUIBLY', 58);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (159, false, 51500010, 'DISTRICT SANITAIRE DABAKALA', 59);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (160, false, 41500010, 'HOPITAL GENERAL DABAKALA', 59);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (161, false, 31500010, 'CHR KATIOLA', 60);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (162, false, 51500020, 'DISTRICT SANITAIRE KATIOLA', 60);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (163, false, 51500030, 'DISTRICT SANITAIRE NIAKARA', 61);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (164, false, 41500020, 'HOPITAL GENERAL NIAKARA', 61);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (165, false, 41500030, 'HOPITAL GENERAL TAFIRE', 61);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (166, false, 31600010, 'CHR DALOA', 62);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (167, false, 51600010, 'DISTRICT SANITAIRE DALOA', 62);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (168, false, 41600040, 'HOPITAL GENERAL ZOUKOUGBEU', 62);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (169, false, 51600020, 'DISTRICT SANITAIRE ISSIA', 63);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (170, false, 41600010, 'HOPITAL GENERAL ISSIA', 63);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (171, false, 41600020, 'HOPITAL GENERAL SAIOUA', 63);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (172, false, 51600030, 'DISTRICT SANITAIRE VAVOUA', 64);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (173, false, 41600030, 'HOPITAL GENERAL VAVOUA', 64);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (174, false, 51600040, 'DISTRICT SANITAIRE ZOUKOUGBEU', 65);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (175, false, 62600010, 'CSU OUELLE', 66);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (176, false, 52600040, 'DISTRICT SANITAIRE DAOUKRO', 66);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (177, false, 42600030, 'HOPITAL GENERAL DAOUKRO', 66);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (178, false, 51700010, 'DISTRICT SANITAIRE MBAHIAKRO', 67);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (179, false, 41700010, 'HOPITAL GENERAL MBAHIAKRO', 67);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (180, false, 52600060, 'DISTRICT SANITAIRE PRIKRO', 68);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (181, false, 42600040, 'HOPITAL GENERAL PRIKRO', 68);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (182, false, 31800010, 'CHR ABENGOUROU', 69);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (183, false, 51800010, 'DISTRICT SANITAIRE ABENGOUROU', 69);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (184, false, 51800020, 'DISTRICT SANITAIRE AGNIBILEKROU', 70);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (185, false, 41800010, 'HOPITAL GENERAL AGNIBILEKROU', 70);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (186, false, 51800030, 'DISTRICT SANITAIRE BETTIE', 71);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (187, false, 41800020, 'HOPITAL GENERAL BETTIE', 71);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (188, false, 51900010, 'DISTRICT SANITAIRE MADINANI', 72);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (189, false, 41900010, 'HOPITAL GENERAL DE MADINANI', 72);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (190, false, 31900010, 'CHR ODIENNE', 73);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (191, false, 51900050, 'DISTRICT SANITAIRE ODIENNE', 73);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (192, false, 41900020, 'HOPITAL GENERAL GBELEBAN', 73);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (193, false, 41900070, 'HOPITAL GENERAL SAMATIGUILA', 73);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (194, false, 41900080, 'HOPITAL GENERAL SEGUELON', 73);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (195, false, 32000010, 'CHR DIVO', 74);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (196, false, 52000010, 'DISTRICT SANITAIRE DE GUITRY', 74);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (197, false, 52000020, 'DISTRICT SANITAIRE DIVO', 74);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (198, false, 42000010, 'HOPITAL GENERAL GUITRY', 75);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (199, false, 52000030, 'DISTRICT SANITAIRE LAKOTA', 76);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (200, false, 42000020, 'HOPITAL GENERAL LAKOTA', 76);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (201, false, 32200010, 'CHR BOUAFLE', 77);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (202, false, 52200010, 'DISTRICT SANITAIRE BOUAFLE', 77);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (203, false, 62200020, 'HOPITAL GENERAL BONON', 77);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (204, false, 52200020, 'DISTRICT SANITAIRE SINFRA', 78);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (205, false, 42200010, 'HOPITAL GENERAL SINFRA', 78);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (206, false, 52200030, 'DISTRICT SANITAIRE ZUENOULA', 79);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (207, false, 42200020, 'HOPITAL GENERAL ZUENOULA', 79);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (208, false, 30400010, 'CHR ADZOPE', 80);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (209, false, 50400010, 'DISTRICT SANITAIRE ADZOPE', 80);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (210, false, 20400010, 'INSTITUT RAOUL FOLLEREAU ADZOPE', 80);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (211, false, 50400030, 'DISTRICT SANITAIRE AKOUPE', 81);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (212, false, 40400020, 'HOPITAL GENERAL AFFERY', 81);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (213, false, 40400030, 'HOPITAL GENERAL AKOUPE', 81);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (214, false, 40400080, 'HOPITAL GENERAL YAKASSE ATTOBROU', 81);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (215, false, 50400040, 'DISTRICT SANITAIRE ALEPE', 82);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (216, false, 40400040, 'HOPITAL GENERAL ALEPE', 82);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (217, false, 40400050, 'HOPITAL GENERAL MEMNI', 82);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (218, false, 50400070, 'DISTRICT SANITAIRE YAKASSE-ATTOBROU', 83);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (219, false, 52600010, 'DISTRICT SANITAIRE ARRAH', 84);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (220, false, 42300010, 'HOPITAL GENERAL ARRAH', 84);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (221, false, 52600030, 'DISTRICT SANITAIRE BONGOUANOU', 85);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (222, false, 42600020, 'HOPITAL GENERAL BONGOUANOU', 85);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (223, false, 52300010, 'DISTRICT SANITAIRE MBATTO', 86);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (224, false, 42300020, 'HOPITAL GENERAL MBATTO', 86);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (225, false, 52400010, 'DISTRICT SANITAIRE BUYO', 87);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (226, false, 52400020, 'DISTRICT SANITAIRE GUEYO', 88);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (227, false, 42400020, 'HOPITAL GENERAL GUEYO', 88);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (228, false, 42400010, 'HOPITAL GENERAL DE MEAGUI', 89);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (229, false, 61200020, 'CSU GRAND ZATTRY', 90);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (230, false, 51200020, 'DISTRICT SANITAIRE MEAGUI', 90);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (231, false, 51200050, 'DISTRICT SANITAIRE SOUBRE', 90);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (232, false, 62400010, 'FSU MEAGUI', 90);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (233, false, 41200010, 'HOPITAL GENERAL BUYO', 90);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (234, false, 41200040, 'HOPITAL GENERAL SOUBRE', 90);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (235, false, 52600020, 'DISTRICT SANITAIRE BOCANDA', 91);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (236, false, 42600010, 'HOPITAL GENERAL BOCANDA', 91);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (237, false, 32600010, 'CHR DIMBOKRO', 92);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (238, false, 52600050, 'DISTRICT SANITAIRE DIMBOKRO', 92);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (239, false, 52500010, 'DISTRICT SANITAIRE KOUASSI KOUASSIKRO', 93);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (240, false, 42500010, 'HOPITAL GENERAL KOUASSI-KOUASSIKRO', 93);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (241, false, 52700010, 'DISTRICT SANITAIRE DIKODOUGOU', 94);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (242, false, 42700010, 'HOPITAL GENERAL DIKODOUGOU', 94);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (243, false, 32700010, 'CHR KORHOGO', 95);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (244, false, 62700040, 'CSU NAPIE', 95);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (245, false, 52700020, 'DISTRICT SANITAIRE KORHOGO 1', 95);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (246, false, 42700020, 'HOPITAL GENERAL MBENGUE', 95);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (247, false, 42700030, 'HOPITAL GENERAL SINEMATIALI', 95);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (248, false, 52700030, 'DISTRICT SANITAIRE KORHOGO 2', 96);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (249, false, 52700040, 'DISTRICT SANITAIRE M''BENGUE', 97);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (250, false, 52700050, 'DISTRICT SANITAIRE SINEMATIALI', 98);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (251, false, 31200010, 'CHR SAN PEDRO', 99);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (252, false, 61200030, 'CSU SAN-PEDRO', 99);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (253, false, 51200030, 'DISTRICT SANITAIRE SAN-PEDRO', 99);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (254, false, 31200020, 'HOPITAL GENERAL SAN-PEDRO', 99);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (255, false, 51200060, 'DISTRICT SANITAIRE TABOU', 100);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (256, false, 41200050, 'HOPITAL GENERAL TABOU', 100);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (257, false, 32800010, 'CHR ABOISSO', 101);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (258, false, 52800010, 'DISTRICT SANITAIRE ABOISSO', 101);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (259, false, 42800020, 'HOPITAL GENERAL AYAME', 101);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (260, false, 42800050, 'HOPITAL GENERAL MAFERE', 101);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (261, false, 52800020, 'DISTRICT SANITAIRE ADIAKE', 102);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (262, false, 42800010, 'HOPITAL GENERAL ADIAKE', 102);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (263, false, 42800060, 'HOPITAL GENERAL TIAPOUM', 102);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (264, false, 52800030, 'DISTRICT SANITAIRE GRAND-BASSAM', 103);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (265, false, 42800030, 'HOPITAL GENERAL BONOUA', 103);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (266, false, 42800040, 'HOPITAL GENERAL GRAND-BASSAM', 103);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (267, false, 52800040, 'DISTRICT SANITAIRE TIAPOUM', 104);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (268, false, 52900010, 'DISTRICT SANITAIRE FERKESSEDOUGOU', 105);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (269, false, 42900010, 'HOPITAL GENERAL FERKESEDOUGOU', 105);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (270, false, 52900020, 'DISTRICT SANITAIRE KONG', 106);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (271, false, 42900020, 'HOPITAL GENERAL KONG', 106);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (272, false, 62900010, 'CSU DIAWALA', 107);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (273, false, 62900030, 'CSU NIELLE', 107);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (274, false, 52900030, 'DISTRICT SANITAIRE OUANGOLO', 107);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (275, false, 42900030, 'HOPITAL GENERAL OUANGOLO', 107);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (276, false, 53000010, 'DISTRICT SANITAIRE BIANKOUMA', 108);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (277, false, 43000020, 'HOPITAL GENERAL BIANKOUMA', 108);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (278, false, 53000020, 'DISTRICT SANITAIRE DANANE', 109);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (279, false, 43000030, 'HOPITAL GENERAL DANANE', 109);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (280, false, 33000010, 'CHR MAN', 110);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (281, false, 53000030, 'DISTRICT SANITAIRE MAN', 110);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (282, false, 53000040, 'DISTRICT SANITAIRE ZOUAN-HOUNIEN', 111);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (283, false, 43000050, 'HOPITAL GENERAL ZOUAN HOUNIEN', 111);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (284, false, 53100020, 'DISTRICT SANITAIRE KANI', 112);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (285, false, 33100010, 'CHR SEGUELA', 113);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (286, false, 53100040, 'DISTRICT SANITAIRE SEGUELA', 113);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (287, false, 43100020, 'HOPITAL GENERAL KANI', 113);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (288, false, 60100040, 'CENTRE ANTITUBERCULEUX ABOBO', 1);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (289, false, 70200030, 'CENTRE MEDICO-SOCIAL SAINT COEUR ABOBOTE', 1);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (290, false, 70301110, 'CENTRE MEDICO-SOCIAL EL RAPHA', 2);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (291, false, 10200010, 'CHU YOPOUGON', 4);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (292, false, 70200120, 'CS NAZAREEN', 4);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (293, false, 80100290, 'RUBAN ROUGE', 4);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (294, false, 80100230, 'CEPREF', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (295, false, 60200100, 'FSU COM YOPOUGON NIANGON', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (296, false, 60200110, 'FSU COM YOPOUGON PORT-BOUET 2', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (297, false, 60300300, 'CENTRE ANTITUBERCULEUX ADJAME', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (298, false, 70301030, 'DSSA (DIR DU SCE DE SANTE DES ARMEES)', 6);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (299, false, 10300020, 'CHU COCODY', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (300, false, 20300080, 'INSTITUT PASTEUR COTE DIVOIRE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (301, false, 70300140, 'SOEURS MISSION. STE THERESE ENFANT JESUS', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (302, false, 90300520, 'CIRBA', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (303, false, 90300410, 'UNITE SOINS AMBULATOIRE', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (304, false, 50800020, 'DISTRICT SANITAIRE BOUNA', 27);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (305, false, 50800050, 'DISTRICT SANITAIRE NASSIAN', 29);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (306, false, 50800090, 'DISTRICT SANITAIRE TRANSUA', 31);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (307, false, 11100010, 'CHU BOUAKE', 41);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (308, false, 70200100, 'HOPITAL METHODISTE DE DABOU', 53);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (309, false, 90300430, 'CEDRES (PROJET FAC-SIDA CHU TREICHVILLE)', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (310, false, 80300133, 'PROJET RETRO-CI (AMBASSADE USA)', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (311, false, 60200180, 'CENTRE ANTITUBERCULEUX YOPOUGON', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (312, false, 60300480, 'CENTRE ANTITUBERCULEUX BINGERVILLE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (313, false, 60200130, 'CENTRE ANTITUBERCULEUX KOUMASSI', 9);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (314, false, 60300310, 'CENTRE ANTITUBERCULEUX TREICHVILLE', 10);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (315, false, 60400020, 'CENTRE ANTITUBERCULEUX AGBOVILLE', 11);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (316, false, 61900030, 'CENTRE ANTITUBERCULEUX TOUBA', 16);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (317, false, 60500030, 'CENTRE ANTITUBERCULEUX BOUNDIALI', 17);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (318, false, 60600020, 'PROJET CENTRE ANTITUBERCULEUX YAMOUSSOUKRO', 23);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (319, false, 63100030, 'CENTRE ANTITUBERCULEUX MANKONO', 26);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (320, false, 60800040, 'CENTRE ANTITUBERCULEUX BOUNA', 27);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (321, false, 61100030, 'CENTRE ANTITUBERCULEUX BOUAKE', 41);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (322, false, 61200050, 'CENTRE ANTITUBERCULEUX SASSANDRA', 45);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (323, false, 61300010, 'CENTRE ANTITUBERCULEUX GAGNOA', 46);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (324, false, 60800030, 'CENTRE ANTITUBERCULEUX BONDOUKOU', 49);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (325, false, 60900020, 'CENTRE ANTITUBERCULEUX DUEKOUE', 57);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (326, false, 61500010, 'CENTRE ANTITUBERCULEUX KATIOLA', 60);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (327, false, 61600020, 'CENTRE ANTITUBERCULEUX DALOA', 62);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (328, false, 62600030, 'CENTRE ANTITUBERCULEUX DAOUKRO', 66);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (329, false, 61800020, 'CENTRE ANTITUBERCULEUX ABENGOUROU', 69);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (330, false, 61900010, 'CENTRE ANTITUBERCULEUX ODIENNE', 73);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (331, false, 62000050, 'CENTRE ANTITUBERCULEUX DIVO', 74);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (332, false, 62200030, 'CENTRE ANTITUBERCULEUX BOUAFLE', 77);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (333, false, 60400030, 'CENTRE ANTITUBERCULEUX ADZOPE', 80);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (334, false, 62300010, 'CENTRE ANTITUBERCULEUX BONGOUANOU', 85);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (335, false, 61200040, 'CENTRE ANTITUBERCULEUX SOUBRE', 90);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (336, false, 62600020, 'CENTRE ANTITUBERCULEUX DIMBOKRO', 92);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (337, false, 62700050, 'CENTRE ANTITUBERCULEUX KORHOGO', 95);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (338, false, 61300050, 'CENTRE ANTI-TUBERCULEUX SAN-PEDRO', 99);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (339, false, 62900040, 'CENTRE ANTITUBERCULEUX FERKESSEDOUGOU', 105);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (340, false, 63000010, 'CENTRE ANTITUBERCULEUX MAN', 110);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (341, false, 63100020, 'CENTRE ANTITUBERCULEUX SEGUELA', 113);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (342, false, 60900010, 'CENTRE ANTITUBERCULEUX GUIGLO', 33);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (343, false, 60200190, 'CENTRE ANTITUBERCULEUX DABOU', 53);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (344, false, 60200080, 'FSU COM YOPOUGON GESCO', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (345, false, 61800010, 'CSU NIABLE', 69);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (346, false, 62000020, 'CSU HIRE', 74);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (347, false, 60200030, 'CSU COM NIANGON LOKOA', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (348, false, 60200040, 'FSU COM ADIOPODOUME', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (349, false, 60200170, 'FSU MICAO', 5);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (350, false, 60300330, 'CSU AKOUEDO VILLAGE', 7);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (351, false, 62000010, 'CSU HERMANKONO-GARO', 74);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (352, false, 61300040, 'CSU TOUIH', 99);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (353, false, 60200150, 'CSU LOPOU', 53);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (354, false, 62000030, 'CSU NIAMBEZARIA', 76);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (355, false, 62200010, 'CSU GOHITAFLA', 79);
INSERT INTO public.structure (id, active, code, name, district_id) VALUES (356, false, 61200010, 'CSU GABIADJI', 99);


--
-- TOC entry 5093 (class 0 OID 43902)
-- Dependencies: 276
-- Data for Name: adjustment_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.adjustment_type VALUES (1, 'Correctif negatif', 'negatif');
INSERT INTO public.adjustment_type VALUES (2, 'Correctif positif', 'positif');


--
-- TOC entry 5037 (class 0 OID 17211)
-- Dependencies: 220
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.equipment VALUES (1, 'ABBOTT'); 
INSERT INTO public.equipment VALUES (2, 'COBAS 4800');
INSERT INTO public.equipment VALUES (3, 'COBAS 5800');
INSERT INTO public.equipment VALUES (4, 'COBAS 6800');
INSERT INTO public.equipment VALUES (7, 'OPP (BRUKER)');
INSERT INTO public.equipment VALUES (8, 'CONSOMMABLES GENERAUX');
INSERT INTO public.equipment VALUES (6, 'MPIMA');
INSERT INTO public.equipment VALUES (5, 'GENEXPERT');


--
-- TOC entry 5041 (class 0 OID 17223)
-- Dependencies: 224
-- Data for Name: information_sub_sub_unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.information_sub_sub_unit VALUES (3, 'Volume insuffisant');
INSERT INTO public.information_sub_sub_unit VALUES (4, 'Coagulé/Hemolysé');
INSERT INTO public.information_sub_sub_unit VALUES (5, 'Sans fiche');
INSERT INTO public.information_sub_sub_unit VALUES (7, 'Autres');
INSERT INTO public.information_sub_sub_unit VALUES (8, 'Spot insuffisant');
INSERT INTO public.information_sub_sub_unit VALUES (9, 'Spot Coagulé/Hemolysé');
INSERT INTO public.information_sub_sub_unit VALUES (2, 'Vl PSC');
INSERT INTO public.information_sub_sub_unit VALUES (6, 'Mauvaise identification');
INSERT INTO public.information_sub_sub_unit VALUES (1, 'Vl Plasma VIH1');
INSERT INTO public.information_sub_sub_unit VALUES (10, 'Vl Plasma VIH2');

--
-- TOC entry 5043 (class 0 OID 17229)
-- Dependencies: 226
-- Data for Name: information_sub_unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.information_sub_unit VALUES (1, 'VL Number Sample Received');
INSERT INTO public.information_sub_unit VALUES (2, 'VL Number Sample Tested');
INSERT INTO public.information_sub_unit VALUES (3, 'VL Number Sample Failed');
INSERT INTO public.information_sub_unit VALUES (4, 'VL Number Sample Pending');
INSERT INTO public.information_sub_unit VALUES (5, 'EID Number Sample Received');
INSERT INTO public.information_sub_unit VALUES (6, 'EID Number SampleTested');
INSERT INTO public.information_sub_unit VALUES (7, 'EID Number SampleTested on POC');
INSERT INTO public.information_sub_unit VALUES (8, 'EID Number Sample Failed');
INSERT INTO public.information_sub_unit VALUES (9, 'EID Number Sample Failed on POC');
INSERT INTO public.information_sub_unit VALUES (12, 'VL PSC');
INSERT INTO public.information_sub_unit VALUES (13, 'EID');
INSERT INTO public.information_sub_unit VALUES (15, 'VIRAL LOAD PSC');
INSERT INTO public.information_sub_unit VALUES (16, 'EARLY INFANT DIAGNOSIS');
INSERT INTO public.information_sub_unit VALUES (17, 'Rupture réactifs nombre de jours');
INSERT INTO public.information_sub_unit VALUES (18, 'Reactifs périmés nombre de jours');
INSERT INTO public.information_sub_unit VALUES (19, 'Réactifs inutilisabes ');
INSERT INTO public.information_sub_unit VALUES (20, 'Autres');
INSERT INTO public.information_sub_unit VALUES (22, 'Nombre d''heures ou de jour interruption courant');
INSERT INTO public.information_sub_unit VALUES (24, 'Nombre Personnel absent');
INSERT INTO public.information_sub_unit VALUES (26, 'Type Equipments');
INSERT INTO public.information_sub_unit VALUES (27, 'Date debut de la panne');
INSERT INTO public.information_sub_unit VALUES (28, 'Date information SAV');
INSERT INTO public.information_sub_unit VALUES (29, ' Date  d''intervention');
INSERT INTO public.information_sub_unit VALUES (31, 'Autres actions');
INSERT INTO public.information_sub_unit VALUES (10, 'EID Number Sample Pending');
INSERT INTO public.information_sub_unit VALUES (21, 'Nombre de jours de panne équipement');
INSERT INTO public.information_sub_unit VALUES (23, 'Nombre de jours rupture de consommables');
INSERT INTO public.information_sub_unit VALUES (25, 'Autres incidents techniques');
INSERT INTO public.information_sub_unit VALUES (30, 'Date de qualification équipement');
INSERT INTO public.information_sub_unit VALUES (14, 'VIRAL LOAD  PLASMA VIH1');
INSERT INTO public.information_sub_unit VALUES (32, 'VIRAL LOAD PLASMA VIH2');
INSERT INTO public.information_sub_unit VALUES (11, 'VL Plasma VIH1');
INSERT INTO public.information_sub_unit VALUES (33, 'VL Plasma VIH2');


--
-- TOC entry 5045 (class 0 OID 17235)
-- Dependencies: 228
-- Data for Name: information_unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.information_unit VALUES (1, 'Viral Load');
INSERT INTO public.information_unit VALUES (2, 'Early Infant Diagnosis ');
INSERT INTO public.information_unit VALUES (3, 'Quality Indicator 1 : TAT  - Délai d''exécution des analyses (Nombre de jours ouvrables depuis la réception de l''échantillon jusqu''à la mise à disponibilité des résultats d''analyse)');
INSERT INTO public.information_unit VALUES (4, 'Quality Indicator 2 :  Number Sample rejection (Nombre d''échantillons rejetés dans la semaine en précisant les motifs)');
INSERT INTO public.information_unit VALUES (5, 'Quality indicator 3: Out of service due to reagent (Nombre d''interruption de service dues à une rupture de réactifs ou autres)');
INSERT INTO public.information_unit VALUES (6, 'Additionnal Information on : Human ressources; Equipment Breakdown;Electrycity Issues; consummables stock out; technical incident; etc…');
INSERT INTO public.information_unit VALUES (7, 'Suivi Des Interventions de Maintenance (en cas de panne d''équipement)');


--
-- TOC entry 5039 (class 0 OID 17217)
-- Dependencies: 222
-- Data for Name: information; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (227, 7, NULL, 6, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (228, 7, NULL, 8, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (229, 7, NULL, 10, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (230, 7, NULL, 11, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (232, 7, NULL, 13, 3, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (233, 7, 8, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (234, 7, 9, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (235, 7, 5, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (236, 7, 6, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (237, 7, 7, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (170, 5, 5, 15, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (171, 5, 6, 15, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (172, 5, 7, 15, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (174, 5, 2, 1, 1, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (176, 5, 2, 2, 1, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (178, 5, 2, 3, 1, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (180, 5, 2, 4, 1, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (182, 5, NULL, 6, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (183, 5, NULL, 8, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (184, 5, NULL, 10, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (186, 5, NULL, 12, 3, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (187, 5, NULL, 13, 3, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (188, 5, 8, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (189, 5, 9, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (190, 5, 5, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (191, 5, 6, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (192, 5, 7, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (8, 2, 3, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (9, 2, 4, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (10, 2, 5, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (11, 2, 6, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (12, 2, 7, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (13, 2, 8, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (14, 2, 9, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (15, 2, 5, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (16, 2, 6, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (17, 2, 7, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (38, 2, 1, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (39, 2, 2, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (40, 2, 1, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (41, 2, 2, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (42, 2, 1, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (43, 2, 2, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (44, 2, 1, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (45, 2, 2, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (46, 2, NULL, 5, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (47, 2, NULL, 6, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (226, 7, NULL, 5, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (136, 4, NULL, 5, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (137, 4, NULL, 6, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (138, 4, NULL, 8, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (139, 4, NULL, 10, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (142, 4, NULL, 13, 3, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (143, 4, 8, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (144, 4, 9, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (145, 4, 5, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (146, 4, 6, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (147, 4, 7, 16, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (128, 4, 1, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (129, 4, 2, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (130, 4, 1, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (131, 4, 2, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (132, 4, 1, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (133, 4, 2, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (134, 4, 1, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (135, 4, 2, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (140, 4, NULL, 11, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (141, 4, NULL, 12, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (148, 4, NULL, 17, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (149, 4, NULL, 18, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (150, 4, NULL, 19, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (151, 4, NULL, 20, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (152, 4, NULL, 21, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (153, 4, NULL, 22, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (154, 4, NULL, 23, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (155, 4, NULL, 24, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (156, 4, NULL, 25, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (157, 4, NULL, 26, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (158, 4, NULL, 27, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (159, 4, NULL, 28, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (160, 4, NULL, 29, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (161, 4, NULL, 30, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (162, 4, NULL, 31, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (208, 7, 3, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (209, 7, 4, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (48, 2, NULL, 8, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (49, 2, NULL, 10, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (50, 2, NULL, 11, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (51, 2, NULL, 12, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (52, 2, NULL, 13, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (53, 2, 8, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (54, 2, 9, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (55, 2, 5, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (56, 2, 6, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (57, 2, 7, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (58, 2, NULL, 17, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (59, 2, NULL, 18, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (60, 2, NULL, 19, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (61, 2, NULL, 20, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (62, 2, NULL, 21, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (63, 2, NULL, 22, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (64, 2, NULL, 23, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (65, 2, NULL, 24, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (66, 2, NULL, 25, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (67, 2, NULL, 26, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (68, 2, NULL, 27, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (69, 2, NULL, 28, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (70, 2, NULL, 29, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (71, 2, NULL, 30, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (72, 2, NULL, 31, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (73, 3, 3, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (74, 3, 4, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (75, 3, 5, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (76, 3, 6, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (77, 3, 7, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (78, 3, 8, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (79, 3, 9, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (80, 3, 5, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (81, 3, 6, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (82, 3, 7, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (83, 3, 1, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (84, 3, 2, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (85, 3, 1, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (86, 3, 2, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (87, 3, 1, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (88, 3, 2, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (89, 3, 1, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (90, 3, 2, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (91, 3, NULL, 5, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (92, 3, NULL, 6, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (93, 3, NULL, 8, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (94, 3, NULL, 10, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (95, 3, NULL, 11, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (96, 3, NULL, 12, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (97, 3, NULL, 13, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (98, 3, 8, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (99, 3, 9, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (100, 3, 5, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (101, 3, 6, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (102, 3, 7, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (103, 3, NULL, 17, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (104, 3, NULL, 18, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (105, 3, NULL, 19, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (106, 3, NULL, 20, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (107, 3, NULL, 21, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (108, 3, NULL, 22, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (109, 3, NULL, 23, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (110, 3, NULL, 24, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (111, 3, NULL, 25, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (112, 3, NULL, 26, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (113, 3, NULL, 27, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (114, 3, NULL, 28, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (115, 3, NULL, 29, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (116, 3, NULL, 30, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (117, 3, NULL, 31, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (118, 4, 3, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (119, 4, 4, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (120, 4, 5, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (121, 4, 6, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (122, 4, 7, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (123, 4, 8, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (124, 4, 9, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (125, 4, 5, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (126, 4, 6, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (127, 4, 7, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (1, 6, NULL, 5, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (210, 7, 5, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (211, 7, 6, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (212, 7, 7, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (218, 7, 1, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (220, 7, 1, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (222, 7, 1, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (224, 7, 1, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (238, 7, NULL, 17, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (239, 7, NULL, 18, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (240, 7, NULL, 19, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (241, 7, NULL, 20, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (242, 7, NULL, 21, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (243, 7, NULL, 22, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (244, 7, NULL, 23, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (245, 7, NULL, 24, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (246, 7, NULL, 25, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (247, 7, NULL, 26, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (248, 7, NULL, 27, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (249, 7, NULL, 28, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (250, 7, NULL, 29, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (251, 7, NULL, 30, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (252, 7, NULL, 31, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (253, 1, 3, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (254, 1, 4, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (255, 1, 5, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (213, 7, 8, 32, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (214, 7, 9, 32, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (215, 7, 5, 32, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (216, 7, 6, 32, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (217, 7, 7, 32, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (219, 7, 10, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (221, 7, 10, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (223, 7, 10, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (225, 7, 10, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (231, 7, NULL, 33, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (181, 5, NULL, 5, 2, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (256, 1, 6, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (257, 1, 7, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (258, 1, 8, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (259, 1, 9, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (260, 1, 5, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (261, 1, 6, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (262, 1, 7, 15, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (263, 1, 1, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (264, 1, 2, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (265, 1, 1, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (266, 1, 2, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (267, 1, 1, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (268, 1, 2, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (269, 1, 1, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (270, 1, 2, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (271, 1, NULL, 5, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (272, 1, NULL, 6, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (273, 1, NULL, 8, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (274, 1, NULL, 10, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (275, 1, NULL, 11, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (276, 1, NULL, 12, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (277, 1, NULL, 13, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (278, 1, 8, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (279, 1, 9, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (280, 1, 5, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (281, 1, 6, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (282, 1, 7, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (283, 1, NULL, 17, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (284, 1, NULL, 18, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (285, 1, NULL, 19, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (286, 1, NULL, 20, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (287, 1, NULL, 21, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (288, 1, NULL, 22, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (289, 1, NULL, 23, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (290, 1, NULL, 24, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (291, 1, NULL, 25, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (292, 1, NULL, 26, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (293, 1, NULL, 27, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (294, 1, NULL, 28, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (295, 1, NULL, 29, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (296, 1, NULL, 30, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (297, 1, NULL, 31, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (163, 5, 3, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (164, 5, 4, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (165, 5, 5, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (166, 5, 6, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (167, 5, 7, 14, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (173, 5, 1, 1, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (175, 5, 1, 2, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (177, 5, 1, 3, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (179, 5, 1, 4, 1, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (185, 5, NULL, 11, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (193, 5, NULL, 17, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (194, 5, NULL, 18, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (195, 5, NULL, 19, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (196, 5, NULL, 20, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (197, 5, NULL, 21, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (198, 5, NULL, 22, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (199, 5, NULL, 23, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (200, 5, NULL, 24, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (201, 5, NULL, 25, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (202, 5, NULL, 26, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (203, 5, NULL, 27, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (204, 5, NULL, 28, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (205, 5, NULL, 29, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (206, 5, NULL, 30, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (207, 5, NULL, 31, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (2, 6, NULL, 7, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (3, 6, NULL, 9, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (4, 6, NULL, 10, 2, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (5, 6, NULL, 11, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (6, 6, NULL, 12, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (7, 6, NULL, 13, 3, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (18, 6, 8, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (19, 6, 9, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (20, 6, 5, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (21, 6, 6, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (22, 6, 7, 16, 4, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (23, 6, NULL, 17, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (24, 6, NULL, 18, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (25, 6, NULL, 19, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (26, 6, NULL, 20, 5, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (27, 6, NULL, 21, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (28, 6, NULL, 22, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (29, 6, NULL, 23, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (30, 6, NULL, 24, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (31, 6, NULL, 25, 6, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (32, 6, NULL, 26, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (33, 6, NULL, 27, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (34, 6, NULL, 28, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (35, 6, NULL, 29, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (36, 6, NULL, 30, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (37, 6, NULL, 31, 7, true);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (168, 5, 8, 15, 4, false);
INSERT INTO public.information(id, equipment_id, information_sub_sub_unit_id, information_sub_unit_id, information_unit_id, is_active) VALUES (169, 5, 9, 15, 4, false);


--
-- TOC entry 5051 (class 0 OID 17255)
-- Dependencies: 234
-- Data for Name: intrant_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.intrant_type VALUES (1, 'specific_primary');
INSERT INTO public.intrant_type VALUES (2, 'specific_secondary');
INSERT INTO public.intrant_type VALUES (3, 'non_specific');


--
-- TOC entry 5047 (class 0 OID 17241)
-- Dependencies: 230
-- Data for Name: intrant; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (60, 4030356, 'PIPETTE COMPTE GOUTTES TRANSFERT STERILE 3ML', 'PIPETTE', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (61, 4030360, 'PIPETTE COMPTE GOUTTES TRANSFERT STERILE 3ML PQT/500', 'P/500', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (62, 4040210, 'GANT SANS TALC PQT/100', 'PAQUET', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (63, 4030177, 'GANTS DEXAMEN LATEX MM PQT/100', 'PAQUET', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (64, 4030135, 'EMBOUT A FILTRE 100-1000µL PQ/96', 'PAQUET', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (65, 4030124, 'CRYOTUBES 2ML PQT/500', 'CRYOTUBE', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (66, 4150058, 'BLOUSE JETABLE', 'Blouse', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (67, 4030407, 'NAPPE DE PAILLASSE /Rouleau', 'ROULEAU', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (68, 4150685, 'SAC POUBELLE AUTOCLAVABLE ; taille 25x35', '200 pces', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (69, 4150695, 'SAC POUBELLE AUTOCLAVABLE ; taille 19x23', '100 pces', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (70, 4150696, 'SAC POUBELLE AUTOCLAVABLE ; taille 37x48', '200 pces', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (15, 4040065, 'COBAS 4800. HIV-1 CE-IVD. 120 TESTS', 'KIT', 2, 1, 120, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (47, 4040219, 'GENERIC VIH-2 CHARGE VIRALE 96 TESTS KIT', 'KIT', 7, 1, 96, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (48, 4040236, 'GXT NA EXTRACTION CE/IVD 96 TESTS KIT', 'KIT', 7, 2, 0.900102459, 96, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (49, 4030411, 'PROTEINASE K 100mg/ml, 96 tests', 'KIT', 7, 2, 0.900102459, 96, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (50, 4040262, 'MICROPLAQUE PCR DEMI-JUPE FRAMESTAR 480/96 PAQUET/50', 'KIT', 7, 2, 0.0169057377, 50, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (51, 4010013, 'FEUILLETS DE SCELLAGE POUR PLAQUES MOLECULAIRES, ADHESIVES, TRANSPARENTES, POUR PCR ET STOCKAGE, PQ/100', 'KIT', 7, 2, 0.0087090164, 100, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (52, 4151014, 'WATER MOLECULAR BIOLOGY GRADE, 100ML', 'KIT', 7, 2, 0, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (53, 4030313, 'MICROTUBES 1.5 ML SANS JUPE BOUCHON A VIS A PAS EXTERNE PQT/1000', 'PAQUET', 7, 2, 0.400102459, 1000, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (54, 4030311, 'MICROTUBE SAFESEAL SAFELOCK 1.5ml EN PP PCR PERF. TESTED PAQUET/1000', 'PAQUET', 7, 2, 0.4088114754, 1000, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (55, 3080155, 'PHAGOSPRAY PULVERISATEUR 750 ML FLACON', 'FLACON', 7, 2, 0, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (16, 4040072, 'COBAS 4800. SAMPLE PREPARATION KIT 2 CE-IVD. 960 TESTS', 'KIT', 2, 2, 0.0105392157, 10, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (17, 4040074, 'COBAS 4800. SYSTEM LYSIS KIT 2 CE-IVD. 960 TESTS', 'KIT', 2, 2, 0.0105392157, 10, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (18, 4040064, 'COBAS 4800. HBV/HCV/HIV-1 CONTROL KIT CE-IVD. 10 TESTS', 'KIT', 2, 2, 0.0105392157, 10, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (19, 4040075, 'COBAS 4800. SYSTEM WASH BUFFER IVD. 960 TESTS', 'KIT', 2, 2, 0.0105392157, 10, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (20, 4040062, 'COBAS 4800. AMPLIFICATION AND DETECTION PLATE AND SEAL. Paquet/50', 'PLAQUE', 2, 2, 0.0105392157, 50, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (21, 4040069, 'COBAS 4800. REAGENT RESERVOIR. 200 ML. Carton/100', 'RESERVOIR', 2, 2, 0.0208333333, 100, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (22, 4040070, 'COBAS 4800. REAGENT RESERVOIR. 50 ML. Carton/200', 'RESERVOIR', 2, 2, 0.0208333333, 200, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (23, 4040047, 'COBAS 4800. TIP CORE TIPS WITH FILTER. 1 ML. 40 RACKS OF 96 TIPS', 'BOITE', 2, 2, 0.1355392157, 40, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (24, 4040063, 'COBAS 4800. EXTRACTION PLATE. 2.0 ML. Paquet/40', 'PLAQUE', 2, 2, 0.0105392157, 40, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (25, 4040077, 'COBAS 4800. WASTE BAG. SMALL. Paquet/25', 'SAC', 2, 2, 0.0053921569, 25, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (35, 4040126, 'COBAS OMNI MGP REAGENT KIT', 'KIT', 3, 2, 0.002688172, 1, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (36, 4040084, 'COBAS 6800/8800 WASH REAGENT KIT', 'KIT', 3, 2, 0.0047043011, 1, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (56, 4040282, 'OPP EMBOUT A FILTRE 1000µL PQT/96', 'BOITE', 7, 2, 0.9421106557, 96, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (57, 4040284, 'OPP EMBOUT A FILTRE 2-200µL PQT/96', 'BOITE', 7, 2, 0.075307377, 96, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (58, 4040283, 'OPP EMBOUT A FILTRE 2-20µL PQT/96', 'BOITE', 7, 2, 1.0835040984, 96, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (59, 4040285, 'OPP EMBOUT A FILTRE 5-300µL PQT/96', 'BOITE', 7, 2, 0.1670081967, 96, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (31, 4040317, 'COBAS 58/68/8800 IVD 192 TESTS KIT', 'KIT', 3, 1, 186, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (32, 4040123, 'COBAS NHP CONTROLE NEGATIF KIT', 'KIT', 3, 2, 0.0107526882, 16, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (33, 4040115, 'COBAS HBV/HCV/HIV-1 CONTROLE KIT', 'KIT', 3, 2, 0.0107526882, 8, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (38, 4040140, 'COBAS SPECIMEN PRE-EXTRACTION REAGENT 15 x 40 mL IVD (SPER) KIT', 'KIT', 3, 2, 0.02875, 15, 0.0325);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (39, 40401401, 'COBAS OMNI AMPLIFICATION PLATE (PLAQUE DAMPLIFICATION) 24x120 KIT', 'KIT', 3, 2, 0.0416666667, 120, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (40, 40401402, 'COBAS OMNI LIQUID WASTE PLATE(PLAQUE A DECHET LIQUIDE) 24x60 KIT', 'KIT', 3, 2, 0.0416666667, 60, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (41, 40401403, 'COBAS OMNI PROCESSING PLATE (PLAQUE DE TRAITEMENT) 24x60 KIT', 'KIT', 3, 2, 0.0416666667, 60, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (42, 40401404, 'COBAS  CORE TIPS WITH FILTER 1 ML CART/40x96', 'CARTON', 3, 2, 2, 3840, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (46, 4040438, 'GENERIC VIH-1 CHARGE VIRALE VERS 2.0 192 TESTS KIT', 'KIT', 7, 1, 192, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (34, 4040125, 'COBAS OMNI LYSIS REAGENT KIT', 'KIT', 3, 2, 0.0053763441, 4, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (37, 4040132, 'COBAS OMNI SPECIMEN DILUENT KIT', 'KIT', 3, 2, 0.0047043011, 4, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (71, 3080009, 'Ethylic Alcohol 96%', 'Litre', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (72, 3080090, 'ETHANOL ABSOLU 2,5L', 'Bidon', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (73, 3080126, 'ISOPROPANOL ABSOLU 99.5% FL/2.5 L', 'Bidon', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (74, 3080142, 'Chlorine tablets (comprimé de Javel) bte/50', 'Pastille', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (75, 4040166, 'DRNASE. bidon 1 Litre', 'Bidon', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (76, 4030352, 'PHOSPHATE BUFFER SALINE ( PBS) Flacon 500 ml SOLUTION', 'Flacon', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (77, 4150651, 'PROTECTEUR DE MANCHE BLANCHE 45 cm PAQUET/100', 'MANCHE', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (78, 4150697, 'SAC AUTOCLAVABLE ROUGE 8 X 12 cm paquet/10', 'Paquet', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (79, 4150652, 'PROTECTEUR DE MANCHE PAQUET/200 PAQUET', 'MANCHE', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (80, 4150217, 'COUVRE CHAUSSURE PQT/100', 'PAQUET', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (81, 4150653, 'PROTECTEUR DE MANCHE CARTON300 CARTON', 'MANCHE', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (82, 4030491, 'TUBE A CENTRIFUGEUSE 15 ml', 'TUBE', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (83, 4030139, 'EMBOUT A FILTRE 1-200 µL BTE/96', 'PAQUET', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (84, 4030138, 'EMBOUT A FILTRE 1-20 µL BTE/96', 'PAQUET', 8, 3, 1, NULL, NULL);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (2, 4040015, 'ABBOTT REALTIME HIV CONTROL KIT (NEG, LOW, HIGH)', 'KIT', 1, 2, 0.0104166667, 8, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (3, 4040014, 'ABBOTT REALTIME HIV CALIBRATOR KIT (A, B)', 'KIT', 1, 2, 0.0013020833, 12, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (4, 4040005, 'ABBOTT OPTICAL CALIBRATION KIT', 'KIT', 1, 2, 0, 10, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (5, 4040269, 'ABBOTT MSAMPLE PREPARATION REAGENTS RNA TESTS KIT/4x24', 'KIT', 1, 2, 1, 96, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (6, 4040319, 'ABBOTT PIPETTE TIPS 1000µL PQT/96', 'PAQUET', 1, 2, 8.7604166666, 96, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (7, 4040006, 'ABBOTT PIPETTE TIPS 200µL PQT/96', 'PAQUET', 1, 2, 1, 96, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (8, 4030427, 'ABBOTT REACTION VESSEL 5 ML. CART/2000', 'PAQUET', 1, 2, 1, 2000, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (9, 4030428, 'ABBOTT REAGENT VESSEL 200 ML. PQT/90', 'PAQUET', 1, 2, 0.0625, 90, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (10, 4040158, 'ABBOTT DEEP WELL PLATES PUITS BTE/32X96', 'PAQUET', 1, 2, 0.03125, 32, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (11, 4150736, 'ABBOTT SACS BIOHAZARD PQT/50', 'PAQUET', 1, 2, 0.0104166667, 50, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (12, 4150527, 'ABBOTT MASTER MIX TUBES PQT/150', 'PAQUET', 1, 2, 0.0104166667, 150, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (13, 4030389, 'ABBOTT PLAQUES DE REACTION OPTIQUE 20X96 BOITE', 'BOITE', 1, 2, 0.0104166667, 20, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (14, 4040001, 'ABBOTT COUVERTURE ADHESIVE OPTIQUE BTE/100', 'BOITE', 1, 2, 0.0104166667, 100, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (29, 4040140, 'COBAS SPECIMEN PRE-EXTRACTION REAGENT 15 x 40 mL IVD (SPER), KIT', 'KIT', 2, 2, 0.000245098, 1, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (26, 4040131, 'COBAS OMNI SECONDARY TUBE  13 X75 PAQUET /1500', 'TUBE', 2, 2, 1, 1500, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (27, 4030521, 'TUBE SECONDAIRE AVEC BOUCHON PAQUET/1000', 'TUBE', 2, 2, 1, 1000, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (28, 4040076, 'COBAS 4800. WASTE BAG PQT/50', 'SAC', 2, 2, 0.0053921569, 50, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (30, 4040068, 'COBAS 4800. PLASTIC Chute PQT/10', 'PLASTIQUE', 2, 2, 0.0012254902, 10, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (87, 40403172, 'COBAS 5800/6800/8800 HIV-1/HIV-2 Qualitative Amplification Reagent, 192 Tests, 1 Kit', 'KIT', 3, 1, 186, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (88, 4040136, 'COBAS PLASMA SEPARATION CARD. PQT/25', 'CARTE', 3, 1, 1, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (43, 40401405, 'COBAS CORE TIPS WITH FILTER 300 µL CART/60x96', 'CARTON', 3, 2, 1, 5760, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (44, 4030521, 'TUBE SECONDAIRE AVEC BOUCHON PQT/1000', 'PAQUET', 3, 2, 1, 1000, 1);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (45, 4040079, 'COBAS 6800 SAC A DECHETS SOLIDES PQT/20', 'PAQUET', 3, 2, 0.002688172, 20, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (89, 40403173, 'COBAS 5800/6800/8800 HIV-1/2 Control, 8 x 0.65 mL of Each Level, 1 Kit', 'CARTE', 3, 2, 0.0107526882, 8, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (90, 4040131, 'COBAS OMNI SECONDARY TUBE 13 X75 PAQUET /1500', 'PAQUET', 3, 2, 1, 1500, 1);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (91, 4040317, 'COBAS 58/68/8800 IVD 192 TESTS KIT', 'KIT', 4, 1, 192, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (92, 4040123, 'COBAS NHP CONTROLE NEGATIF KIT', 'KIT', 4, 2, 0.0104166667, 16, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (93, 4040115, 'COBAS HBV/HCV/HIV-1 CONTROLE KIT', 'KIT', 4, 2, 0.0104166667, 8, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (94, 4040125, 'COBAS OMNI LYSIS REAGENT KIT', 'KIT', 4, 2, 0.0104166667, 840, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (95, 4040126, 'COBAS OMNI MGP REAGENT KIT', 'KIT', 4, 2, 0.0104166667, 480, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (96, 4040084, 'COBAS 6800/8800 WASH REAGENT KIT', 'KIT', 4, 2, 0.0104166667, 240, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (97, 4040132, 'COBAS OMNI SPECIMEN DILUENT KIT', 'KIT', 4, 2, 0.0104166667, 960, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (98, 4040124, 'COBAS OMNI AMPLIFICATION PLATE (PLAQUE DAMPLIFICATION) KIT/32', 'KIT', 4, 2, 0.0104166667, 32, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (99, 4040129, 'COBAS OMNI PROCESSING PLATE (PLAQUE DE TRAITEMENT) 32x48 KIT', 'KIT', 4, 2, 0.0208333333, 32, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (100, 4040127, 'COBAS OMNI PIPETTE KIT/16', 'KIT', 4, 2, 0.0104166667, 16, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (101, 4030520, 'TUBE SECONDAIRE AVEC BOUCHON A VIS 92x15.3mm. POLYETHYL. CART/1000', 'CARTON', 4, 2, 1, 1000, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (1, 4040012, 'ABBOTT REALTIME HIV AMPLIFICATION REAGENT 4X24 TESTS', 'KIT', 1, 1, 96, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (85, 4040223, 'GENEXPERT HIV -1 VIRAL LOAD TEST KIT/10', 'KIT', 5, 1, 10, 1, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (86, 4040267, 'm-Pima HIV-1/2 DETECT CARTOUCHE TESTS', 'CARTOUCHE', 6, 1, 1, 0, 0);
INSERT INTO public.intrant(
	id, code, name, sku, equipment_id, intrant_type_id, convertion_factor, round_factor, other_factor) VALUES (102, 4040079, 'COBAS 6800 SAC A DECHETS SOLIDES PQT/20', 'PAQUET', 4, 2, 0.0032552083, 20, 0);


--
-- TOC entry 5081 (class 0 OID 33637)
-- Dependencies: 264
-- Data for Name: sanguine_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sanguine_product VALUES (3, 'PSC Sample');
INSERT INTO public.sanguine_product VALUES (4, 'EID sample');
INSERT INTO public.sanguine_product VALUES (1, 'Viral load sample vih1');
INSERT INTO public.sanguine_product VALUES (2, 'Viral load sample vih2');


--
-- TOC entry 5067 (class 0 OID 25265)
-- Dependencies: 250
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.status VALUES (2, 'SUGGESTED');
INSERT INTO public.status VALUES (3, 'SUBMITTED');
INSERT INTO public.status VALUES (1, 'DRAFT');
INSERT INTO public.status VALUES (4, 'APPROVED');


--
-- TOC entry 5077 (class 0 OID 25445)
-- Dependencies: 260
-- Data for Name: synthesis_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.synthesis_type VALUES (1, 'Rapports Mensuels');
INSERT INTO public.synthesis_type VALUES (2, 'Données Laboratoire');
INSERT INTO public.synthesis_type VALUES (3, 'Données Pharmacie');
INSERT INTO public.synthesis_type VALUES (4, 'Autres');


--
-- TOC entry 5075 (class 0 OID 25439)
-- Dependencies: 258
-- Data for Name: synthesis; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.synthesis VALUES (10, 'Synthèse hebdomadaire', 2, NULL);
INSERT INTO public.synthesis VALUES (3, 'Cumul des données de charge viral', 2, 1);
INSERT INTO public.synthesis VALUES (4, 'Cumul des données de EID', 2, 2);
INSERT INTO public.synthesis VALUES (5, 'Delai moyen d''exécution dune analyse', 2, 3);
INSERT INTO public.synthesis VALUES (6, 'Nombre d''échantillon rejetés', 2, 4);

INSERT INTO public.synthesis(id, item, synthesis_type_id, information_unit_id) VALUES (7, 'Nombre d''intéruptions de service', 2, 5);
INSERT INTO public.synthesis(id, item, synthesis_type_id, information_unit_id) VALUES (8, 'Informations additionnelles', 2, 6);
INSERT INTO public.synthesis(id, item, synthesis_type_id, information_unit_id) VALUES (9, 'Suivi des interventions de maintenance', 2, 7);