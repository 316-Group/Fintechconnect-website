"use client";
import { useState } from "react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const navItems: Record<string, { label: string; description: string; href: string }[]> = {
    Products: [
      { 
        label: "Features", 
        description: "Leverage the professional services provided by our team to build a bespoke solution",
        href: "#features" 
      },
      { 
        label: "Integrations", 
        description: "Leverage the professional services provided by our team to build a bespoke solution",
        href: "#integrations" 
      },
      { 
        label: "Front End", 
        description: "Leverage the professional services provided by our team to build a bespoke solution",
        href: "#reporting" 
      },
      { 
        label: "API Access", 
        description: "Powerful REST APIs for seamless integrations",
        href: "#api" 
      },
      { 
        label: "Webhooks", 
        description: "Real-time event notifications for your systems",
        href: "#webhooks" 
      },
      { 
        label: "Custom Extensions", 
        description: "Build custom functionality tailored to your needs",
        href: "#extensions" 
      },
    ],
    Solutions: [
      { 
        label: "Starter Templates", 
        description: "Pre-built solutions to get you up and running quickly",
        href: "#starter" 
      },
      { 
        label: "Industry Templates", 
        description: "Specialized templates tailored to your specific industry",
        href: "#industry" 
      },
      { 
        label: "Custom Builds", 
        description: "Bespoke solutions designed to your exact requirements",
        href: "#custom" 
      },
      { 
        label: "Mobile Apps", 
        description: "Native iOS and Android applications for your customers",
        href: "#mobile" 
      },
      { 
        label: "Web Portal", 
        description: "Complete web-based management dashboard",
        href: "#web" 
      },
      { 
        label: "White Label", 
        description: "Fully branded solutions under your own name",
        href: "#whitelabel" 
      },
    ],
    "Who We Serve": [
      { 
        label: "Data Encryption", 
        description: "Bank-grade security for all your sensitive data",
        href: "#encryption" 
      },
      { 
        label: "Compliance", 
        description: "Meet regulatory requirements across all jurisdictions",
        href: "#compliance" 
      },
      { 
        label: "Access Control", 
        description: "Granular permissions and role-based access management",
        href: "#access" 
      },
      { 
        label: "Audit Logs", 
        description: "Complete transaction history and compliance tracking",
        href: "#audit" 
      },
      { 
        label: "Data Privacy", 
        description: "GDPR and international privacy compliance",
        href: "#privacy" 
      },
      { 
        label: "Security Updates", 
        description: "Regular security patches and vulnerability management",
        href: "#updates" 
      },
    ],
    Contact: [
      { 
        label: "Request Demo",
        description: "Get in touch with our sales team for a personalized consultation",
        href: "#demo" 
      }
    ]
  };
  const getColumnLayout = (items: typeof navItems.Products) => {
    return {
      col1: items.slice(0, 3),
      col2: items.slice(3, 6),
    };
  };

  return (
    <header className="sticky top-0 z-50 bg-black shadow-md">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <img 
                  src="/Group 2085662741.png" 
                  alt="Logo"
                  className="w-20 h-12 object-contain shadow-2xl brightness-0 invert"
                />

        {/* Nav Items */}
        <div className="hidden md:flex space-x-8 text-sm font-medium text-white">
          {Object.keys(navItems).map((menu) => (
            <div key={menu} className="relative">
              <button
                onClick={() => toggleMenu(menu)}
                className="flex items-center gap-1 hover:text-blue-300 transition"
              >
                {menu}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    openMenu === menu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown - 2 Column Layout with Right Sidebar */}
              {openMenu === menu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[95vw] max-w-[750px] bg-white shadow-2xl overflow-hidden z-50">
                  {/* Header with light blue background */}
                  <div className="bg-blue-200 px-5 py-3 border-b border-blue-300">
                    <h2 className="text-2xl font-bold text-blue-900">{menu}</h2>
                  </div>
 
                  <div className="flex">
                    {/* Left Content - 2 Column Layout */}
                    <div className="flex-1 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {getColumnLayout(navItems[menu]).col1.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="p-3 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition cursor-pointer group"
                            onClick={() => setOpenMenu(null)}
                          >
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition mb-1">
                              {item.label}
                            </h3>
                            <p className="text-sm text-slate-600 group-hover:text-slate-700">
                              {item.description}
                            </p>
                          </a>
                        ))}
                        {getColumnLayout(navItems[menu]).col2.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="p-3 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition cursor-pointer group"
                            onClick={() => setOpenMenu(null)}
                          >
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition mb-1">
                              {item.label}
                            </h3>
                            <p className="text-sm text-slate-600 group-hover:text-slate-700">
                              {item.description}
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
 
                    {/* Right Sidebar - Blue section with screenshot area and CTA */}
                    <div className="w-72 bg-gradient-to-br from-blue-600 to-blue-700 p-6 flex flex-col justify-between">
                      {/* Screenshot Area */}
                      <img 
                        src="/menu screenshot.png" 
                        alt="menu screenshot"
                        className="object-contain shadow-2xl"
                      />
 
                      {/* Heading */}
                      <h3 className="text-xl font-bold text-white mb-4">
                        Ready to get started?
                      </h3>

        {/* CTA Button */}
        <button className="bg-white text-blue-900 px-5 py-2.5 rounded-full font-medium hover:bg-blue-100 transition">
          Book a Demo
        </button>

              </div>

            </div>

          </div>

        )}

      </div>

    ))}

  </div>

</nav>
    </header>
  );
}