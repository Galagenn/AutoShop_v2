import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-page mt-4">
      <ol className="flex items-center gap-2 text-sm text-[#bcbcbc]">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-white">{item.label}</Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
            {idx < items.length - 1 && <span className="opacity-60">→</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}


