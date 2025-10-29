
/* eslint-disable*/
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
interface TinyMCEProps {
  initialValue: string;
  onChange: (content: string) => void;
}

const TinyMCE: React.FC<TinyMCEProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      tinymceScriptSrc="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js"
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      init={{
        height: 400,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family: Poppins, sans-serif; font-size: 14px }",
        images_upload_handler: (blobInfo) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject("Could not read file");
            reader.readAsDataURL(blobInfo.blob());
          });
        },
      }}
      onEditorChange={(content) => onChange(content)}
    />
  );
};

export default TinyMCE;
