import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../services/api';

export default function RichEditor({ value, onChange }) {
  const quillRef = useRef(null);

  // Chèn ảnh: upload -> lấy url -> insert vào editor
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await api.post('/uploads', fd);     // /api/uploads
        const url = res.data.url;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', url, 'user');
        editor.setSelection(range.index + 1);
      } catch (e) {
        alert('Upload ảnh thất bại');
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    },
    clipboard: { matchVisual: false }
  }), []);

  const formats = [
    'header','bold','italic','underline','strike',
    'list','bullet','blockquote','code-block','link','image'
  ];

  return (
    <div className="rich-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
      <style>{`.rich-editor .ql-editor{min-height:220px}`}</style>
    </div>
  );
}
