export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="sm:flex sm:items-center py-4">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 primary-text">{title}</h1>
        {subtitle && <p className="mt-2 text-sm secondary-text">{subtitle}</p>}
      </div>
    </div>
  );
}
