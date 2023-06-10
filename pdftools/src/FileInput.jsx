import {  useMemo, useState } from "react"
import "./FileInput.css"
import { PDFDocument } from "pdf-lib";
function FileInput() {
    const [files, setFiles] = useState();
    const handleFileChange = (e) => {
        if(e.target.files && e.target.files.length > 0) {
            const filesArr = Array.from(e.target.files)
            setFiles(filesArr)
        }
    }

    const handleMerge = () => {
         PDFDocument.create().then((newDoc) => {
            Promise.allSettled(files.map((inputFile) => {
                return  new Response(inputFile).arrayBuffer().then((res) => {
                    return PDFDocument.load(res).then((doc) => {
                        return newDoc.copyPages(doc, doc.getPageIndices()).then((pagearr) => {
                            pagearr.forEach((page) => newDoc.addPage(page));
                        })
                    })
                    
                })
            })).then(() => {
                return newDoc.save().then((res) => {
                    var blob=new Blob([res], {type: "application/pdf"});
                    var link=document.createElement('a');
                    link.href=window.URL.createObjectURL(blob);
                    link.download="mergedPdf.pdf";
                    link.click();
                })
            })
            })
    }


    const pdfList = useMemo(() => {
        const pdfFiles = []
        if(files && files.length > 0) {
            for (const inputfile of files) {
                pdfFiles.push(inputfile)
            }
            return (
                <ol>
                    {pdfFiles.map((pdfFile, idx) => <li key={`${pdfFile.name}-${idx}`}>{pdfFile.name}</li>)}
                </ol>
            )
        }
        return <></>
    }, [files])

    return (
        <div className="container">
        <form>
            <label htmlFor="pdf_uploads">Choose pdf files to upload</label>
            <input
                type="file"
                id="pdf_uploads"
                name="pdf_uploads"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                style={{display: "none"}}
            />
        </form>
            {pdfList}
            <button onClick={handleMerge}>Merge</button>
        </div>
    )
}

export default FileInput