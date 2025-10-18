#!/usr/bin/env python3
"""
Laboratory Document Data Extraction Script

Extracts structured data from FDA 510(k) and Lab SOP (Standard Operating Procedure) markdown files
using Google's Gemini 2.5 Flash Lite API. Processes files in batches to handle arbitrarily large datasets efficiently.

FDA 510(k) Extracted Fields:
- Device Trade Name: Commercial/proprietary name of the device
- Product Code: 3-letter FDA product classification code
- Intended Use: Official FDA-approved statement of device purpose
- Analyte/Biomarker: Molecule or substance being measured
- Medical Specialty: FDA review panel/medical domain (e.g., Hematology, Immunology)
- Manufacturer Name: Company submitting 510(k)
- FDA Decision Date: Date FDA granted substantial equivalence (ddmmyyyy format)

Lab SOP Extracted Fields:
- Procedure Name: Official name of the laboratory procedure
- Specimen Type: Type of biological sample (e.g., Serum, Plasma, Urine)
- Analyte/Biomarker: Molecule or substance being measured
- Medical Specialty: Clinical domain (e.g., Hematology, Clinical Chemistry)
- Purpose: Clinical purpose and indications for the test
- Equipment: List of instruments and devices used
- Reagents: List of reagents, kits, and consumables
- Quality Control: QC requirements and acceptance criteria
- Interpretation Guidelines: How to interpret test results
"""

import argparse
import asyncio
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from tqdm.auto import tqdm


# Define the structured data model for FDA 510(k) documents
class FDA510k(BaseModel):
    """Structured Tier 1 data extracted from FDA 510(k) markdown documents"""

    device_trade_name: str = Field(
        description="Commercial/proprietary name of the device"
    )
    product_code: Optional[str] = Field(
        None, description="3-letter FDA product classification code (e.g., DAP, NTV)"
    )
    intended_use: str = Field(
        description="Official FDA-approved statement of device purpose and clinical application"
    )
    analyte_biomarker: Optional[str] = Field(
        None,
        description="Molecule or substance being measured (e.g., D-Dimer, Myeloperoxidase, Hemoglobin)",
    )
    medical_specialty: Optional[str] = Field(
        None,
        description="FDA review panel/medical domain (e.g., Hematology, Immunology, Clinical Chemistry)",
    )
    manufacturer_name: str = Field(description="Company name submitting the 510(k)")
    fda_decision_date: Optional[str] = Field(
        None,
        description="Date FDA granted substantial equivalence in mm-dd-yyyy format (e.g., 03-10-2005, 12-23-2005)",
    )


# Define the structured data model for Lab SOP documents
class LabSOP(BaseModel):
    """Structured data extracted from Laboratory Standard Operating Procedure documents"""

    procedure_name: str = Field(
        description="Official name of the laboratory procedure/test"
    )
    specimen_type: str = Field(
        description="Type of biological sample required (e.g., Serum, Plasma, Whole Blood, Urine, CSF)"
    )
    analyte_biomarker: Optional[str] = Field(
        None,
        description="Molecule or substance being measured (e.g., D-Dimer, Glucose, Hemoglobin)",
    )
    medical_specialty: Optional[str] = Field(
        None,
        description="Clinical domain or specialty (e.g., Hematology, Clinical Chemistry, Immunology)",
    )
    purpose: str = Field(
        description="Clinical purpose, indications, and diagnostic applications of the test"
    )
    equipment: list[str] = Field(
        default_factory=list,
        description="List of instruments, analyzers, and devices used in the procedure",
    )
    reagents: list[str] = Field(
        default_factory=list,
        description="List of reagents, kits, consumables, and materials required",
    )
    quality_control: Optional[str] = Field(
        None,
        description="Quality control requirements, acceptance criteria, and QC protocols",
    )
    interpretation_guidelines: Optional[str] = Field(
        None,
        description="Guidelines for interpreting test results, reference ranges, and clinical significance",
    )


def detect_document_type(file_path: Path) -> str:
    """Detect whether a markdown file is an FDA 510(k) or Lab SOP document"""
    # Check based on directory structure
    if "Synthetic_Procedures" in str(file_path):
        return "sop"
    elif "FDA" in str(file_path):
        return "fda"
    else:
        # Fallback: check file content for keywords
        try:
            content = file_path.read_text(encoding="utf-8")[:500].lower()
            if "510(k)" in content or "substantial equivalence" in content:
                return "fda"
            elif "procedure" in content or "specimen" in content:
                return "sop"
        except Exception:
            pass
    return "unknown"


async def extract_fda_data(md_file: Path, client: genai.Client) -> dict:
    """Extract FDA 510(k) data from a single markdown file"""
    try:
        # Read the markdown content
        content = md_file.read_text(encoding="utf-8")

        # Extract structured data using Google GenAI (async)
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=f"Extract the structured information from this FDA 510(k) document. Focus on: device trade name, product code, intended use, analyte/biomarker, medical specialty, manufacturer name, and FDA decision date (convert to mm-dd-yyyy format, e.g., 03-10-2005 for March 10, 2005):\n\n{content}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=FDA510k,
            ),
        )

        # Parse the response into our Pydantic model
        fda_data = response.parsed

        return {
            "status": "success",
            "file": str(md_file),
            "data": fda_data,
            "type": "fda",
        }

    except Exception as e:
        return {"status": "error", "file": str(md_file), "error": str(e), "type": "fda"}


async def extract_sop_data(md_file: Path, client: genai.Client) -> dict:
    """Extract Lab SOP data from a single markdown file"""
    try:
        # Read the markdown content
        content = md_file.read_text(encoding="utf-8")

        # Extract structured data using Google GenAI (async)
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=f"Extract the structured information from this Laboratory Standard Operating Procedure (SOP) document. Focus on: procedure name, specimen type, analyte/biomarker being measured, medical specialty, clinical purpose, equipment/instruments used, reagents/kits required, quality control requirements, and interpretation guidelines:\n\n{content}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=LabSOP,
            ),
        )

        # Parse the response into our Pydantic model
        sop_data = response.parsed

        return {
            "status": "success",
            "file": str(md_file),
            "data": sop_data,
            "type": "sop",
        }

    except Exception as e:
        return {"status": "error", "file": str(md_file), "error": str(e), "type": "sop"}


async def process_batch(
    files_batch: list[Path],
    batch_num: int,
    total_batches: int,
    client: genai.Client,
    doc_type: str = "fda",
) -> list[dict]:
    """Process a batch of files concurrently"""
    print(
        f"\n[Batch {batch_num}/{total_batches}] Processing {len(files_batch)} files..."
    )

    # Choose extraction function based on document type
    if doc_type == "sop":
        tasks = [extract_sop_data(file, client) for file in files_batch]
    else:
        tasks = [extract_fda_data(file, client) for file in files_batch]

    # Process with progress bar
    results = []
    for coro in tqdm(
        asyncio.as_completed(tasks),
        total=len(tasks),
        desc=f"Batch {batch_num}",
        unit="file",
    ):
        result = await coro
        results.append(result)

    # Count successes and errors
    successes = sum(1 for r in results if r["status"] == "success")
    errors = sum(1 for r in results if r["status"] == "error")

    print(
        f"[Batch {batch_num}/{total_batches}] Complete: {successes} succeeded, {errors} failed"
    )

    return results


async def process_all_files(
    files: list[Path],
    batch_size: int,
    client: genai.Client,
    output_file: Path,
    doc_type: str = "fda",
) -> tuple[list[dict], list[dict]]:
    """Process all files in batches with streaming output"""
    all_results = []
    all_errors = []

    # Split files into batches
    batches = [files[i : i + batch_size] for i in range(0, len(files), batch_size)]
    total_batches = len(batches)

    print(f"\n{'=' * 60}")
    print("Starting async processing:")
    print(f"  - Document type: {doc_type.upper()}")
    print(f"  - Total files: {len(files)}")
    print(f"  - Batch size: {batch_size}")
    print(f"  - Total batches: {total_batches}")
    print(f"{'=' * 60}")

    start_time = datetime.now()

    # Initialize output file with metadata
    output_data = {
        "metadata": {
            "document_type": doc_type,
            "total_files": len(files),
            "extraction_date": datetime.now().isoformat(),
            "batch_size": batch_size,
        },
        "results": [],
        "errors": [],
    }

    # Process each batch
    for batch_num, batch in enumerate(batches, 1):
        batch_results = await process_batch(
            batch, batch_num, total_batches, client, doc_type
        )

        # Separate successes and errors
        batch_successes = [r for r in batch_results if r["status"] == "success"]
        batch_errors = [r for r in batch_results if r["status"] == "error"]

        all_results.extend(batch_successes)
        all_errors.extend(batch_errors)

        # Stream results to file after each batch to avoid memory buildup
        # Convert Pydantic models to dicts for JSON serialization
        json_batch_results = [
            {"file": Path(r["file"]).name, "data": r["data"].model_dump()}
            for r in batch_successes
        ]
        json_batch_errors = [
            {"file": Path(e["file"]).name, "error": e["error"]} for e in batch_errors
        ]

        output_data["results"].extend(json_batch_results)
        output_data["errors"].extend(json_batch_errors)

        # Update metadata with current stats
        output_data["metadata"]["successful"] = len(all_results)
        output_data["metadata"]["errors"] = len(all_errors)
        output_data["metadata"]["last_updated"] = datetime.now().isoformat()

        # Write updated data to file
        with open(output_file, "w") as f:
            json.dump(output_data, f, indent=2)

    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    print(f"\n{'=' * 60}")
    print("Processing complete!")
    print(f"  - Total time: {duration:.2f} seconds")
    print(f"  - Files/second: {len(files) / duration:.2f}")
    print(f"  - Successfully processed: {len(all_results)}/{len(files)}")
    print(f"  - Errors: {len(all_errors)}")
    print(f"{'=' * 60}")

    return all_results, all_errors


def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description="Extract structured data from FDA 510(k) or Lab SOP markdown files using Google GenAI",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )

    parser.add_argument(
        "--input-dir",
        type=Path,
        default=Path("MarkdownOutput/FDA/"),
        help="Input directory containing markdown files (e.g., MarkdownOutput/FDA/ or MarkdownOutput/Synthetic_Procedures/)",
    )

    parser.add_argument(
        "--output-file",
        type=Path,
        default=None,
        help="Output JSON file path (default: fda_510k_extracted_<timestamp>.json or lab_sop_extracted_<timestamp>.json)",
    )

    parser.add_argument(
        "--n-docs",
        type=int,
        default=None,
        help="Maximum number of documents to process (default: all)",
    )

    parser.add_argument(
        "--batch-size",
        type=int,
        default=100,
        help="Number of files to process concurrently per batch",
    )

    parser.add_argument(
        "--api-key",
        type=str,
        default=None,
        help="Google API key (default: use GOOGLE_API_KEY environment variable)",
    )

    parser.add_argument(
        "--exclude-reviews",
        action="store_true",
        default=True,
        help="Exclude files ending with _REVIEW.md",
    )

    return parser.parse_args()


async def main():
    """Main entry point for the script"""
    args = parse_args()

    # Get API key
    api_key = args.api_key or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print(
            "Error: GOOGLE_API_KEY environment variable not set or --api-key not provided"
        )
        print("Please set GOOGLE_API_KEY or use --api-key argument")
        sys.exit(1)

    # Initialize the Google GenAI client
    client = genai.Client(api_key=api_key)

    # Get all FDA markdown files
    if not args.input_dir.exists():
        print(f"Error: Input directory does not exist: {args.input_dir}")
        sys.exit(1)

    print(f"Scanning for markdown files in: {args.input_dir}")

    # Detect document type from input directory
    doc_type = detect_document_type(args.input_dir)
    print(f"Detected document type: {doc_type.upper()}")

    if args.exclude_reviews:
        all_markdown_files = sorted(
            [
                f
                for f in args.input_dir.rglob("*.md")
                if not f.name.endswith("_REVIEW.md")
            ]
        )
    else:
        all_markdown_files = sorted(list(args.input_dir.rglob("*.md")))

    doc_type_label = (
        "FDA 510(k)"
        if doc_type == "fda"
        else "Lab SOP"
        if doc_type == "sop"
        else "Unknown"
    )
    print(f"Total {doc_type_label} files found: {len(all_markdown_files)}")

    # Limit the number of files if n_docs is set
    if args.n_docs is not None:
        markdown_files = all_markdown_files[: args.n_docs]
        print(f"Processing first {args.n_docs} files (as specified by --n-docs)")
    else:
        markdown_files = all_markdown_files
        print("Processing all files")

    if not markdown_files:
        print("Error: No markdown files found to process")
        sys.exit(1)

    print(f"Files to process: {len(markdown_files)}")

    # Set output file path
    if args.output_file is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        if doc_type == "sop":
            output_file = Path(f"lab_sop_extracted_{timestamp}.json")
        else:
            output_file = Path(f"fda_510k_extracted_{timestamp}.json")
    else:
        output_file = args.output_file

    # Process all files
    results, errors = await process_all_files(
        markdown_files, args.batch_size, client, output_file, doc_type
    )

    print(f"\n✓ Results saved to: {output_file}")

    # Save list of failed files for retry
    if errors:
        failed_files_output = output_file.with_suffix(".failed.txt")
        with open(failed_files_output, "w") as f:
            for error in errors:
                f.write(f"{error['file']}\n")
        print(f"✓ Failed files list saved to: {failed_files_output}")
        print(f"  → You can retry these {len(errors)} files later")

    # Print summary statistics
    print("\n" + "=" * 60)
    print("Summary Statistics:")
    print(f"  - Document type: {doc_type_label}")
    print(f"  - Total files available: {len(all_markdown_files)}")
    print(f"  - Files processed: {len(markdown_files)}")
    print(f"  - Successfully extracted: {len(results)}")
    print(f"  - Errors encountered: {len(errors)}")
    if markdown_files:
        print(f"  - Success rate: {len(results) / len(markdown_files) * 100:.1f}%")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
