import { NavLink, Outlet } from "react-router-dom"

import {
  BarChart3,
  Boxes,
  CirclePlus,
  Search,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const links = [
  {
    to: "/",
    label: "داشبورد",
    icon: BarChart3,
  },
  {
    to: "/products",
    label: "محصولات Infinite",
    icon: Boxes,
  },
  {
    to: "/products/paginated",
    label: "محصولات Pagination",
    icon: Search,
  },
  {
    to: "/products/new",
    label: "افزودن محصول",
    icon: CirclePlus,
  },
  {
    to: "/profile",
    label: "پروفایل",
    icon: User,
  },
]

export default function AppLayout() {
  return (
    <SidebarProvider>
      <Sidebar >
        <SidebarHeader>
          <div className="p-3">
            <h2 className="font-bold">
              React Shop Lab
            </h2>

            <p className="text-sm text-muted-foreground">
              فروشگاه آموزشی
            </p>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {links.map((item) => {
              const Icon = item.icon

              return (
                <SidebarMenuItem key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                  >
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                      >
                        <Icon />

                        <span>
                          {item.label}
                        </span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center border-b p">
          <SidebarTrigger />

          <span className="ms-3 font-bold">
            فروشگاه آموزشی
          </span>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}