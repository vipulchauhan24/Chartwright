import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { CircleUser, LogIn, LogOut } from 'lucide-react';
import { Fragment } from 'react';
import { useAuth } from 'react-oidc-context';
import { removeFromLocalStorage } from '../../charteditor/utils/lib';
import { LOCAL_STORAGE_KEYS } from '../../charteditor/utils/constants';
import CWButton from '../button';

const { VITE_CLIENT_ID } = import.meta.env;

export default function ProfileDropdown() {
  const auth = useAuth();

  const redirectToLoginPage = () => {
    auth.signinRedirect();
  };

  const logout = async () => {
    removeFromLocalStorage(LOCAL_STORAGE_KEYS.USER_ID);
    await auth.signoutRedirect({
      extraQueryParams: {
        client_id: VITE_CLIENT_ID,
        logout_uri: window.location.origin,
      },
    });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex items-center justify-center space-x-2 rounded-full size-10 text-primary">
          <CircleUser className="size-8" aria-hidden={true} />
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg z-50 px-3 pt-3">
          <p className="text-sm font-medium text-gray-900 text-center">
            {auth?.user?.profile?.email}
          </p>
          <div className="py-2 flex flex-col items-center">
            <MenuItem>
              {auth.isAuthenticated ? (
                <CWButton
                  tertiary
                  label={
                    <>
                      <LogOut className="size-4" aria-hidden={true} /> Sign out
                    </>
                  }
                  onClick={logout}
                />
              ) : (
                <CWButton
                  tertiary
                  label={
                    <>
                      <LogIn className="size-4" aria-hidden={true} /> Sign in
                    </>
                  }
                  onClick={redirectToLoginPage}
                />
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
