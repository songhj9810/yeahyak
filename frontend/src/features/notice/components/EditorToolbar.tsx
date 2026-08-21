import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons"
import { type Editor, useEditorState } from "@tiptap/react"
import { Button, Flex } from "antd"

type EditorToolbarProps = {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold"),
      isItalic: ctx.editor?.isActive("italic"),
      isUnderline: ctx.editor?.isActive("underline"),
      isStrike: ctx.editor?.isActive("strike"),
      isBulletList: ctx.editor?.isActive("bulletList"),
      isOrderedList: ctx.editor?.isActive("orderedList"),
    }),
  })

  if (!editor || !editorState) return null

  return (
    <Flex justify="center" align="center" gap="small">
      <Button
        type={editorState.isBold ? "primary" : "default"}
        icon={<BoldOutlined />}
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <Button
        type={editorState.isItalic ? "primary" : "default"}
        icon={<ItalicOutlined />}
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <Button
        type={editorState.isUnderline ? "primary" : "default"}
        icon={<UnderlineOutlined />}
        size="small"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <Button
        type={editorState.isStrike ? "primary" : "default"}
        icon={<StrikethroughOutlined />}
        size="small"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <Button
        type={editorState.isBulletList ? "primary" : "default"}
        icon={<UnorderedListOutlined />}
        size="small"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <Button
        type={editorState.isOrderedList ? "primary" : "default"}
        icon={<OrderedListOutlined />}
        size="small"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
    </Flex>
  )
}
