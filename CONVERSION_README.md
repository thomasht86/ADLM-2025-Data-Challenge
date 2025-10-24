# Vespa Feed Conversion

## Overview
This document describes the conversion of FDA 510(k) and Lab SOP documents to Vespa feed format.

## Files

### Input Files
- `fda_510k_extracted_20251024_173142.json` - 5 FDA 510(k) documents
- `lab_sop_extracted_20251024_173248.json` - 5 Lab SOP documents

### Output File
- `rag-blueprint/dataset/medical_docs.jsonl` - 10 documents in Vespa feed format

### Conversion Script
- `convert_to_vespa_feed.py` - Python script for conversion

## Schema Mapping

### Common Fields (Both Document Types)
- `id` - Unique document identifier
- `title` - Document title (from `device_trade_name` for FDA, `procedure_name` for SOP)
- `text` - Main text content (from `intended_use` for FDA, `purpose` for SOP)
- `created_timestamp` - Document creation timestamp (Unix timestamp)
- `modified_timestamp` - Last modification timestamp (Unix timestamp)
- `last_opened_timestamp` - Last opened timestamp (Unix timestamp)
- `open_count` - Number of times opened
- `favorite` - Favorite flag (boolean)
- `analyte_biomarker` - Analyte or biomarker name
- `medical_specialty` - Medical specialty

### FDA-Specific Fields
- `device_trade_name` - Name of the medical device
- `product_code` - FDA product code
- `intended_use` - Intended use description
- `manufacturer_name` - Manufacturer name
- `fda_decision_date` - FDA decision date (converted from MM-DD-YYYY to Unix timestamp)

### SOP-Specific Fields
- `procedure_name` - Name of the procedure
- `specimen_type` - Type of specimen
- `purpose` - Purpose of the procedure
- `equipment` - Array of equipment items
- `reagents` - Array of reagent items
- `quality_control` - Quality control procedures
- `interpretation_guidelines` - Guidelines for interpretation

## Usage

### Running the Conversion
```bash
python convert_to_vespa_feed.py
```

### Output Format
Each line in `medical_docs.jsonl` is a JSON object with the structure:
```json
{
  "put": "id:doc:doc::<id>",
  "fields": {
    "id": "<id>",
    "title": "...",
    "text": "...",
    ...
  }
}
```

## Statistics
- Total FDA documents: 5
- Total SOP documents: 5
- Total documents in feed: 10
- Document IDs: 1-10 (FDA: 1-5, SOP: 6-10)

## Notes
- FDA dates are converted from MM-DD-YYYY string format to Unix timestamps
- Empty or null values are handled gracefully
- Arrays (equipment, reagents) are preserved as JSON arrays
- Current timestamp is used for created/modified/last_opened fields
- All documents start with open_count=0 and favorite=false
