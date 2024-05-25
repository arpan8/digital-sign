import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { saveAs } from 'file-saver';
import './SignaturePad.css';

const SignaturePad = () => {
  const sigCanvas = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [penColor, setPenColor] = useState('#000000');
  const [penBoldness, setPenBoldness] = useState(3); // Default pen size
  const [signatureData, setSignatureData] = useState(null);
  const [trimmedSignature, setTrimmedSignature] = useState(null);

  const handleSave = () => {
    if (trimmedSignature) {
      saveAs(trimmedSignature, 'signature.png');
    }
  };

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setSignatureData(null);
      setTrimmedSignature(null);
    }
  };

  const handleTrim = () => {
    if (sigCanvas.current) {
      setTrimmedSignature(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  useEffect(() => {
    if (signatureData) {
      const canvas = sigCanvas.current.getCanvas();
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = signatureData;
      img.onload = () => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    } else {
      const canvas = sigCanvas.current.getCanvas();
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [backgroundColor, signatureData]);

  const handleEnd = () => {
    if (sigCanvas.current) {
      setSignatureData(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Digital Signature Platform</h1>
      <div>
        <label>Background Color: </label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>
      <div>
        <label>Pen Color: </label>
        <input
          type="color"
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
        />
      </div>
      <div>
        <label>Pen Boldness: </label>
        <input
          type="range"
          min="1"
          max="50"
          value={penBoldness}
          onChange={(e) => setPenBoldness(Number(e.target.value))}
        />
      </div>
      <div style={{ position: 'relative', border: '1px solid #000', marginTop: '10px' }}>
        <SignatureCanvas
          ref={sigCanvas}
          penColor={penColor}
          canvasProps={{
            width: 600,
            height: 400,
            className: 'sigCanvas',
          }}
          onEnd={handleEnd}
          brushRadius={penBoldness}
        />
      </div>
      <button onClick={handleTrim}>Trim Signature</button>
      <button onClick={handleSave}>Download Signature</button>
      <button onClick={handleClear}>Clear</button>
      {trimmedSignature && (
        <div>
          <h2>Trimmed Signature:</h2>
          <img src={trimmedSignature} alt="Trimmed Signature" />
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
