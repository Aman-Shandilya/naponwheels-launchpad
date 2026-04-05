import { Bus, LayoutDashboard, Calendar, IndianRupee, Clock, PlusCircle, LogOut, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Overview', url: '/owner', icon: LayoutDashboard },
  { title: 'My Buses', url: '/owner/buses', icon: Bus },
  { title: 'Register Bus', url: '/owner/register', icon: PlusCircle },
  { title: 'Bookings', url: '/owner/bookings', icon: Calendar },
  { title: 'Earnings', url: '/owner/earnings', icon: IndianRupee },
  { title: 'Availability', url: '/owner/availability', icon: Clock },
];

export function OwnerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && (
              <Link to="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-3 h-3" /> Home
              </Link>
            )}
          </SidebarGroupLabel>
          <div className="px-3 py-4">
            {!collapsed && (
              <h2 className="text-lg font-heading font-bold text-foreground">
                Nap<span className="text-accent">On</span>Wheels
              </h2>
            )}
            {collapsed && (
              <span className="text-lg font-heading font-bold text-accent">N</span>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item.url)
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="text-sm">Sign Out</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
