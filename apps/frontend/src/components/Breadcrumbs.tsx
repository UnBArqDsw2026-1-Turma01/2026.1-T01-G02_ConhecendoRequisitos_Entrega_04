const breadcrumbItems = ["Trilhas", "Módulos", "Introdução e elicitação"];

export function Breadcrumbs() {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <span key={item} className="breadcrumbs__item">
          {item}
          {index < breadcrumbItems.length - 1 ? (
            <span aria-hidden="true">›</span>
          ) : null}
        </span>
      ))}
    </nav>
  );
}
