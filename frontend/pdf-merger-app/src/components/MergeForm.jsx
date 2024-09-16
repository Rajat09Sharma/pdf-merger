
import { createRef, useState } from 'react';

export default function MergeForm() {


  const [selectedFiles, setSelectedFiles] = useState([]);
 
  const files= createRef();

  const handleFileChange = (e) => {  
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    console.log(files.current.value);
    
    e.preventDefault();
    
    const formData = new FormData();

    
    selectedFiles.forEach((file) => formData.append('pdfs', file));
    console.log(formData);
    

    fetch("http://localhost:3000/mergeing", {
      method: 'POST',
      body: formData,
      headers: {
        "Contetnt-Type":"multipart/form-data" 
    }
    })
      .then((response) => response.blob())
      .then((blob) => {
        console.log('Success:', blob);
        const url = window.URL.createObjectURL(blob);
        window.open(url,"_blank")
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'merged-file.pdf'); 
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="pdf-merger-container">
      <h1 className="pdf-merger-title">PDFX Merger App</h1>
      <form className="pdf-merger-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="file-input-section">
          <label htmlFor="file-upload" className="file-upload-label">
            Choose PDF files to merge
          </label>
          <input
            type="file"
            ref={files}
            id="file-upload"
            name="pdfs"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
        <button type="submit" className="submit-button">Merge PDFs</button>
      </form>
      <div className="preview-section">
        {selectedFiles.length > 0 && (
          <div>
            <h2>Selected Files:</h2>
            <ul className="file-list">
              {selectedFiles.map((file, index) => (
                <li key={index} className="file-item">{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
