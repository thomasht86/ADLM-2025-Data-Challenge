/**
 * Sample data for testing (will be replaced by real Vespa API calls)
 */

const SAMPLE_DATA = {
    // Sample search results
    searchResults: {
        'tb pcr': {
            totalCount: 3,
            results: [
                {
                    id: 'doc001',
                    title: 'MYCOBACTERIUM_TUBERCULOSIS_PCR',
                    documentType: 'SOP',
                    category: 'Microbiology',
                    date: '2024-10-15',
                    snippet: 'Specimen Types: Sputum, BAL, tissue, other body fluids. Collection: Collect specimens in sterile containers. Transport: Transport specimens to the laboratory immediately. If delays are expected, keep specimens refrigerated at 2-8°C.',
                    highlights: ['specimen', 'transport', 'refrigerated'],
                    score: 0.92,
                    pdfPath: '/LabDocs/Synthetic_Procedures/MYCOBACTERIUM_TUBERCULOSIS_PCR.pdf',
                    section: 'Specimen Requirements and Stability',
                    pageNumber: 2,
                },
                {
                    id: 'doc002',
                    title: 'MYCOBACTERIUM_TUBERCULOSIS_PCR',
                    documentType: 'SOP',
                    category: 'Microbiology',
                    date: '2024-10-15',
                    snippet: 'PCR Setup: Prepare the PCR Master Mix by combining PCR Buffer, dNTPs, Primers/Probes specific for Mycobacterium tuberculosis, Taq Polymerase, and Nucleic Acid-Free Water. Aliquot the Master Mix into PCR tubes.',
                    highlights: ['PCR', 'tuberculosis'],
                    score: 0.87,
                    pdfPath: '/LabDocs/Synthetic_Procedures/MYCOBACTERIUM_TUBERCULOSIS_PCR.pdf',
                    section: 'PCR Setup',
                    pageNumber: 4,
                },
                {
                    id: 'doc003',
                    title: 'MYCOBACTERIUM_TUBERCULOSIS_PCR',
                    documentType: 'SOP',
                    category: 'Microbiology',
                    date: '2024-10-15',
                    snippet: 'Data Analysis: Use the PCR cycler software to interpret the amplification curves. Threshold Cycle (Ct) values: Ct < 35 is considered positive. Ct ≥ 35 requires further review (weak positive or negative as per consultation with supervisor).',
                    highlights: ['Ct', 'positive', 'negative'],
                    score: 0.81,
                    pdfPath: '/LabDocs/Synthetic_Procedures/MYCOBACTERIUM_TUBERCULOSIS_PCR.pdf',
                    section: 'Data Analysis',
                    pageNumber: 5,
                },
            ],
            aiSummary: 'For Mycobacterium tuberculosis PCR testing, specimen collection requires sterile containers [1]. Acceptable specimen types include sputum, bronchoalveolar lavage (BAL), tissue, and other body fluids [1]. Specimens should be transported to the laboratory immediately, or refrigerated at 2-8°C if delays are expected [1].\n\nThe PCR analysis uses a threshold Ct value of 35, where Ct < 35 is considered positive [3]. Results are reported as qualitative (Positive/Negative/Indeterminate) [3].',
            relatedQuestions: [
                'What is the transport temperature for TB specimens?',
                'How long can TB specimens be stored before testing?',
                'What are the quality control requirements for TB PCR?',
                'What causes false negatives in TB PCR?',
            ],
        },
        'cardiac': {
            totalCount: 2,
            results: [
                {
                    id: 'doc004',
                    title: 'AlloMap Heart Molecular Expression Testing',
                    documentType: '510(k)',
                    category: 'Cardiology',
                    date: '2023-09-06',
                    snippet: 'AlloMap Heart Molecular Expression Testing is an In Vitro Diagnostic Multivariate Index assay (IVDMIA) test service, performed in a single laboratory, assessing the gene expression profile of RNA isolated from peripheral blood mononuclear cells (PBMC).',
                    highlights: ['cardiac', 'AlloMap', 'gene expression'],
                    score: 0.89,
                    pdfPath: '/LabDocs/FDA_510k/K221640_AlloMap.pdf',
                    section: 'Indications for Use',
                    pageNumber: 1,
                },
                {
                    id: 'doc005',
                    title: 'AlloMap Heart Molecular Expression Testing',
                    documentType: '510(k)',
                    category: 'Cardiology',
                    date: '2023-09-06',
                    snippet: 'Indicated for use in heart transplant recipients: 15 years of age or older, At least 2 months (≥55 days) post-transplant. AlloMap Heart Testing is intended to aid in the identification of heart transplant recipients with stable allograft function who have a low probability of moderate/severe acute cellular rejection (ACR).',
                    highlights: ['heart transplant', 'rejection'],
                    score: 0.85,
                    pdfPath: '/LabDocs/FDA_510k/K221640_AlloMap.pdf',
                    section: 'Indications for Use',
                    pageNumber: 2,
                },
            ],
            aiSummary: 'AlloMap Heart Molecular Expression Testing is an FDA-cleared diagnostic test that assesses gene expression profiles from peripheral blood mononuclear cells (PBMC) [1]. It is intended to aid in identifying heart transplant recipients with stable allograft function who have a low probability of moderate/severe acute cellular rejection (ACR) [2].\n\nThe test is indicated for heart transplant recipients who are 15 years of age or older and at least 2 months (≥55 days) post-transplant [2].',
            relatedQuestions: [
                'What is the AlloMap score range?',
                'How is AlloMap used in clinical practice?',
                'What are the performance characteristics of AlloMap?',
            ],
        },
        'specimen requirements': {
            totalCount: 5,
            results: [
                {
                    id: 'doc001',
                    title: 'MYCOBACTERIUM_TUBERCULOSIS_PCR',
                    documentType: 'SOP',
                    category: 'Microbiology',
                    date: '2024-10-15',
                    snippet: 'Specimen Types: Sputum, BAL, tissue, other body fluids. Collection: Collect specimens in sterile containers. Transport: Transport specimens to the laboratory immediately. If delays are expected, keep specimens refrigerated at 2-8°C.',
                    highlights: ['specimen', 'requirements', 'collection'],
                    score: 0.95,
                    pdfPath: '/LabDocs/Synthetic_Procedures/MYCOBACTERIUM_TUBERCULOSIS_PCR.pdf',
                    section: 'Specimen Requirements and Stability',
                    pageNumber: 2,
                },
            ],
            aiSummary: 'Specimen requirements vary by test type. For Mycobacterium tuberculosis PCR testing, acceptable specimens include sputum, bronchoalveolar lavage (BAL), tissue, and other body fluids [1]. All specimens must be collected in sterile containers and transported to the laboratory immediately [1]. If transport delays are expected, specimens should be refrigerated at 2-8°C [1].',
            relatedQuestions: [
                'What specimens are unacceptable for testing?',
                'How should specimens be labeled?',
                'What is the specimen stability period?',
            ],
        },
    },

    // Sample autocomplete suggestions
    autocomplete: {
        'sp': ['specimen requirements', 'specimen collection', 'specimen transport', 'specimen stability'],
        'tb': ['tb pcr', 'tuberculosis testing', 'tb specimen requirements'],
        'car': ['cardiac testing', 'cardiac allograft', 'cardiac biomarkers'],
        'fda': ['fda 510k', 'fda clearance', 'fda approval'],
        'pcr': ['pcr analysis', 'pcr setup', 'pcr quality control'],
    },
};

// Helper function to get mock search results
function getMockSearchResults(query) {
    const lowerQuery = query.toLowerCase();

    // Simple keyword matching
    for (const [key, data] of Object.entries(SAMPLE_DATA.searchResults)) {
        if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
            return data;
        }
    }

    // Default empty result
    return {
        totalCount: 0,
        results: [],
        aiSummary: null,
        relatedQuestions: [],
    };
}

// Helper function to get mock autocomplete suggestions
function getMockAutocompleteSuggestions(query) {
    const lowerQuery = query.toLowerCase();

    for (const [key, suggestions] of Object.entries(SAMPLE_DATA.autocomplete)) {
        if (lowerQuery.startsWith(key)) {
            return suggestions.filter(s => s.toLowerCase().includes(lowerQuery));
        }
    }

    return [];
}

// Make available globally
window.SAMPLE_DATA = SAMPLE_DATA;
window.getMockSearchResults = getMockSearchResults;
window.getMockAutocompleteSuggestions = getMockAutocompleteSuggestions;
