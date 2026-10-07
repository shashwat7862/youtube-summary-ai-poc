import { useSidebar } from "@/context/SidebarContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  CheckCircleIcon,
  CallIcon,
  FilesIcon,
  TaskIcon,

  CheckLineIcon,
} from "../icons";
import { cn } from "../utils";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  key?: string;
  icon: React.ReactNode;
  path?: string;
  new?: boolean;
  target?: string;
  subItems?: {
    name: string;
    key?: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    target?: string;
  }[];
};

const navItems: NavItem[] = [
  // {
  //   icon: <GridIcon fontSize={24} />,
  //   name: "Dashboard",
  //   key: "dashboard",
  //   subItems: [{ name: "Ecommerce", key: "ecommerceHome", path: "/" }],
  // },
  // {
  //   icon: <CalenderIcon fontSize={24} />,
  //   name: "Calendar",
  //   key: "calendar",
  //   path: "/calendar",
  // },
  // {
  //   icon: <UserCircleIcon fontSize={24} />,
  //   name: "User Profile",
  //   key: "userProfile",
  //   path: "/profile",
  // },
  // {
  //   name: "Forms",
  //   key: "forms",
  //   icon: <ListIcon fontSize={24} />,
  //   subItems: [
  //     {
  //       name: "Form Elements",
  //       key: "formElements",
  //       path: "/form-elements",
  //       pro: false,
  //     },
  //   ],
  // },
  {
    name: "Work List",
    key: "workList",
    icon: <TaskIcon fontSize={24} />,
    path: "/work-list",
  },
  {
    name: "Validation",
    key: "validation",
    icon:  <CheckLineIcon  fontSize={24} />,
    path: "/validation",
  },
  {
    name: "Calls",
    key: "calls", 
    icon: <CallIcon fontSize={24} />,
    path: "/calls",
  },
  {
    name: "Post-Call & Exports",
    key: "exports",
    icon: <GridIcon fontSize={24} />,
    path: "/exports",
  },
  // {
  //   name: "Pages",
  //   key: "pages",
  //   icon: <PageIcon fontSize={24} />,
  //   subItems: [{ name: "Blank Page", key: "blankPage", path: "/blank" }],
  // },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon fontSize={24} />,
    name: "Charts",
    key: "charts",
    subItems: [
      { name: "Line Chart", key: "lineChart", path: "/line-chart" },
      { name: "Bar Chart", key: "barChart", path: "/bar-chart" },
    ],
  },
  {
    icon: <BoxCubeIcon fontSize={24} />,
    name: "UI Elements",
    key: "uiElements",
    subItems: [
      { name: "Alerts", key: "alerts", path: "/alerts", pro: false },
      { name: "Avatar", key: "avatar", path: "/avatars", pro: false },
      { name: "Badge", key: "badge", path: "/badge", pro: false },
      { name: "Buttons", key: "buttons", path: "/buttons", pro: false },
      { name: "Images", key: "images", path: "/images", pro: false },
      { name: "Videos", key: "videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon fontSize={24} />,
    name: "Authentication",
    key: "authentication",
    subItems: [
      { name: "Sign In", key: "signIn", path: "/signin", pro: false },
      { name: "Sign Up", key: "signUp", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, setIsMobileOpen } = useSidebar();
  // Hover-to-expand is disabled; sidebar only responds to the explicit toggle.
  const isHovered = false;
  const { t } = useTranslation();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-close sidebar on mobile after route change
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  useEffect(() => {
    let submenuMatched = false;

    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;

      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`group menu-item ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "xl:justify-center xl:px-2"
                  : "xl:justify-start xl:px-3"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                } ${!isExpanded && !isHovered ? "xl:flex xl:justify-center xl:w-full" : ""}`}
              >
                {nav.icon}
              </span>

              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">
                  {nav.key ? t(`sidebar.items.${nav.key}`) : nav.name}
                </span>
              )}
              {nav.new && (isExpanded || isHovered || isMobileOpen) && (
                <span
                  className={`absolute inset-e-10 ms-auto ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-dropdown-badge-active"
                      : "menu-dropdown-badge-inactive"
                  } menu-dropdown-badge`}
                >
                  {t("sidebar.badges.new")}
                </span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ms-auto h-5 w-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                target={nav.target}
                className={`group menu-item ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center xl:px-2"
                    : "xl:justify-start xl:px-3"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  } ${!isExpanded && !isHovered ? "xl:flex xl:justify-center xl:w-full" : ""}`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text flex items-center justify-between w-full">
                    <span>
                      {nav.key ? t(`sidebar.items.${nav.key}`) : nav.name}
                    </span>
                    {isActive(nav.path) && (
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0 ml-2 dark:bg-brand-500"></span>
                    )}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="ms-9 mt-2 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      target={subItem.target}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.key
                        ? t(`sidebar.items.${subItem.key}`)
                        : subItem.name}
                      <span className="ms-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ms-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            {t("sidebar.badges.new")}
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ms-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-pro-active"
                                : "menu-dropdown-badge-pro-inactive"
                            } menu-dropdown-badge-pro`}
                          >
                            {t("sidebar.badges.pro")}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={cn(
        "fixed inset-s-0 top-0 z-50 flex h-screen flex-col border-e border-purple-700 bg-purple-900 text-white transition-all duration-300 ease-in-out xl:translate-x-0 xl:rtl:translate-x-0 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100",
        isExpanded || isMobileOpen ? "w-[260px] px-5" : "w-16 px-1",
        isMobileOpen
          ? "translate-x-0"
          : "-translate-x-full rtl:translate-x-full",
      )}
    >
      <div
        className={cn(
          "flex py-8",
          !isExpanded && !isHovered ? "xl:justify-center" : "justify-start",
        )}
      >
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-bold text-amber-100 shadow-md shadow-slate-500/30">
            CC
          </span>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="flex flex-col leading-tight mr-4">
              <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-base font-bold tracking-normal text-transparent leading-tight whitespace-nowrap dark:from-brand-600 dark:to-brand-400">
                Cash Collection Bridge
              </span>
              <span className="text-[9px] font-medium tracking-wide text-purple-200 uppercase leading-tight whitespace-nowrap dark:text-gray-400">
                GE HealthCare · Collections Ops
              </span>
            </span>
          )}
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-5 text-purple-300 uppercase dark:text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t("sidebar.groups.menu")
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-4 flex text-xs leading-5 text-purple-300 uppercase dark:text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "justify-start"
                }`}
              >
                {/* {isExpanded || isHovered || isMobileOpen ? (
                  t("sidebar.groups.others")
                ) : (
                  <HorizontaLDots className="size-6" />
                )} */}
              </h2>
              {/* {renderMenuItems(othersItems, "others")} */}
            </div>
          </div>
        </nav>

        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
