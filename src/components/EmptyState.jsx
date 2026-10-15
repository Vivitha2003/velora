export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="empty-state">
      {Icon && (
        <span className="empty-state__icon" aria-hidden="true">
          <Icon size={28} />
        </span>
      )}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  );
}
