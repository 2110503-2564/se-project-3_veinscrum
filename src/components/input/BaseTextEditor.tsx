"use client";

import { figTree } from "@/fonts";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  InsertTable,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  Separator,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const plugins = (readOnly?: boolean) => [
  !readOnly ? toolbarPlugin({ toolbarContents: Toolbar }) : {},
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  tablePlugin(),
];

const Toolbar = () => (
  <>
    <UndoRedo />
    <Separator />
    <BlockTypeSelect />
    <BoldItalicUnderlineToggles />
    <Separator />
    <ListsToggle options={["bullet", "number"]} />
    <Separator />
    <InsertTable />
  </>
);

export interface EditorProps {
  markdown?: string;
  onChange?: (markdown: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

const BaseTextEditor = ({
  editorRef,
  markdown = "",
  onChange,
  readOnly,
  placeholder,
}: {
  editorRef: React.ForwardedRef<MDXEditorMethods> | null;
} & EditorProps) => (
  <MDXEditor
    className={
      "prose prose-headings:m-0 prose-p:m-0 prose-ol:m-0 prose-ul:m-0 prose-li:m-0 relative my-0 flex w-full max-w-full min-w-full flex-1 flex-col"
    }
    contentEditableClassName={`${figTree.className} text-sm leading-6`}
    onChange={onChange}
    ref={editorRef}
    markdown={markdown}
    plugins={plugins(readOnly)}
    readOnly={readOnly}
    placeholder={placeholder}
  />
);

BaseTextEditor.displayName = "BaseTextEditor";

export default BaseTextEditor;
