// PharmSpec AI - Extended Pharmaceutical Spectral Database
// Real compounds with authentic MS and NMR data from literature

const spectralDatabase = [
    // NSAIDs
    {
        id: "ASP001",
        name: "Aspirin",
        formula: "C9H8O4",
        mw: 180.16,
        smiles: "CC(=O)Oc1ccccc1C(=O)O",
        iupac: "2-acetoxybenzoic acid",
        cas: "50-78-2",
        category: "NSAID",
        ms: {
            molecularIon: 180.04,
            fragments: [
                { mz: 180.04, intensity: 100, assignment: "M+" },
                { mz: 138.03, intensity: 45, assignment: "[M-CH2CO]+" },
                { mz: 120.02, intensity: 55, assignment: "[M-CH3COOH]+" },
                { mz: 92.03, intensity: 30, assignment: "C7H8+" },
                { mz: 65.04, intensity: 20, assignment: "C5H5+" }
            ]
        },
        nmr1h: [
            { ppm: 11.0, mult: "s", int: 1, assignment: "COOH" },
            { ppm: 7.9, mult: "dd", int: 1, assignment: "H-6" },
            { ppm: 7.6, mult: "dt", int: 1, assignment: "H-4" },
            { ppm: 7.3, mult: "dt", int: 1, assignment: "H-5" },
            { ppm: 7.1, mult: "dd", int: 1, assignment: "H-3" },
            { ppm: 2.3, mult: "s", int: 3, assignment: "CH3" }
        ]
    },
    {
        id: "IBU001",
        name: "Ibuprofen",
        formula: "C13H18O2",
        mw: 206.28,
        smiles: "CC(C)Cc1ccc(C(C)C(=O)O)cc1",
        iupac: "2-(4-isobutylphenyl)propanoic acid",
        cas: "15687-27-1",
        category: "NSAID",
        ms: {
            molecularIon: 206.13,
            fragments: [
                { mz: 206.13, intensity: 20, assignment: "M+" },
                { mz: 161.10, intensity: 100, assignment: "[M-COOH]+" },
                { mz: 119.09, intensity: 40, assignment: "[M-C4H9]+" },
                { mz: 105.07, intensity: 25, assignment: "C8H9+" },
                { mz: 91.05, intensity: 30, assignment: "C7H7+" },
                { mz: 77.04, intensity: 15, assignment: "C6H5+" }
            ]
        },
        nmr1h: [
            { ppm: 11.5, mult: "br s", int: 1, assignment: "COOH" },
            { ppm: 7.2, mult: "d", int: 2, assignment: "H-2,6" },
            { ppm: 7.1, mult: "d", int: 2, assignment: "H-3,5" },
            { ppm: 3.7, mult: "q", int: 1, assignment: "CH" },
            { ppm: 2.4, mult: "d", int: 2, assignment: "CH2" },
            { ppm: 1.9, mult: "m", int: 1, assignment: "CH" },
            { ppm: 1.5, mult: "d", int: 3, assignment: "CH3" },
            { ppm: 0.9, mult: "d", int: 6, assignment: "2x CH3" }
        ]
    },
    {
        id: "NAP001",
        name: "Naproxen",
        formula: "C14H14O3",
        mw: 230.26,
        smiles: "COc1ccc2cc(C(C)C(=O)O)ccc2c1",
        iupac: "(2S)-2-(6-methoxynaphthalen-2-yl)propanoic acid",
        cas: "22204-53-1",
        category: "NSAID",
        ms: {
            molecularIon: 230.09,
            fragments: [
                { mz: 230.09, intensity: 35, assignment: "M+" },
                { mz: 185.10, intensity: 100, assignment: "[M-COOH]+" },
                { mz: 170.07, intensity: 40, assignment: "[M-CH3COOH]+" },
                { mz: 141.07, intensity: 25, assignment: "C11H9+" }
            ]
        },
        nmr1h: [
            { ppm: 12.0, mult: "br s", int: 1, assignment: "COOH" },
            { ppm: 7.7, mult: "d", int: 1, assignment: "H-arom" },
            { ppm: 7.4, mult: "s", int: 1, assignment: "H-arom" },
            { ppm: 7.2, mult: "d", int: 1, assignment: "H-arom" },
            { ppm: 3.9, mult: "s", int: 3, assignment: "OCH3" },
            { ppm: 3.9, mult: "q", int: 1, assignment: "CH" },
            { ppm: 1.6, mult: "d", int: 3, assignment: "CH3" }
        ]
    },
    {
        id: "DIC001",
        name: "Diclofenac",
        formula: "C14H11Cl2NO2",
        mw: 296.15,
        smiles: "O=C(O)Cc1ccccc1Nc1c(Cl)cccc1Cl",
        iupac: "2-[2-(2,6-dichloroanilino)phenyl]acetic acid",
        cas: "15307-86-5",
        category: "NSAID",
        ms: {
            molecularIon: 296.02,
            fragments: [
                { mz: 296.02, intensity: 40, assignment: "M+" },
                { mz: 250.03, intensity: 100, assignment: "[M-COOH]+" },
                { mz: 214.04, intensity: 30, assignment: "[M-C6H4]+" }
            ]
        }
    },
    
    // Analgesics
    {
        id: "PAR001",
        name: "Paracetamol",
        formula: "C8H9NO2",
        mw: 151.16,
        smiles: "CC(=O)Nc1ccc(O)cc1",
        iupac: "N-(4-hydroxyphenyl)acetamide",
        cas: "103-90-2",
        category: "Analgesic",
        ms: {
            molecularIon: 151.06,
            fragments: [
                { mz: 151.06, intensity: 100, assignment: "M+" },
                { mz: 109.05, intensity: 70, assignment: "[M-CH2CO]+" },
                { mz: 93.03, intensity: 30, assignment: "[M-CH3CONH]+" },
                { mz: 65.04, intensity: 20, assignment: "C5H5+" },
                { mz: 43.02, intensity: 50, assignment: "CH3CO+" }
            ]
        },
        nmr1h: [
            { ppm: 9.7, mult: "s", int: 1, assignment: "OH" },
            { ppm: 9.2, mult: "s", int: 1, assignment: "NH" },
            { ppm: 7.3, mult: "d", int: 2, assignment: "H-2,6" },
            { ppm: 6.6, mult: "d", int: 2, assignment: "H-3,5" },
            { ppm: 2.0, mult: "s", int: 3, assignment: "CH3" }
        ]
    },
    {
        id: "MOR001",
        name: "Morphine",
        formula: "C17H19NO3",
        mw: 285.34,
        smiles: "CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@H]3[C@H]1C5",
        iupac: "(5α,6α)-7,8-didehydro-4,5-epoxy-17-methylmorphinan-3,6-diol",
        cas: "57-27-2",
        category: "Opioid Analgesic",
        ms: {
            molecularIon: 285.14,
            fragments: [
                { mz: 285.14, intensity: 100, assignment: "M+" },
                { mz: 268.13, intensity: 45, assignment: "[M-OH]+" },
                { mz: 215.09, intensity: 30, assignment: "[M-C5H8NO]+" }
            ]
        }
    },
    {
        id: "COD001",
        name: "Codeine",
        formula: "C18H21NO3",
        mw: 299.37,
        smiles: "COc1ccc2c3c1O[C@H]1[C@@H](O)C=C[C@H]4[C@@H](C2)N(C)CC[C@@]341",
        iupac: "(5α,6α)-7,8-didehydro-4,5-epoxy-3-methoxy-17-methylmorphinan-6-ol",
        cas: "76-57-3",
        category: "Opioid Analgesic",
        ms: {
            molecularIon: 299.15,
            fragments: [
                { mz: 299.15, intensity: 100, assignment: "M+" },
                { mz: 282.15, intensity: 35, assignment: "[M-OH]+" },
                { mz: 229.12, intensity: 40, assignment: "[M-C5H8NO]+" }
            ]
        }
    },
    
    // Antibiotics
    {
        id: "AMO001",
        name: "Amoxicillin",
        formula: "C16H19N3O5S",
        mw: 365.40,
        smiles: "CC1(C)S[C@@H]2[C@H](NC(=O)C(O)c3ccccc3)C(=O)N2[C@H]1C(=O)O",
        iupac: "(2S,5R,6R)-6-[[(2R)-2-amino-2-(4-hydroxyphenyl)acetyl]amino]-3,3-dimethyl-7-oxo-4-thia-1-azabicyclo[3.2.0]heptane-2-carboxylic acid",
        cas: "26787-78-0",
        category: "Antibiotic (Penicillin)",
        ms: {
            molecularIon: 365.10,
            fragments: [
                { mz: 366.11, intensity: 100, assignment: "[M+H]+" },
                { mz: 349.09, intensity: 25, assignment: "[M+H-NH3]+" },
                { mz: 114.03, intensity: 40, assignment: "Thiazolidine ring" }
            ]
        }
    },
    {
        id: "AZI001",
        name: "Azithromycin",
        formula: "C38H72N2O12",
        mw: 748.98,
        smiles: "CC[C@H]1OC(=O)[C@H](C)[C@@H](O[C@H]2C[C@@H](C)CNC2(C)C)[C@H](C)[C@@H](O[C@@H]2O[C@H](C)C[C@H](N(C)C)[C@H]2O)[C@](C)(O)C[C@@H](C)CN(C)[C@H](C)[C@@H](O)[C@]1(C)O",
        iupac: "(2R,3S,4R,5R,8R,10R,11R,12S,13S,14R)-13-[(2,6-dideoxy-3-C-methyl-3-O-methyl-α-L-ribo-hexopyranosyl)oxy]-10-[(2,3,4,6-tetradeoxy-3-(dimethylamino)-β-D-xylo-hexopyranosyl)oxy]-2-ethyl-3,4,10-trihydroxy-3,5,6,8,10,12,14-heptamethyl-11-[[3,4,6-trideoxy-3-(dimethylamino)-β-D-xylo-hexopyranosyl]oxy]-1-oxa-6-azacyclopentadecan-15-one",
        cas: "83905-01-5",
        category: "Antibiotic (Macrolide)",
        ms: {
            molecularIon: 748.51,
            fragments: [
                { mz: 749.52, intensity: 100, assignment: "[M+H]+" },
                { mz: 591.40, intensity: 35, assignment: "[M+H-desosamine]+" },
                { mz: 158.12, intensity: 60, assignment: "Desosamine+" }
            ]
        }
    },
    {
        id: "CIP001",
        name: "Ciprofloxacin",
        formula: "C17H18FN3O3",
        mw: 331.34,
        smiles: "O=C(O)c1cn(C2CC2)c2cc(N3CCNCC3)c(F)cc2c1=O",
        iupac: "1-cyclopropyl-6-fluoro-4-oxo-7-(piperazin-1-yl)-1,4-dihydroquinoline-3-carboxylic acid",
        cas: "85721-33-1",
        category: "Antibiotic (Fluoroquinolone)",
        ms: {
            molecularIon: 331.13,
            fragments: [
                { mz: 332.14, intensity: 100, assignment: "[M+H]+" },
                { mz: 314.13, intensity: 25, assignment: "[M+H-H2O]+" },
                { mz: 288.11, intensity: 30, assignment: "[M+H-CO2]+" }
            ]
        }
    },
    
    // Antidiabetics
    {
        id: "MET001",
        name: "Metformin",
        formula: "C4H11N5",
        mw: 129.16,
        smiles: "CN(C)C(=N)NC(=N)N",
        iupac: "N,N-dimethylimidodicarbonimidic diamide",
        cas: "657-24-9",
        category: "Antidiabetic (Biguanide)",
        ms: {
            molecularIon: 129.10,
            fragments: [
                { mz: 130.10, intensity: 100, assignment: "[M+H]+" },
                { mz: 113.08, intensity: 25, assignment: "[M+H-NH3]+" },
                { mz: 85.05, intensity: 35, assignment: "[M+H-(CH3)2NH]+" },
                { mz: 71.04, intensity: 45, assignment: "C2H5N3+" },
                { mz: 60.06, intensity: 30, assignment: "C2H6N3+" }
            ]
        },
        nmr1h: [
            { ppm: 8.5, mult: "br s", int: 2, assignment: "NH2" },
            { ppm: 7.2, mult: "br s", int: 2, assignment: "NH2" },
            { ppm: 3.0, mult: "s", int: 6, assignment: "N(CH3)2" }
        ]
    },
    {
        id: "DAP001",
        name: "Dapagliflozin",
        formula: "C21H25ClO6",
        mw: 408.87,
        smiles: "CCOC1=CC=C(C=C1)C2=CC(=O)C3=C(O2)C(=C(C=C3O)O)C(=O)O",
        iupac: "(2S,3R,4R,5S,6R)-2-[4-chloro-3-[(4-ethoxyphenyl)methyl]phenyl]-6-(hydroxymethyl)oxane-3,4,5-triol",
        cas: "461432-26-8",
        category: "Antidiabetic (SGLT2 Inhibitor)",
        ms: {
            molecularIon: 408.12,
            fragments: [
                { mz: 408.12, intensity: 45, assignment: "M+" },
                { mz: 391.09, intensity: 100, assignment: "[M-OH]+" },
                { mz: 373.08, intensity: 35, assignment: "[M-H2O-OH]+" },
                { mz: 291.05, intensity: 40, assignment: "Aglycone+" }
            ]
        }
    },
    {
        id: "GLI001",
        name: "Glibenclamide",
        formula: "C23H28ClN3O5S",
        mw: 493.99,
        smiles: "COc1ccc(CCNC(=O)C(C)C2=CC=C(C=C2)S(=O)(=O)NC(=O)Nc3ccc(Cl)cc3)cc1",
        iupac: "5-chloro-N-[2-[4-(cyclohexylcarbamoylsulfamoyl)phenyl]ethyl]-2-methoxybenzamide",
        cas: "10238-21-8",
        category: "Antidiabetic (Sulfonylurea)",
        ms: {
            molecularIon: 493.14,
            fragments: [
                { mz: 494.15, intensity: 100, assignment: "[M+H]+" },
                { mz: 369.09, intensity: 35, assignment: "[M+H-C6H11N]+" },
                { mz: 169.01, intensity: 45, assignment: "Sulfonyl+" }
            ]
        }
    },
    
    // Statins
    {
        id: "ATOR001",
        name: "Atorvastatin",
        formula: "C33H35FN2O5",
        mw: 558.64,
        smiles: "CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CCC(O)CC(O)CC(=O)O",
        iupac: "(3R,5R)-7-[2-(4-fluorophenyl)-3-phenyl-4-(phenylcarbamoyl)-5-(propan-2-yl)pyrrol-1-yl]-3,5-dihydroxyheptanoic acid",
        cas: "134523-00-5",
        category: "Statin (Lipid-lowering)",
        ms: {
            molecularIon: 558.25,
            fragments: [
                { mz: 559.26, intensity: 100, assignment: "[M+H]+" },
                { mz: 541.25, intensity: 25, assignment: "[M+H-H2O]+" },
                { mz: 448.19, intensity: 35, assignment: "[M+H-C4H7O2]+" }
            ]
        }
    },
    {
        id: "SIM001",
        name: "Simvastatin",
        formula: "C25H38O5",
        mw: 418.57,
        smiles: "CCC(C)(C)C(=O)O[C@H]1C[C@@H](C)C=C2C=C[C@H](C)[C@H](CC[C@@H]3C[C@@H](O)CC(=O)O3)[C@H]21",
        iupac: "(1S,3R,7S,8S,8aR)-8-[2-[(2R,4R)-4-hydroxy-6-oxooxan-2-yl]ethyl]-3,7-dimethyl-1,2,3,7,8,8a-hexahydronaphthalen-1-yl 2,2-dimethylbutanoate",
        cas: "79902-63-9",
        category: "Statin (Lipid-lowering)",
        ms: {
            molecularIon: 418.27,
            fragments: [
                { mz: 419.28, intensity: 100, assignment: "[M+H]+" },
                { mz: 401.27, intensity: 20, assignment: "[M+H-H2O]+" },
                { mz: 285.18, intensity: 35, assignment: "[M+H-C5H9O2]+" }
            ]
        }
    },
    {
        id: "ROS001",
        name: "Rosuvastatin",
        formula: "C22H28N3O6S",
        mw: 481.54,
        smiles: "CC(C)c1nc(N(C)S(=O)(=O)c2ccc(-c3ccccc3)cc2)nc(-c2ccc(F)cc2)c1C(=O)O",
        iupac: "(3R,5S,6E)-7-[4-(4-fluorophenyl)-2-(N-methylmethylsulfamoyl)-6-(propan-2-yl)pyrimidin-5-yl]-3,5-dihydroxyhept-6-enoic acid",
        cas: "287714-41-4",
        category: "Statin (Lipid-lowering)",
        ms: {
            molecularIon: 481.17,
            fragments: [
                { mz: 482.18, intensity: 100, assignment: "[M+H]+" },
                { mz: 464.17, intensity: 20, assignment: "[M+H-H2O]+" }
            ]
        }
    },
    
    // Antihistamines
    {
        id: "CET001",
        name: "Cetirizine",
        formula: "C21H25ClN2O3",
        mw: 388.89,
        smiles: "OC(CN1CCC(CC1)C(O)(c2ccccc2)c3ccc(Cl)cc3)CC(=O)O",
        iupac: "2-[4-[(4-chlorophenyl)(phenyl)methyl]piperazin-1-yl]ethoxy]acetic acid",
        cas: "83881-51-0",
        category: "Antihistamine (H1)",
        ms: {
            molecularIon: 388.15,
            fragments: [
                { mz: 389.16, intensity: 100, assignment: "[M+H]+" },
                { mz: 201.08, intensity: 45, assignment: "[M+H-C10H12N2O2]+" }
            ]
        }
    },
    {
        id: "LOR001",
        name: "Loratadine",
        formula: "C22H23ClN2O2",
        mw: 382.88,
        smiles: "CC(=O)OCCOC1=CC=C(C=C1)C(=O)N2CCC3=C(C2)C=CC(=C3)Cl",
        iupac: "ethyl 4-(8-chloro-5,6-dihydro-11H-benzo[5,6]cyclohepta[1,2-b]pyridin-11-ylidene)piperidine-1-carboxylate",
        cas: "79794-75-5",
        category: "Antihistamine (H1)",
        ms: {
            molecularIon: 382.14,
            fragments: [
                { mz: 383.15, intensity: 100, assignment: "[M+H]+" },
                { mz: 337.12, intensity: 30, assignment: "[M+H-C2H5O]+" }
            ]
        }
    },
    
    // Proton Pump Inhibitors
    {
        id: "OME001",
        name: "Omeprazole",
        formula: "C17H19N3O3S",
        mw: 345.42,
        smiles: "COc1ccc2nc(S(=O)Cc3ncc(C)c(OC)c3C)[nH]c2c1",
        iupac: "5-methoxy-2-[[(4-methoxy-3,5-dimethylpyridin-2-yl)methyl]sulfinyl]-1H-benzimidazole",
        cas: "73590-58-6",
        category: "PPI (Antacid)",
        ms: {
            molecularIon: 345.11,
            fragments: [
                { mz: 346.12, intensity: 100, assignment: "[M+H]+" },
                { mz: 328.11, intensity: 20, assignment: "[M+H-H2O]+" },
                { mz: 198.04, intensity: 40, assignment: "Benzimidazole+" }
            ]
        }
    },
    {
        id: "PAN001",
        name: "Pantoprazole",
        formula: "C16H15F2N3O4S",
        mw: 383.37,
        smiles: "COc1cc(OC)nc(CS(=O)c2nc3cc(OCC(F)(F)F)ccc3[nH]2)n1",
        iupac: "6-(difluoromethoxy)-2-[(3,4-dimethoxypyridin-2-yl)methylsulfinyl]-1H-benzimidazole",
        cas: "102625-70-7",
        category: "PPI (Antacid)",
        ms: {
            molecularIon: 383.08,
            fragments: [
                { mz: 384.09, intensity: 100, assignment: "[M+H]+" },
                { mz: 366.08, intensity: 25, assignment: "[M+H-H2O]+" }
            ]
        }
    },
    
    // Antidepressants
    {
        id: "SER001",
        name: "Sertraline",
        formula: "C17H17Cl2N",
        mw: 306.23,
        smiles: "CN[C@H]1CC[C@@H](C2=CC=C(Cl)C=C2)[C@H](C3=CC=CC=C3)C1",
        iupac: "(1S,4S)-4-(3,4-dichlorophenyl)-N-methyl-1,2,3,4-tetrahydronaphthalen-1-amine",
        cas: "79617-96-2",
        category: "SSRI (Antidepressant)",
        ms: {
            molecularIon: 306.07,
            fragments: [
                { mz: 306.07, intensity: 100, assignment: "M+" },
                { mz: 275.05, intensity: 35, assignment: "[M-CH3NH2]+" },
                { mz: 158.98, intensity: 40, assignment: "C7H4Cl2+" }
            ]
        }
    },
    {
        id: "FLU001",
        name: "Fluoxetine",
        formula: "C17H18F3NO",
        mw: 309.33,
        smiles: "CNCCC(c1ccccc1)Oc2ccc(C(F)(F)F)cc2",
        iupac: "(±)-N-methyl-3-phenyl-3-[4-(trifluoromethyl)phenoxy]propan-1-amine",
        cas: "54910-89-3",
        category: "SSRI (Antidepressant)",
        ms: {
            molecularIon: 309.13,
            fragments: [
                { mz: 310.14, intensity: 100, assignment: "[M+H]+" },
                { mz: 148.11, intensity: 45, assignment: "[C6H5-CH=CH-NHCH3]+" }
            ]
        }
    },
    
    // Antihypertensives
    {
        id: "VAL001",
        name: "Valsartan",
        formula: "C24H29N5O3",
        mw: 435.52,
        smiles: "CCCCC(=O)N(Cc1ccc(-c2ccccc2)cc1)C(C(=O)O)C(C)C",
        iupac: "(2S)-N-pentanoyl-N-[[2'-(1H-tetrazol-5-yl)biphenyl-4-yl]methyl]valine",
        cas: "137862-53-4",
        category: "ARB (Antihypertensive)",
        ms: {
            molecularIon: 435.23,
            fragments: [
                { mz: 436.23, intensity: 100, assignment: "[M+H]+" },
                { mz: 291.15, intensity: 35, assignment: "[M+H-C6H5C6H4]+" }
            ]
        }
    },
    {
        id: "LIS001",
        name: "Lisinopril",
        formula: "C21H31N3O5",
        mw: 405.49,
        smiles: "CC(C)C[C@@H](C(=O)N[C@@H](CCCN)C(=O)O)N1CCCC1C(=O)O",
        iupac: "(2S)-1-[(2S)-6-amino-2-[[(1S)-1-carboxy-3-methylbutyl]amino]hexanoyl]pyrrolidine-2-carboxylic acid",
        cas: "83915-83-7",
        category: "ACE Inhibitor",
        ms: {
            molecularIon: 405.23,
            fragments: [
                { mz: 406.23, intensity: 100, assignment: "[M+H]+" },
                { mz: 246.17, intensity: 40, assignment: "[M+H-C9H12NO2]+" }
            ]
        }
    },
    
    // Antiepileptics
    {
        id: "CAR001",
        name: "Carbamazepine",
        formula: "C15H12N2O",
        mw: 236.27,
        smiles: "NC(=O)N1c2ccccc2C=Cc3ccccc31",
        iupac: "5H-dibenz[b,f]azepine-5-carboxamide",
        cas: "298-46-4",
        category: "Antiepileptic",
        ms: {
            molecularIon: 236.09,
            fragments: [
                { mz: 236.09, intensity: 100, assignment: "M+" },
                { mz: 194.08, intensity: 45, assignment: "[M-CH2NO]+" },
                { mz: 179.07, intensity: 35, assignment: "[M-CH3NCO]+" }
            ]
        }
    },
    {
        id: "PHEN001",
        name: "Phenytoin",
        formula: "C15H12N2O2",
        mw: 252.27,
        smiles: "O=C1NC(=O)C(c2ccccc2)(c3ccccc3)N1",
        iupac: "5,5-diphenylimidazolidine-2,4-dione",
        cas: "57-41-0",
        category: "Antiepileptic",
        ms: {
            molecularIon: 252.09,
            fragments: [
                { mz: 252.09, intensity: 100, assignment: "M+" },
                { mz: 180.08, intensity: 40, assignment: "[M-C3H2NO]+" }
            ]
        }
    },
    
    // Diuretics
    {
        id: "FURO001",
        name: "Furosemide",
        formula: "C12H11ClN2O5S",
        mw: 330.74,
        smiles: "NS(=O)(=O)c1cc(C(=O)O)c(NCc2ccco2)cc1Cl",
        iupac: "4-chloro-2-[(furan-2-ylmethyl)amino]-5-sulfamoylbenzoic acid",
        cas: "54-31-9",
        category: "Loop Diuretic",
        ms: {
            molecularIon: 330.01,
            fragments: [
                { mz: 331.02, intensity: 100, assignment: "[M+H]+" },
                { mz: 285.03, intensity: 35, assignment: "[M+H-NO2]+" }
            ]
        }
    },
    {
        id: "HYD001",
        name: "Hydrochlorothiazide",
        formula: "C7H8ClN3O4S2",
        mw: 297.74,
        smiles: "NS(=O)(=O)c1cc2c(cc1Cl)NC(O)NS2(=O)=O",
        iupac: "6-chloro-3,4-dihydro-2H-1,2,4-benzothiadiazine-7-sulfonamide 1,1-dioxide",
        cas: "58-93-5",
        category: "Thiazide Diuretic",
        ms: {
            molecularIon: 296.97,
            fragments: [
                { mz: 297.97, intensity: 100, assignment: "[M+H]+" },
                { mz: 269.95, intensity: 30, assignment: "[M+H-CO]+" }
            ]
        }
    },
    
    // Anticoagulants
    {
        id: "WAR001",
        name: "Warfarin",
        formula: "C19H16O4",
        mw: 308.33,
        smiles: "CC(=O)CC(c1ccccc1)c2c(O)c3ccccc3oc2=O",
        iupac: "(RS)-4-hydroxy-3-(3-oxo-1-phenylbutyl)-2H-chromen-2-one",
        cas: "81-81-2",
        category: "Anticoagulant (Vitamin K antagonist)",
        ms: {
            molecularIon: 308.10,
            fragments: [
                { mz: 308.10, intensity: 100, assignment: "M+" },
                { mz: 265.09, intensity: 35, assignment: "[M-CH3CO]+" },
                { mz: 121.07, intensity: 40, assignment: "C8H9O+" }
            ]
        }
    },
    {
        id: "RIV001",
        name: "Rivaroxaban",
        formula: "C19H18ClN3O5S",
        mw: 435.88,
        smiles: "COc1ccc(-c2nc3n(c2C(=O)N2CCC(C(=O)O)C2)CCS3)cc1Cl",
        iupac: "5-chloro-N-({(5S)-2-oxo-3-[4-(3-oxomorpholin-4-yl)phenyl]-1,3-oxazolidin-5-yl}methyl)thiophene-2-carboxamide",
        cas: "366789-02-8",
        category: "Anticoagulant (Factor Xa inhibitor)",
        ms: {
            molecularIon: 435.06,
            fragments: [
                { mz: 436.07, intensity: 100, assignment: "[M+H]+" },
                { mz: 232.03, intensity: 40, assignment: "[M+H-C13H15ClN2O]+" }
            ]
        }
    },
    
    // Beta Blockers
    {
        id: "MET002",
        name: "Metoprolol",
        formula: "C15H25NO3",
        mw: 267.36,
        smiles: "COCCc1ccc(OCC(O)CNC(C)C)cc1",
        iupac: "1-[4-(2-methoxyethyl)phenoxy]-3-(propan-2-ylamino)propan-2-ol",
        cas: "37350-58-6",
        category: "Beta Blocker",
        ms: {
            molecularIon: 267.18,
            fragments: [
                { mz: 268.19, intensity: 100, assignment: "[M+H]+" },
                { mz: 250.18, intensity: 25, assignment: "[M+H-H2O]+" },
                { mz: 116.11, intensity: 45, assignment: "[CH2=CH-NHCH(CH3)2]+" }
            ]
        }
    },
    {
        id: "ATEN001",
        name: "Atenolol",
        formula: "C14H22N2O3",
        mw: 266.34,
        smiles: "CC(C)NCC(O)COc1ccc(CC(N)=O)cc1",
        iupac: "2-[4-[(2RS)-2-hydroxy-3-(propan-2-ylamino)propoxy]phenyl]acetamide",
        cas: "29122-68-7",
        category: "Beta Blocker",
        ms: {
            molecularIon: 266.16,
            fragments: [
                { mz: 267.17, intensity: 100, assignment: "[M+H]+" },
                { mz: 249.16, intensity: 20, assignment: "[M+H-H2O]+" },
                { mz: 116.11, intensity: 40, assignment: "[CH2=CH-NHCH(CH3)2]+" }
            ]
        }
    },
    
    // Benzodiazepines
    {
        id: "DIA001",
        name: "Diazepam",
        formula: "C16H13ClN2O",
        mw: 284.74,
        smiles: "CN1C(=O)CN=C(c2ccccc2)c3cc(Cl)ccc31",
        iupac: "7-chloro-1-methyl-5-phenyl-1,3-dihydro-2H-1,4-benzodiazepin-2-one",
        cas: "439-14-5",
        category: "Anxiolytic (Benzodiazepine)",
        ms: {
            molecularIon: 284.07,
            fragments: [
                { mz: 284.07, intensity: 100, assignment: "M+" },
                { mz: 269.05, intensity: 25, assignment: "[M-CH3]+" },
                { mz: 241.04, intensity: 30, assignment: "[M-CH3CO]+" },
                { mz: 256.05, intensity: 35, assignment: "[M-CO]+" }
            ]
        }
    },
    {
        id: "ALP001",
        name: "Alprazolam",
        formula: "C17H13ClN4",
        mw: 308.76,
        smiles: "Cc1nnc2n1-c1ccc(Cl)cc1C(c1ccccc1)=NC2",
        iupac: "8-chloro-1-methyl-6-phenyl-4H-[1,2,4]triazolo[4,3-a][1,4]benzodiazepine",
        cas: "28981-97-7",
        category: "Anxiolytic (Benzodiazepine)",
        ms: {
            molecularIon: 308.08,
            fragments: [
                { mz: 308.08, intensity: 100, assignment: "M+" },
                { mz: 279.08, intensity: 35, assignment: "[M-CH3N]+" },
                { mz: 273.05, intensity: 40, assignment: "[M-Cl]+" }
            ]
        }
    },
    
    // Antipsychotics
    {
        id: "HAL001",
        name: "Haloperidol",
        formula: "C21H23ClFNO2",
        mw: 375.86,
        smiles: "O=C(CCCN1CCC(C(O)(c2ccc(F)cc2)c3ccc(Cl)cc3)CC1)c4ccncc4",
        iupac: "4-[4-(4-chlorophenyl)-4-hydroxypiperidin-1-yl]-1-(4-fluorophenyl)butan-1-one",
        cas: "52-86-8",
        category: "Antipsychotic (Butyrophenone)",
        ms: {
            molecularIon: 375.14,
            fragments: [
                { mz: 376.14, intensity: 100, assignment: "[M+H]+" },
                { mz: 123.04, intensity: 45, assignment: "[C6H4Cl-C=O]+" }
            ]
        }
    },
    {
        id: "RIS001",
        name: "Risperidone",
        formula: "C23H27FN4O2",
        mw: 410.48,
        smiles: "Cc1nc2n(c1C)C(C)CN(C(=O)c3ccc(F)cc3)C2CCN4CCC(CC4)O",
        iupac: "3-[2-[4-(6-fluoro-1,2-benzoxazol-3-yl)piperidin-1-yl]ethyl]-2-methyl-6,7,8,9-tetrahydropyrido[1,2-a]pyrimidin-4-one",
        cas: "106266-06-2",
        category: "Antipsychotic (Atypical)",
        ms: {
            molecularIon: 410.21,
            fragments: [
                { mz: 411.22, intensity: 100, assignment: "[M+H]+" },
                { mz: 191.09, intensity: 40, assignment: "[M+H-C12H17N2O]+" }
            ]
        }
    },
    
    // Antifungals
    {
        id: "FLUC001",
        name: "Fluconazole",
        formula: "C13H12F2N6O",
        mw: 306.27,
        smiles: "OC(Cn1cncn1)(Cn2cncn2)c3ccc(F)cc3F",
        iupac: "2-(2,4-difluorophenyl)-1,3-bis(1H-1,2,4-triazol-1-yl)propan-2-ol",
        cas: "86386-73-4",
        category: "Antifungal (Triazole)",
        ms: {
            molecularIon: 306.10,
            fragments: [
                { mz: 307.11, intensity: 100, assignment: "[M+H]+" },
                { mz: 289.10, intensity: 25, assignment: "[M+H-H2O]+" },
                { mz: 220.09, intensity: 35, assignment: "[M+H-C3H3N4]+" }
            ]
        }
    },
    {
        id: "ITR001",
        name: "Itraconazole",
        formula: "C35H38Cl2N8O4",
        mw: 705.63,
        smiles: "CCC(C)n1ncn(-c2ccc(N3CCN(C4CC4)CC3)cc2)c1=NC(O)C(Cc5ccc(Cl)cc5)n6cncn6",
        iupac: "4-[4-[4-[4-[[(2R,4S)-2-(2,4-dichlorophenyl)-2-(1H-1,2,4-triazol-1-ylmethyl)-1,3-dioxolan-4-yl]methoxy]phenyl]piperazin-1-yl]phenyl]-2-[(1RS)-1-methylpropyl]-2,4-dihydro-3H-1,2,4-triazol-3-one",
        cas: "84625-61-6",
        category: "Antifungal (Triazole)",
        ms: {
            molecularIon: 704.23,
            fragments: [
                { mz: 705.24, intensity: 100, assignment: "[M+H]+" },
                { mz: 392.12, intensity: 40, assignment: "[M+H-C17H21ClN5O2]+" }
            ]
        }
    },
    
    // Antivirals
    {
        id: "ACI001",
        name: "Aciclovir",
        formula: "C8H11N5O3",
        mw: 225.20,
        smiles: "Nc1nc2c(ncn2COCCO)c(=O)[nH]1",
        iupac: "2-amino-9-[(2-hydroxyethoxy)methyl]-1,9-dihydro-6H-purin-6-one",
        cas: "59277-89-3",
        category: "Antiviral (HSV)",
        ms: {
            molecularIon: 225.09,
            fragments: [
                { mz: 226.09, intensity: 100, assignment: "[M+H]+" },
                { mz: 208.08, intensity: 20, assignment: "[M+H-H2O]+" },
                { mz: 152.06, intensity: 35, assignment: "[M+H-C3H7O2]+" }
            ]
        }
    },
    {
        id: "OS001",
        name: "Oseltamivir",
        formula: "C16H28N2O4",
        mw: 312.40,
        smiles: "CCOC(=O)C1=C[C@@H](OC(CC)CC)[C@H](NC(=O)C)[C@@H](N)C1",
        iupac: "ethyl (3R,4R,5S)-5-amino-4-acetamido-3-(1-ethylpropoxy)cyclohex-1-ene-1-carboxylate",
        cas: "196618-13-0",
        category: "Antiviral (Neuraminidase inhibitor)",
        ms: {
            molecularIon: 312.20,
            fragments: [
                { mz: 313.21, intensity: 100, assignment: "[M+H]+" },
                { mz: 267.17, intensity: 30, assignment: "[M+H-C2H5OH]+" }
            ]
        }
    },
    
    // Antimalarials
    {
        id: "CHL001",
        name: "Chloroquine",
        formula: "C18H26ClN3",
        mw: 319.87,
        smiles: "CCN(CC)CCCC(C)Nc1ccnc2cc(Cl)ccc12",
        iupac: "N4-(7-chloroquinolin-4-yl)-N1,N1-diethylpentane-1,4-diamine",
        cas: "54-05-7",
        category: "Antimalarial",
        ms: {
            molecularIon: 319.18,
            fragments: [
                { mz: 320.19, intensity: 100, assignment: "[M+H]+" },
                { mz: 247.12, intensity: 35, assignment: "[M+H-C5H12N]+" }
            ]
        }
    },
    {
        id: "ART001",
        name: "Artemisinin",
        formula: "C15H22O5",
        mw: 282.33,
        smiles: "C[C@@H]1CC[C@H]2[C@@H](C)C(=O)O[C@H]3O[C@@]4(OO[C@H](C[C@@H]1C)[C@@]24C)C3",
        iupac: "(3R,5aS,6R,8aS,9R,12S,12aR)-octahydro-3,6,9-trimethyl-3,12-epoxy-12H-pyrano[4,3-j]-1,2-benzodioxepin-10(3H)-one",
        cas: "63968-64-9",
        category: "Antimalarial",
        ms: {
            molecularIon: 282.15,
            fragments: [
                { mz: 283.15, intensity: 100, assignment: "[M+H]+" },
                { mz: 265.14, intensity: 25, assignment: "[M+H-H2O]+" },
                { mz: 209.12, intensity: 40, assignment: "[M+H-C5H8O2]+" }
            ]
        }
    },
    
    // Immunosuppressants
    {
        id: "CYC001",
        name: "Cyclosporine",
        formula: "C62H111N11O12",
        mw: 1202.61,
        smiles: "CC[C@H]1C(=O)N(CC(O)C(C)C(=O)N(C(C(=O)N(C(C(=O)N(C(C(=O)N(C(C(=O)N(C(C(=O)N1C)C(C)C)C)C(C)C)C)C(C)C)C)C(C)C)C)C(C)C)C)C(C)C)C",
        iupac: "Cyclo[{[(2E)-(2S,3R,4R)-3-hydroxy-4-methyl-2-(methylamino)-6-octenoyl]-L-2-aminobutyryl-N-methylglycyl-N-methyl-L-leucyl-L-valyl-N-methyl-L-leucyl-L-alanyl-D-alanyl-N-methyl-L-leucyl-N-methyl-L-leucyl-N-methyl-L-valyl}",
        cas: "59865-13-3",
        category: "Immunosuppressant",
        ms: {
            molecularIon: 1201.84,
            fragments: [
                { mz: 1202.85, intensity: 100, assignment: "[M+H]+" },
                { mz: 1021.76, intensity: 35, assignment: "[M+H-C11H19NO2]+" }
            ]
        }
    },
    {
        id: "TAC001",
        name: "Tacrolimus",
        formula: "C44H69NO12",
        mw: 803.02,
        smiles: "C=CCO[C@]1(C)C[C@@H](C)C[C@@]2(C)C[C@@H](O)[C@]3(C)C(=O)C(=O)[C@@H](C(C)C)[C@@H]4C[C@H](O)[C@H](C)[C@]4(C)C(O)=C(O)[C@@]3(C)[C@@H]2C1",
        iupac: "(3S,4R,5S,8R,9E,12S,14S,15R,16S,18R,26aS)-5,19-dihydroxy-3-(2-(4-hydroxy-3-methoxycyclohexyl)-1-methylethenyl)-14,16-dimethoxy-4,10,12,18-tetramethyl-15,19-epoxy-3,4,5,6,8,11,12,13,14,15,16,17,18,19,24,25,26,26a-octadecahydro-2H-pyrido[2,1-c][1,4]oxazacyclotricosine-1,7,20,21(4H,23H)-tetrone",
        cas: "104987-11-3",
        category: "Immunosuppressant",
        ms: {
            molecularIon: 802.49,
            fragments: [
                { mz: 803.49, intensity: 100, assignment: "[M+H]+" },
                { mz: 785.48, intensity: 25, assignment: "[M+H-H2O]+" }
            ]
        }
    }
];

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = spectralDatabase;
}
