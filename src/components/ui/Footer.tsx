import { navigation } from "@/models/navigation";

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.footer.map((item) => (
            <div key={item.name} className="pb-16 flex justify-center">
              <a href={item.href} className="text-sm leading-6 primary-link">
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-16">
          {navigation.social.map((item) => (
            <a key={item.name} href={item.href} className="secondary-link">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 secondary-text">
          &copy; 2023 Submap, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
