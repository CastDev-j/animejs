import React, { useState, useRef, useEffect } from "react";
import { MdMenu } from "react-icons/md";
import { animate, createScope } from "animejs";

const navLinks = [
  { href: "#start", label: "Start" },
  { href: "#timer", label: "Timer" },
  { href: "#animation", label: "Animation" },
  { href: "#timeline", label: "Timeline" },
  { href: "#animatable", label: "Animatable" },
  { href: "#draggable", label: "Draggable" },
  { href: "#scrollObserver", label: "ScrollObserver" },
  { href: "#scope", label: "Scope" },
  { href: "#stagger", label: "Stagger" },
  { href: "#svg", label: "SVG" },
  { href: "#utilities", label: "Utilities" },
  { href: "#waapi", label: "WAAPI" },
  { href: "#engine", label: "Engine" },
];

export const MenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null!);
  const scopeRef = useRef<any>(null);

  useEffect(() => {
    scopeRef.current = createScope({}).add((self) => {
      // Button animation - simple scale effect
      self.add("animateButton", (isOpen: boolean) => {
        animate(buttonRef.current, {
          scale: isOpen ? [1, 0.9, 1.1] : [1.1, 1],
          duration: 300,
          easing: "easeOutQuad",
          backgroundColor: isOpen ? "#525252" : "#262626",
        });
      });

      // Menu animation - fast and smooth
      self.add("animateMenu", (isOpen: boolean) => {
        if (!menuRef.current) return;

        if (isOpen) {
          menuRef.current.style.display = "block";
          animate(menuRef.current, {
            opacity: [0, 1],
            scale: [0.95, 1],
            translateY: [10, 0],
            duration: 200,
            easing: "easeOutQuad",
          });

          // Faster staggered animation for menu items
          const items = menuRef.current.querySelectorAll("li");
          animate(items, {
            opacity: [0, 1],
            translateY: [-5, 0],
            delay: (el, i) => i * 30, // Reduced delay
            duration: 150,
            easing: "easeOutQuad",
          });
        } else {
          // Faster close animation
          animate(menuRef.current, {
            opacity: [1, 0],
            scale: [1, 0.98],
            translateY: [0, 5],
            duration: 150,
            easing: "easeInQuad",
            complete: () => {
              if (menuRef.current) {
                menuRef.current.style.display = "none";
              }
            },
          });
        }
      });
    });

    return () => {
      scopeRef.current?.revert();
    };
  }, []);

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    scopeRef.current?.methods.animateButton(newState);
    scopeRef.current?.methods.animateMenu(newState);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    scopeRef.current?.methods.animateButton(false);
    scopeRef.current?.methods.animateMenu(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-3 bg-neutral-800 text-white rounded-full shadow-lg transition-all duration-300"
        aria-label="Toggle menu"
      >
        <MdMenu size={24} />
      </button>
      <div
        ref={menuRef}
        className="absolute bottom-16 right-0 bg-white border border-neutral-300 rounded-lg shadow-lg overflow-hidden hidden"
        style={{ opacity: 0, transform: "translateY(10px) scale(0.95)" }}
      >
        <ul className="list-none m-0 p-4 space-y-2">
          {navLinks.map((link) => (
            <li
              key={link.href}
              style={{ opacity: 0, transform: "translateY(-5px)" }}
            >
              <a
                href={link.href}
                onClick={handleLinkClick}
                className="block text-neutral-800 hover:text-neutral-600 hover:underline transition duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
