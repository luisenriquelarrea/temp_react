import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { SeccionMenuInput } from '@/app/entities';

interface InputFileProps {
  inputData: SeccionMenuInput,
  stateFormData: React.Dispatch<React.SetStateAction<any>>;
}

const InputFileMultiple: React.FC<InputFileProps> = (props) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validImages = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (validImages.length === 0) {
      alert('Please select only image files.');
      return;
    }
    if (validImages.length > 4) {
      alert('Solo tienes permitido hasta 4 imágenes.');
      return;
    }
    setLoading(true);

    try {
      // Compress and convert each image to base64
      const base64Images: any[] = await Promise.all(
        validImages.map(async (file) => {
          // Compression options - adjust as needed
          const options = {
            maxSizeMB: 1,          // max size in MB
            maxWidthOrHeight: 800, // max width or height
            useWebWorker: true,
          };

          const compressedFile = await imageCompression(file, options);

          // Convert compressed file to base64
          return await fileToBase64(compressedFile);
        })
      );

      setFileNames(validImages.map(f => f.name));

      // Save base64 array as JSON string or array depending on your backend
      props.stateFormData((values: any) => ({
        ...values,
        [event.target.name]: base64Images,
      }));

    } catch (error) {
      console.error('Error compressing images:', error);
      alert('Error processing images.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject('Failed to convert file to base64.');
      };
      reader.onerror = error => reject(error);
    });
  };

  return (
    <>
      {props.inputData.newLine === 1 && <div style={{ marginBottom: '-25px' }} className="column is-12"></div>}
      <div className={`column is-${props.inputData.inputCols}`}>
        <div className="field">
          <div className="control">
            <div className="file has-name is-fullwidth">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  multiple
                  onChange={handleChange}
                  id={props.inputData.inputId}
                  name={props.inputData.inputName}
                  required={Boolean(props.inputData.inputRequired)}
                  accept={props.inputData.inputAccepts || 'image/*'}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fa fa-upload fa-fw"></i>
                  </span>
                  <span className="file-label">{ props.inputData.inputLabel }</span>
                </span>
                <span className="file-name">
                  {loading ? 'Processing images...' : fileNames.join(', ')}
                </span>
              </label>
            </div>
            <p style={{ marginTop: '8px', fontStyle: 'italic', color: '#555' }}>
              {fileNames.length > 0 ? `${fileNames.length} imagen(es) seleccionada(s)` : 'No hay imágenes seleccionadas'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InputFileMultiple;