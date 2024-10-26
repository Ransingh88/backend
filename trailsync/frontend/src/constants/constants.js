export const constant = {
  sidebarMenu: [
    {
      menuTitle: "basic",
      menus: [
        {
          title: "overview",
          path: "/overview",
          role: ["all"],
        },
        {
          title: "booking",
          path: "/booking",
          role: ["admin", "rider"],
        },
        {
          title: "payment",
          path: "/payment",
          role: ["admin", "rider"],
        },
        {
          title: "fevorite",
          path: "/fevorite",
          role: ["admin", "rider"],
        },
      ],
    },
    {
      menuTitle: "support",
      menus: [
        {
          title: "help",
          path: "/help",
          role: ["all"],
        },
        {
          title: "report",
          path: "/report",
          role: ["all"],
        },
        {
          title: "setting",
          path: "/setting",
          role: ["admin", "rider"],
        },
      ],
    },
    {
      menuTitle: "engagement",
      menus: [
        {
          title: "statistics",
          path: "/statistics",
          role: ["admin"],
        },
        {
          title: "reward",
          path: "/reward",
          role: ["all"],
        },
      ],
    },
  ],
};
