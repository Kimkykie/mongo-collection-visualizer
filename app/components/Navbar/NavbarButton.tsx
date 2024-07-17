// components/Navbar/NavbarButton.tsx

import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

interface MenuItem {
  name: string;
  onClick?: () => void;
  href?: string;
}

interface NavbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  menuItems?: MenuItem[];
  menuItemTitle?: string;
  showLabel?: boolean;
  primaryButton?: boolean;
}

export default function NavbarButton({
  icon,
  label,
  onClick,
  isLoading,
  isDisabled,
  menuItems,
  menuItemTitle,
  showLabel,
  primaryButton,
}: NavbarButtonProps): JSX.Element {
  const buttonClasses = `
    relative inline-flex items-center justify-center w-full
    gap-x-4 px-3 py-2 rounded-md
    text-sm
    ${primaryButton
      ? 'bg-green-600 text-white hover:bg-green-700'
      : 'bg-green-50 text-green-800 hover:bg-green-100 border-green-800 border'}
    shadow-sm
    transition-all duration-200 ease-in-out
    hover:ring-2 hover:ring-green-400
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  const ButtonContent = (
    <>
      {icon}
      {showLabel && <span>{label}</span>}
      {isLoading && (
        <svg className="animate-spin h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
    </>
  );

  if (menuItems) {
    return (
      <Menu as="div" className="relative w-full">
        <MenuButton className={buttonClasses} disabled={isDisabled}>
          <span className="sr-only">{label}</span>
          {ButtonContent}
        </MenuButton>
        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {menuItemTitle && (
            <p className="text-sm text-green-600 px-4 py-2 font-bold">{menuItemTitle}</p>
          )}
          {menuItems.map((item) => (
            <MenuItem key={item.name}>
              {({ active }) => (
                item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    {item.name}
                  </a>
                )
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    );
  }

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={isDisabled}
    >
      <span className="sr-only">{label}</span>
      {ButtonContent}
    </button>
  );
}