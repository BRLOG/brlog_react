import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Extension } from '@tiptap/core';
import { KeyboardEvent } from 'react';
import axios from 'axios';

// 아이콘 및 필요한 컴포넌트 import
import {
    RiBold, RiItalic, RiListOrdered, RiListUnordered, RiLinkM, RiCodeSSlashLine,
    RiHeading, RiQuoteText, RiImage2Line, RiNotionLine, RiSeparator, RiText,
    RiH1, RiH2, RiH3, RiTable2, RiCheckboxLine, RiCodeBoxLine
} from 'react-icons/ri';

// 슬래시 커맨드 메뉴 아이템 타입
interface CommandItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    action: (editor: Editor) => void;
}

const NotionEditor: React.FC<{
    content: string;
    setContent: (content: string) => void;
}> = ({ content, setContent }) => {
    // 슬래시 커맨드 메뉴 상태
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    // 사용 가능한 커맨드 목록
    const commands: CommandItem[] = [
        {
            title: '텍스트',
            description: '일반 텍스트 블록',
            icon: <RiText />,
            action: (editor) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange({
                        from: editor.state.selection.from - 1,
                        to: editor.state.selection.from
                    })
                    .setParagraph()
                    .run();
            }
        },
        {
            title: '제목 1',
            description: '대제목',
            icon: <RiH1 />,
            action: (editor) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange({
                        from: editor.state.selection.from - 1,
                        to: editor.state.selection.from
                    })
                    .setHeading({ level: 1 })
                    .run();
            }
        },
        // 다른 명령어들...
        {
            title: '제목 2',
            description: '중제목',
            icon: <RiH2 />,
            action: (editor) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange({
                        from: editor.state.selection.from - 1,
                        to: editor.state.selection.from
                    })
                    .setHeading({ level: 2 })
                    .run();
            }
        },
        {
            title: '제목 3',
            description: '소제목',
            icon: <RiH3 />,
            action: (editor) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange({
                        from: editor.state.selection.from - 1,
                        to: editor.state.selection.from
                    })
                    .setHeading({ level: 3 })
                    .run();
            }
        },
        {
            title: '글머리 기호 목록',
            description: '순서가 없는 목록',
            icon: <RiListUnordered />,
            action: (editor) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange({
                        from: editor.state.selection.from - 1,
                        to: editor.state.selection.from
                    })
                    .toggleBulletList()
                    .run();
            }
        },
        {
            title: '번호 매기기 목록',
            description: '순서가 있는 목록',
            icon: <RiListOrdered />,
            action: (editor) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange({
                        from: editor.state.selection.from - 1,
                        to: editor.state.selection.from
                    })
                    .toggleOrderedList()
                    .run();
            }
        },
        {
            title: '코드 블록',
            description: '코드 구문 강조',
            icon: <RiCodeBoxLine />,
            action: (editor) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange({
                        from: editor.state.selection.from - 1,
                        to: editor.state.selection.from
                    })
                    .toggleCodeBlock()
                    .run();
            }
        },
        {
            title: '인용구',
            description: '텍스트 인용',
            icon: <RiQuoteText />,
            action: (editor) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange({
                        from: editor.state.selection.from - 1,
                        to: editor.state.selection.from
                    })
                    .toggleBlockquote()
                    .run();
            }
        },
    ];

    // 검색어에 따른 필터링
    const filteredCommands = searchTerm
        ? commands.filter(cmd =>
            cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : commands;

    // 커맨드 실행 함수
    const executeCommand = (command: CommandItem) => {
        if (editor) {
            command.action(editor);
            setShowMenu(false);
        }
    };

    // 커스텀 키보드 이벤트 확장 생성
    const SlashCommands = Extension.create({
        name: 'slashCommands',

        // 에디터 문서 변경 시 호출되는 함수
        onUpdate() {
            if (editor && showMenu) {
                const text = editor.state.doc.textBetween(
                    Math.max(0, editor.state.selection.from - 10),
                    editor.state.selection.from,
                    "\n"
                );

                if (text.includes('/')) {
                    const lastSlashIndex = text.lastIndexOf('/');
                    setSearchTerm(text.substring(lastSlashIndex + 1));
                } else {
                    setShowMenu(false);
                }
            }
        },
    });

    // 에디터 초기화
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link,
            Placeholder.configure({
                placeholder: '여기에 입력하거나 "/"를 눌러 명령어를 확인하세요...',
            }),
            SlashCommands,
        ],
        content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());

            // 슬래시 명령어 메뉴가 열린 상태에서 입력된 텍스트로 필터링
            if (showMenu) {
                const text = editor.state.doc.textBetween(
                    Math.max(0, editor.state.selection.from - 10),
                    editor.state.selection.from,
                    "\n"
                );

                if (text.includes('/')) {
                    const lastSlashIndex = text.lastIndexOf('/');
                    setSearchTerm(text.substring(lastSlashIndex + 1));
                } else {
                    setShowMenu(false);
                }
            }
        },
    });

    // 키보드 이벤트 핸들러
    const handleKeyDown = (event: KeyboardEvent) => {
        if (!editor) return;

        // 슬래시 키 감지
        if (event.key === '/' && !showMenu) {
            const { view } = editor;
            const { state } = view;
            const { selection } = state;

            // 현재 커서 위치에 메뉴를 표시할 좌표 계산
            const node = view.domAtPos(selection.anchor).node as HTMLElement;
            const nodeRect = node.getBoundingClientRect();
            const editorRect = view.dom.getBoundingClientRect();

            // 메뉴 위치 설정
            setMenuPosition({
                x: nodeRect.left - editorRect.left,
                y: nodeRect.bottom - editorRect.top
            });

            setShowMenu(true);
            setSearchTerm('');
            setSelectedIndex(0);
        }

        // 슬래시 메뉴가 열린 상태에서의 키보드 네비게이션
        if (showMenu) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedIndex(prev =>
                    prev < filteredCommands.length - 1 ? prev + 1 : prev
                );
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
            } else if (event.key === 'Enter' && filteredCommands.length > 0) {
                event.preventDefault();
                executeCommand(filteredCommands[selectedIndex]);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                setShowMenu(false);
            } else if (event.key === 'Backspace') {
                // Backspace 키를 누르고 커서 바로 앞이 슬래시만 있는 경우
                const { state } = editor;
                const { selection } = state;
                const { from } = selection;

                // 현재 위치 앞의 문자가 슬래시인지 확인
                const textBefore = editor.state.doc.textBetween(from - 1, from);
                if (textBefore === '/') {
                    setShowMenu(false);
                }
            }
        }
    };

    // 문서 전체에 클릭 이벤트 리스너 추가 (메뉴 외부 클릭 감지)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 기본 서식 도구 모음
    const renderToolbar = () => {
        if (!editor) return null;

        return (
            <div className="flex items-center p-2 border-b border-gray-200 gap-1">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                >
                    <RiBold className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                >
                    <RiItalic className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
                >
                    <RiHeading className="w-4 h-4" />
                </button>
                <button
                    onClick={() => {
                        const url = prompt('URL 입력:');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
                >
                    <RiLinkM className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
                >
                    <RiCodeSSlashLine className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                >
                    <RiListUnordered className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                >
                    <RiListOrdered className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
                >
                    <RiQuoteText className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                <button
                    onClick={() => {
                        const url = prompt('이미지 URL:');
                        if (url) {
                            editor.chain().focus().setImage({ src: url }).run();
                        }
                    }}
                    className="p-2 rounded hover:bg-gray-100"
                >
                    <RiImage2Line className="w-4 h-4" />
                </button>
            </div>
        );
    };

    return (
        <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-white">
            {renderToolbar()}
            <div className="relative">
                {/* onKeyDown 이벤트를 컴포넌트 레벨에서 처리 */}
                <div onKeyDown={handleKeyDown}>
                    <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px]" />
                </div>

                {/* 슬래시 커맨드 메뉴 */}
                {showMenu && editor && (
                    <div
                        ref={menuRef}
                        className="absolute z-10 bg-white rounded-lg shadow-xl border border-gray-200 w-64"
                        style={{
                            top: menuPosition.y + 10,
                            left: menuPosition.x
                        }}
                    >
                        <div className="p-2 border-b border-gray-200">
                            <div className="text-sm text-gray-500">
                                /{searchTerm} 로 검색 중...
                            </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {filteredCommands.length > 0 ? (
                                filteredCommands.map((cmd, index) => (
                                    <div
                                        key={cmd.title}
                                        className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center ${selectedIndex === index ? 'bg-gray-100' : ''}`}
                                        onClick={() => executeCommand(cmd)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        <div className="w-6 h-6 mr-2 flex items-center justify-center text-gray-600">
                                            {cmd.icon}
                                        </div>
                                        <div>
                                            <div className="font-medium">{cmd.title}</div>
                                            <div className="text-xs text-gray-500">{cmd.description}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-center text-gray-500">
                                    일치하는 명령어가 없습니다
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center">
                <div className="flex items-center gap-1">
                    <span className="font-mono">/</span>
                    <span>을 입력하여 명령어 메뉴를 열 수 있습니다</span>
                </div>
            </div>
        </div>
    );
};

export default NotionEditor;