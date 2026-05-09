"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Underline as UnderlineIcon
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("underline") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="H1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="H2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="H3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Align Left"
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Align Center"
      >
        <AlignCenter size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Align Right"
      >
        <AlignRight size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Blockquote"
      >
        <Quote size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200 text-purple-600" : "text-gray-600"}`}
        title="Link"
      >
        <LinkIcon size={18} />
      </button>
      
      <div className="flex-1" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200 text-gray-600"
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200 text-gray-600"
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start typing...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 min-h-[150px] focus:outline-none",
      },
    },
  });

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
