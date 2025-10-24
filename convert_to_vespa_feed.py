#!/usr/bin/env python3
"""
Convert FDA 510(k) and Lab SOP extracted data to Vespa feed format.
"""

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional


def parse_fda_date(date_str: str) -> int:
    """
    Convert FDA date string (MM-DD-YYYY) to Unix timestamp.
    
    Args:
        date_str: Date string in format MM-DD-YYYY
        
    Returns:
        Unix timestamp as integer
    """
    try:
        dt = datetime.strptime(date_str, "%m-%d-%Y")
        return int(dt.timestamp())
    except (ValueError, AttributeError):
        # Return current timestamp if parsing fails
        return int(datetime.now().timestamp())


def create_fda_document(data: Dict[str, Any], doc_id: int, file_name: str) -> Dict[str, Any]:
    """
    Create a Vespa document from FDA 510(k) data.
    
    Args:
        data: FDA document data
        doc_id: Unique document ID
        file_name: Source file name
        
    Returns:
        Vespa feed document
    """
    # Build text field from intended_use
    text = data.get("intended_use", "")
    
    fields = {
        "id": str(doc_id),
        "text": text,
        # Common fields
        "analyte_biomarker": data.get("analyte_biomarker", ""),
        "medical_specialty": data.get("medical_specialty", ""),
        # FDA-specific fields
        "device_trade_name": data.get("device_trade_name", ""),
        "product_code": data.get("product_code", ""),
        "intended_use": data.get("intended_use", ""),
        "manufacturer_name": data.get("manufacturer_name", ""),
        "fda_decision_date": parse_fda_date(data.get("fda_decision_date", "")),
    }
    
    return {
        "put": f"id:doc:doc::{doc_id}",
        "fields": fields
    }


def create_sop_document(data: Dict[str, Any], doc_id: int, file_name: str) -> Dict[str, Any]:
    """
    Create a Vespa document from Lab SOP data.
    
    Args:
        data: SOP document data
        doc_id: Unique document ID
        file_name: Source file name
        
    Returns:
        Vespa feed document
    """
    # Build text field from purpose
    text = data.get("purpose", "")
    
    fields = {
        "id": str(doc_id),
        "text": text,
        # Common fields
        "analyte_biomarker": data.get("analyte_biomarker", ""),
        "medical_specialty": data.get("medical_specialty") if data.get("medical_specialty") else "",
        # SOP-specific fields
        "procedure_name": data.get("procedure_name", ""),
        "specimen_type": data.get("specimen_type", ""),
        "purpose": data.get("purpose", ""),
        "equipment": data.get("equipment", []),
        "reagents": data.get("reagents", []),
        "quality_control": data.get("quality_control", ""),
        "interpretation_guidelines": data.get("interpretation_guidelines", ""),
    }
    
    return {
        "put": f"id:doc:doc::{doc_id}",
        "fields": fields
    }


def convert_json_to_vespa_feed(
    fda_json_path: str,
    sop_json_path: str,
    output_path: str
) -> None:
    """
    Convert FDA and SOP JSON files to Vespa feed format.
    
    Args:
        fda_json_path: Path to FDA JSON file
        sop_json_path: Path to SOP JSON file
        output_path: Path to output JSONL file
    """
    doc_id = 1
    documents = []
    
    # Process FDA documents
    print(f"Processing FDA documents from {fda_json_path}...")
    with open(fda_json_path, 'r', encoding='utf-8') as f:
        fda_data = json.load(f)
        
    for result in fda_data.get("results", []):
        file_name = result.get("file", "")
        data = result.get("data", {})
        doc = create_fda_document(data, doc_id, file_name)
        documents.append(doc)
        doc_id += 1
    
    print(f"Processed {len(fda_data.get('results', []))} FDA documents")
    
    # Process SOP documents
    print(f"Processing SOP documents from {sop_json_path}...")
    with open(sop_json_path, 'r', encoding='utf-8') as f:
        sop_data = json.load(f)
        
    for result in sop_data.get("results", []):
        file_name = result.get("file", "")
        data = result.get("data", {})
        doc = create_sop_document(data, doc_id, file_name)
        documents.append(doc)
        doc_id += 1
    
    print(f"Processed {len(sop_data.get('results', []))} SOP documents")
    
    # Write to output file
    print(f"Writing {len(documents)} documents to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        for doc in documents:
            f.write(json.dumps(doc, ensure_ascii=False) + '\n')
    
    print(f"Successfully created Vespa feed file: {output_path}")
    print(f"Total documents: {len(documents)}")


def main():
    """Main entry point."""
    # Default file paths
    fda_json = "fda_510k_extracted_20251024_173142.json"
    sop_json = "lab_sop_extracted_20251024_173248.json"
    output_file = "rag-blueprint/dataset/medical_docs.jsonl"
    
    # Check if files exist
    if not Path(fda_json).exists():
        print(f"Error: FDA JSON file not found: {fda_json}")
        sys.exit(1)
    
    if not Path(sop_json).exists():
        print(f"Error: SOP JSON file not found: {sop_json}")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    output_dir = Path(output_file).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Convert files
    convert_json_to_vespa_feed(fda_json, sop_json, output_file)


if __name__ == "__main__":
    main()
