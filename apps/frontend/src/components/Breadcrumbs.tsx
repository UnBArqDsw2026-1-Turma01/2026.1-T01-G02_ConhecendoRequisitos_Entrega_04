/**
 * Breadcrumbs — navegação de migalhas reutilizável.
 *
 * Aceita uma lista de itens. O último item é tratado como a página atual
 * (aria-current="page") e não recebe o separador.
 */

export interface BreadcrumbItem {
  label: string;
  /** Se fornecido, o item se torna clicável */
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="breadcrumbs__item">
            {item.onClick && !isLast ? (
              <button
                type="button"
                className="breadcrumbs__link"
                onClick={item.onClick}
              >
                {item.label}
              </button>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <span aria-hidden="true">›</span>}
          </span>
        );
      })}
    </nav>
  );
}
