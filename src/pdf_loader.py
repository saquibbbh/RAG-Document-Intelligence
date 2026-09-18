import pymupdf


def load_pdf(file_path):
    doc = pymupdf.open(file_path)

    pages = []

    for page_number, page in enumerate(doc):
        pages.append({
            "page": page_number + 1,
            "text": page.get_text()
        })

    doc.close()

    return pages