import re


def create_chunks(pages, chunk_size=1000, overlap=200):
    chunks = []

    current_section = ""
    current_page = None

    for page in pages:
        text = page["text"].strip()

        # Detect section headings such as 1.1, 1.2, 1.3, etc.
        parts = re.split(r"(?=\d+\.\d+\s)", text)

        for part in parts:
            part = part.strip()

            if not part:
                continue

            # If this is a section heading, start a new section
            if re.match(r"^\d+\.\d+\s", part):
                if current_section:
                    chunks.append({
                        "text": current_section.strip(),
                        "page": current_page
                    })

                current_section = part
                current_page = page["page"]

            else:
                # Continue the previous section across pages
                current_section += "\n" + part

    # Add final section
    if current_section:
        chunks.append({
            "text": current_section.strip(),
            "page": current_page
        })

    # Split sections that are too large
    final_chunks = []

    for chunk in chunks:
        text = chunk["text"]

        if len(text) <= chunk_size:
            final_chunks.append(chunk)

        else:
            start = 0

            while start < len(text):
                end = start + chunk_size

                final_chunks.append({
                    "text": text[start:end],
                    "page": chunk["page"]
                })

                start += chunk_size - overlap

    return final_chunks