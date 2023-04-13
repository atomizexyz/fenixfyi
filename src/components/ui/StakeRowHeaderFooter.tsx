export default function StakeRowHeaderFooter() {
  return (
    <tr>
      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold primary-text sm:pl-6">
        Start
      </th>
      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold primary-text sm:pl-6">
        End
      </th>
      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold primary-text">
        Principal
      </th>
      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold primary-text">
        Shares
      </th>
      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold primary-text">
        Payout
      </th>
      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold primary-text">
        Penalty
      </th>
      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold primary-text">
        Progress
      </th>
      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
        <span className="sr-only">Actions</span>
      </th>
    </tr>
  );
}
