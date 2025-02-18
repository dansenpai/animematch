interface StreamingLink {
  name: string;
  icon: string;
  url: string;
}

interface StreamingLinksProps {
  links: StreamingLink[];
}

export function StreamingLinks({ links }: StreamingLinksProps) {
  if (!links.length) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full 
                   bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
        >
          <span>{link.icon}</span>
          <span>{link.name}</span>
        </a>
      ))}
    </div>
  );
}
