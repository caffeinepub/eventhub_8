import { CalendarDays, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-navy text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <CalendarDays className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">
                EventHub
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              Discover and attend world-class events. Connect with industry
              leaders, innovators, and creators.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white/90 mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Browse Events
                </a>
              </li>
              <li>
                <a
                  href="/admin/login"
                  className="hover:text-white transition-colors"
                >
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white/90 mb-3 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <p className="text-sm text-white/50">events@eventhub.app</p>
            <p className="text-sm text-white/50 mt-1">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            &copy; {year} EventHub. All rights reserved.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" />{" "}
            using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
