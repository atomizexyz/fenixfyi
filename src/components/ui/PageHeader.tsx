export default function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="sm:flex sm:items-center pb-4">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 primary-text">{title}</h1>
        <p className="mt-2 text-sm secondary-text">{subtitle}</p>
      </div>
    </div>
  );
}
