// components/Navbar/Navbar.tsx

import React from 'react';
import { Disclosure } from '@headlessui/react';
import { FunnelIcon, EllipsisHorizontalCircleIcon, MoonIcon } from '@heroicons/react/24/outline';
import NavbarButton from './NavbarButton';
import { CircleStackIcon } from '@heroicons/react/24/solid';

interface NavbarProps {
  databaseName: string | null;
  onFetchRelationships: () => Promise<void>;
  onNewConnection: () => void;
  isFetchingRelationships: boolean;
  isRelationshipsDisabled: boolean;
}

export default function Navbar({
  databaseName,
  onFetchRelationships,
  isFetchingRelationships,
  isRelationshipsDisabled,
  onNewConnection,
}: NavbarProps): JSX.Element {
  const handleManualMode = () => {
    console.log("Manual mode selected");
  };

  const analyzeMenuItems = [
    {
      name: 'Manual Mode',
      onClick: handleManualMode
    },
    {
      name: 'AI Mode',
      onClick: onFetchRelationships
    },
  ];

  const settingsNavigation = [
    { name: 'Switch Mode', onClick: () => console.log('Switch Mode clicked') },
    { name: 'Settings', onClick: () => console.log('Settings clicked') },
  ];

  return (
    <Disclosure as="header" className="bg-white shadow">
      <div className="mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-4">
        <div className="relative flex h-16 justify-between">
          <div className="relative z-10 flex px-2 lg:px-0">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-2xl font-bold">
                <span className="text-green-600">Mongo</span>
                <span className="text-gray-600">Schema</span>
              </h1>
            </div>
          </div>
          <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
            {
              databaseName && <div className="text-center">
                <h2 className="text-2xl font-semibold">
                  Connected to: <span className="text-green-600">{databaseName}</span>
                </h2>
              </div>
            }
          </div>
          <div className="z-10 ml-4 flex items-center">
            <NavbarButton
              label="Fetch relationships"
              isLoading={isFetchingRelationships}
              isDisabled={isRelationshipsDisabled}
              menuItems={analyzeMenuItems}
              menuItemTitle='Fetch mode'
              showLabel
              primaryButton
            />
          </div>
          {
            !isRelationshipsDisabled && (
              <div className="z-10 flex flex-col items-center absolute right-0 top-64 space-y-4">
                <NavbarButton
                  icon={<FunnelIcon className="h-5 w-5" />}
                  label="Filter"
                />
                <NavbarButton
                  icon={<CircleStackIcon className="h-5 w-5" />}
                  label="New Connection"
                  onClick={onNewConnection}
                />
                <NavbarButton
                  icon={<EllipsisHorizontalCircleIcon className="h-5 w-5" />}
                  label="Settings"
                  menuItems={settingsNavigation}
                />
                <NavbarButton
                  icon={<MoonIcon className="h-5 w-5" />}
                  label="Switch Mode"
                  menuItems={settingsNavigation}
                />
              </div>
            )
          }

        </div>
      </div>
    </Disclosure>
  );
}