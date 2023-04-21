export default function DashboardRowHeaderFooter() {
  return (
    <tr>
      <th scope="col" className="py-3.5 pl-4 pr-3 text-left align-text-top text-sm font-semibold primary-text sm:pl-6">
        Chain
      </th>
      <th scope="col" className="px-3 py-3.5 text-left align-text-top text-sm font-semibold primary-text">
        Status
      </th>
      <th scope="col" className="px-3 py-3.5 text-right align-text-top text-sm font-semibold primary-text">
        Equity Supply
        <div className="text-xs tertiary-text"> FENIX </div>
      </th>
      <th scope="col" className="px-3 py-3.5 text-right align-text-top text-sm font-semibold primary-text">
        Reward Supply
        <div className="text-xs tertiary-text"> FENIX </div>
      </th>
      <th scope="col" className="px-3 py-3.5 text-right align-text-top text-sm font-semibold primary-text">
        Share Rate
      </th>
      <th scope="col" className="px-3 py-3.5 text-left align-text-top text-sm font-semibold primary-text">
        Address
      </th>
      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
        <span className="sr-only">Edit</span>
      </th>
    </tr>
  );
}
