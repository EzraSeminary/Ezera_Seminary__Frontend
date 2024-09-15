import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  setRichTextData: (content: string) => void;
  initialValue?: string;
}

const modules = {
  toolbar: [
    [{ 'size': [] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    ['clean']  // Remove formatting button
  ],
};

const formats = [ 'size',
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'align',
  'link'
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ setRichTextData, initialValue = '' }) => {
  const [value, setValue] = useState<string>(initialValue);

  const handleEditorChange = (content: string) => {
    setValue(content); // Set the value in the editor
    setRichTextData(content); // Send the content to parent or Redux
  };

  return (
    <div>
      <ReactQuill 
        value={value} 
        onChange={handleEditorChange} 
        placeholder="እዚህ ጋር ይጻፉ ..." 
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;
