export default function MarkdownRenderer({ content }) {
  if (!content) return null

  function parseMarkdown(md) {
    const lines = md.split('\n')
    let html = ''
    let inUl = false, inOl = false, inPre = false, preContent = '', preLang = ''

    const closeList = () => {
      if (inUl) { html += '</ul>'; inUl = false }
      if (inOl) { html += '</ol>'; inOl = false }
    }
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    const inline = s => s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i]

      if (!inPre && raw.startsWith('```')) {
        closeList()
        inPre = true
        preLang = raw.slice(3).trim()
        preContent = ''
        continue
      }
      if (inPre) {
        if (raw === '```') {
          html += `<pre><code class="language-${esc(preLang)}">${esc(preContent)}</code></pre>`
          inPre = false
        } else {
          preContent += (preContent ? '\n' : '') + raw
        }
        continue
      }

      if (!raw.trim()) { closeList(); continue }

      if (/^#{1,6} /.test(raw)) {
        closeList()
        const lvl = raw.match(/^(#+)/)[1].length
        html += `<h${lvl}>${inline(raw.slice(lvl + 1))}</h${lvl}>`
      } else if (raw.startsWith('> ')) {
        closeList()
        html += `<blockquote>${inline(raw.slice(2))}</blockquote>`
      } else if (/^[-*] /.test(raw)) {
        if (!inUl) { closeList(); html += '<ul>'; inUl = true }
        html += `<li>${inline(raw.slice(2))}</li>`
      } else if (/^\d+\. /.test(raw)) {
        if (!inOl) { closeList(); html += '<ol>'; inOl = true }
        html += `<li>${inline(raw.replace(/^\d+\. /, ''))}</li>`
      } else if (raw.trim() === '---') {
        closeList(); html += '<hr />'
      } else if (raw.startsWith('| ')) {
        closeList()
        const cells = raw.split('|').filter((_,idx,arr) => idx !== 0 && idx !== arr.length-1).map(c => c.trim())
        const nextLine = lines[i + 1] || ''
        if (nextLine.startsWith('|') && nextLine.includes('---')) {
          html += `<table><thead><tr>${cells.map(c=>`<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>`
          i++ // skip separator row
        } else {
          html += `<tr>${cells.map(c=>`<td>${inline(c)}</td>`).join('')}</tr>`
          if (!(lines[i + 1] || '').startsWith('| ')) html += '</tbody></table>'
        }
      } else if (/^!\[.*\]\(.*\)/.test(raw)) {
        closeList()
        const m = raw.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
        if (m) html += `<img src="${m[2]}" alt="${esc(m[1])}" loading="lazy" />`
      } else {
        closeList()
        html += `<p>${inline(raw)}</p>`
      }
    }
    closeList()
    return html
  }

  return (
    <div
      className="md-body"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}
