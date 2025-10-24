# convert the document to markdown
import os
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path

import pymupdf4llm

top_folder = Path("LabDocs/")
out_folder = Path("MarkdownOutput/")
out_folder.mkdir(exist_ok=True)


def convert_pdf_to_markdown(pdf_file):
    """Convert a single PDF file to markdown"""
    try:
        # Calculate the relative path from top_folder to preserve directory structure
        relative_path = pdf_file.relative_to(top_folder)

        # Create the output file path with the same folder structure
        output_file = out_folder / relative_path.parent / f"{pdf_file.stem}.md"

        # Skip if output file already exists
        if output_file.exists():
            return {"status": "skipped", "file": str(pdf_file.name)}

        # Create parent directories if they don't exist
        output_file.parent.mkdir(parents=True, exist_ok=True)

        # Convert PDF to markdown
        md_text = pymupdf4llm.to_markdown(str(pdf_file))
        output_file.write_bytes(md_text.encode())

        return {"status": "success", "file": str(pdf_file.name)}

    except Exception as e:
        return {"status": "error", "file": str(pdf_file.name), "error": str(e)}


if __name__ == "__main__":
    # Collect all PDF files
    pdf_files = list(top_folder.rglob("*.pdf"))
    total_files = len(pdf_files)
    print(f"Found {total_files} PDF files to convert")

    # Use num_cpu - 1 workers for parallel processing
    max_workers = max(1, os.cpu_count() - 1)
    print(f"Using {max_workers} parallel workers\n")

    # Process files in parallel with progress logging
    completed = 0
    skipped = 0
    errors = []

    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_pdf = {
            executor.submit(convert_pdf_to_markdown, pdf): pdf for pdf in pdf_files
        }

        # Process results as they complete
        for future in as_completed(future_to_pdf):
            completed += 1
            result = future.result()

            if result["status"] == "error":
                errors.append(result)
                print(
                    f"[{completed}/{total_files}] ✗ {result['file']} - Error: {result['error']}"
                )
            elif result["status"] == "skipped":
                skipped += 1
                print(
                    f"[{completed}/{total_files}] ⊘ {result['file']} (already exists)"
                )
            else:
                print(f"[{completed}/{total_files}] ✓ {result['file']}")

    # Summary
    successful = completed - len(errors) - skipped
    print(f"\n{'=' * 60}")
    print("✓ Conversion complete!")
    print(f"  Successfully converted: {successful}/{total_files}")
    print(f"  Skipped (already exist): {skipped}/{total_files}")
    if errors:
        print(f"  Failed: {len(errors)}")
        print("\nFailed files:")
        for error in errors:
            print(f"  - {error['file']}: {error['error']}")
