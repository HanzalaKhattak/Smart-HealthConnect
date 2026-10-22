import React from 'react';

// Minimal, dependency-free renderer for the assistant's markdown-ish replies.
// Supports: **bold**, bullet lists ("- " / "* "), and line breaks.
// Single-asterisk *italics* are converted to bold so no stray asterisks ever show.
// Renders plain React nodes only — no dangerouslySetInnerHTML, so it's XSS-safe.

function renderInline(text, keyPrefix) {
  const nodes = [];
  // Split on **bold** first, then treat leftover *single* emphasis as bold too.
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const inner = match[1] ?? match[2] ?? '';
    nodes.push(<strong key={`${keyPrefix}-b${i++}`}>{inner}</strong>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

const FormattedMessage = ({ content }) => {
  const lines = (content || '').split('\n');
  const blocks = [];
  let listItems = null;

  const flushList = () => {
    if (listItems) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="list-disc pl-5 my-1 space-y-0.5">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item, `li-${blocks.length}-${idx}`)}</li>
          ))}
        </ul>
      );
      listItems = null;
    }
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      if (!listItems) listItems = [];
      listItems.push(bullet[1]);
      return;
    }
    flushList();
    if (line.trim() === '') {
      blocks.push(<div key={`sp-${idx}`} className="h-2" />);
    } else {
      blocks.push(
        <p key={`p-${idx}`} className="my-0.5">
          {renderInline(line, `p-${idx}`)}
        </p>
      );
    }
  });
  flushList();

  return <div>{blocks}</div>;
};

export default FormattedMessage;
