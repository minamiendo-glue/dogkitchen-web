'use client';

import { useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ value, onChange, placeholder, rows = 20 }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // カーソル位置を調整
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'underline':
        insertText('<u>', '</u>');
        break;
      case 'heading1':
        insertText('# ');
        break;
      case 'heading2':
        insertText('## ');
        break;
      case 'heading3':
        insertText('### ');
        break;
      case 'list':
        insertText('- ');
        break;
      case 'quote':
        insertText('> ');
        break;
      case 'link':
        insertText('[リンクテキスト](', ')');
        break;
    }
  };


  return (
    <div className="w-full border-2 border-gray-300 rounded-xl overflow-hidden">
      {/* ツールバー */}
      <div className="w-full bg-gray-50 border-b border-gray-300 p-4">
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => formatText('bold')}
                className="p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 min-w-[50px] min-h-[50px] flex items-center justify-center border border-gray-300"
                title="太字"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a1 1 0 011-1h5.5a2.5 2.5 0 010 5H6a1 1 0 000 2h4.5a2.5 2.5 0 010 5H6a1 1 0 01-1-1V4z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => formatText('italic')}
                className="p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 min-w-[50px] min-h-[50px] flex items-center justify-center border border-gray-300"
                title="斜体"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 000 2h1.5l-2 8H6a1 1 0 100 2h4a1 1 0 100-2h-1.5l2-8H12a1 1 0 100-2H8z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => formatText('underline')}
                className="p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 min-w-[50px] min-h-[50px] flex items-center justify-center border border-gray-300"
                title="下線"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                </svg>
              </button>
            </div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => formatText('heading1')}
                className="px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-base font-bold min-w-[60px] min-h-[50px] flex items-center justify-center border border-gray-300"
                title="見出し1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => formatText('heading2')}
                className="px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-base font-bold min-w-[60px] min-h-[50px] flex items-center justify-center border border-gray-300"
                title="見出し2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => formatText('heading3')}
                className="px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-base font-bold min-w-[60px] min-h-[50px] flex items-center justify-center border border-gray-300"
                title="見出し3"
              >
                H3
              </button>
            </div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => formatText('list')}
                className="p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 min-w-[50px] min-h-[50px] flex items-center justify-center border border-gray-300"
                title="リスト"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => formatText('quote')}
                className="p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 min-w-[50px] min-h-[50px] flex items-center justify-center border border-gray-300"
                title="引用"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3z" clipRule="evenodd"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => formatText('link')}
                className="p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 min-w-[50px] min-h-[50px] flex items-center justify-center border border-gray-300"
                title="リンク"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* エディター */}
      <div className="w-full relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full text-lg border-0 focus:ring-0 focus:outline-none px-6 py-4 font-mono resize-none"
          style={{ minHeight: `${rows * 1.5}rem` }}
        />
      </div>
    </div>
  );
}
