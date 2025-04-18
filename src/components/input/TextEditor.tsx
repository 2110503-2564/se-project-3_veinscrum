"use client";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { EditorProps } from "./BaseTextEditor";

const Editor = dynamic(() => import("./BaseTextEditor"), {
  ssr: false,
});

export const TextEditor = forwardRef<MDXEditorMethods, EditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />,
);

TextEditor.displayName = "TextEditor";
