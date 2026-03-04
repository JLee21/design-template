import React from 'react';
import readmeHtml from '../../docs/README.html?raw';

interface TocSection {
  id: string;
  text: string;
  children: { id: string; text: string }[];
}

function parseToc(html: string): TocSection[] {
  const sections: TocSection[] = [];
  const regex = /<h([23])\s+id="([^"]+)"[^>]*>([^<]+)/g;
  let match;
  let current: TocSection | null = null;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3].trim();

    if (level === 2) {
      current = { id, text, children: [] };
      sections.push(current);
    } else if (level === 3 && current) {
      current.children.push({ id, text });
    }
  }
  return sections;
}

const tocSections = parseToc(readmeHtml);

export default function Instructions() {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = React.useState('');
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const isScrollingRef = React.useRef(false);

  React.useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.querySelectorAll('pre').forEach(function (pre) {
      if (pre.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        const code = pre.querySelector('code');
        const text = (code || pre).textContent || '';
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });
      });
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }, []);

  React.useEffect(() => {
    const ids = tocSections.flatMap(s => [s.id, ...s.children.map(c => c.id)]);
    const headings = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActiveId(id);
          const parent = tocSections.find(
            s => s.id === id || s.children.some(c => c.id === id)
          );
          if (parent) {
            setExpanded(prev => ({ ...prev, [parent.id]: true }));
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      isScrollingRef.current = true;
      setActiveId(id);
      const parent = tocSections.find(
        s => s.id === id || s.children.some(c => c.id === id)
      );
      if (parent) {
        setExpanded(prev => ({ ...prev, [parent.id]: true }));
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { isScrollingRef.current = false; }, 800);
    }
  };

  const toggleSection = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const navWidth = 180;
  const gap = 80;
  const contentWidth = 640;
  const totalWidth = navWidth + gap + contentWidth;

  return (
    <div style={{ minHeight: '100vh', background: '#111318' }}>
      <div style={{
        maxWidth: totalWidth, margin: '0 auto',
        display: 'flex', alignItems: 'flex-start',
        padding: '48px 24px 80px',
      }}>
        <nav style={{
          position: 'sticky', top: '48px',
          width: navWidth, minWidth: navWidth,
          marginRight: gap, marginTop: '24px',
        }}>
          <div style={{
            fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '1.2px', color: '#52525b', marginBottom: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}>
            On this page
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {tocSections.map(section => {
              const isActive = activeId === section.id;
              const childActive = section.children.some(c => c.id === activeId);
              const isOpen = expanded[section.id] || isActive || childActive;

              return (
                <li key={section.id} style={{ marginBottom: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {section.children.length > 0 && (
                      <button
                        onClick={() => toggleSection(section.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: '0 4px 0 0', display: 'flex', alignItems: 'center',
                          color: '#52525b', fontSize: '10px', flexShrink: 0,
                        }}
                      >
                        <span style={{
                          display: 'inline-block',
                          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.15s ease',
                        }}>
                          ▸
                        </span>
                      </button>
                    )}
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => scrollTo(e, section.id)}
                      style={{
                        display: 'block', padding: '4px 0', fontSize: '13px',
                        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                        color: isActive ? '#ffffff' : childActive ? '#a1a1aa' : '#71717a',
                        fontWeight: isActive ? 500 : 400,
                        textDecoration: 'none', lineHeight: 1.4,
                        transition: 'color 0.15s ease',
                      }}
                    >
                      {section.text}
                    </a>
                  </div>
                  {isOpen && section.children.length > 0 && (
                    <ul style={{ listStyle: 'none', margin: '2px 0 4px 14px', padding: 0 }}>
                      {section.children.map(child => {
                        const isChildActive = activeId === child.id;
                        return (
                          <li key={child.id}>
                            <a
                              href={`#${child.id}`}
                              onClick={(e) => scrollTo(e, child.id)}
                              style={{
                                display: 'block', padding: '3px 0', fontSize: '12px',
                                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                                color: isChildActive ? '#ffffff' : '#52525b',
                                fontWeight: isChildActive ? 500 : 400,
                                textDecoration: 'none', lineHeight: 1.4,
                                transition: 'color 0.15s ease',
                              }}
                            >
                              {child.text}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <main style={{ flex: 1, minWidth: 0 }}>
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </main>
      </div>
    </div>
  );
}
