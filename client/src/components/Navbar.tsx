import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger,} from './ui/navigation-menu';

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Wishlist App
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {token ? (
              <>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>My Wishlists</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <Link
                          to="/wishlists"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            View All Wishlists
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Manage and view all your wishlists in one place.
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/wishlists/new"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Create New</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Create a new wishlist to start adding items.
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/wishlists/shared"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Shared With Me</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View wishlists that others have shared with you.
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}; 