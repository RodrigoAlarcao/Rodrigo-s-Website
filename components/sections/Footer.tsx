const links = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/rodrigoalarcao",
  },
  {
    label: "Twitter / X",
    href: "https://x.com/rodrigoalarcao",
  },
  {
    label: "alarcao.rodrigo@gmail.com",
    href: "mailto:alarcao.rodrigo@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container-site py-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <p className="font-mono text-label text-dim">
          © 2026 Rodrigo Alarcão
        </p>

        <div className="flex flex-wrap gap-6 md:gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="font-mono text-label text-dim hover:text-accent transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}
