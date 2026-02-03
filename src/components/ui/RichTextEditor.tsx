"use client";

import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link',
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white rounded-md"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 200px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-family: inherit;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
          font-size: 0.875rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
