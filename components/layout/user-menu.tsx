"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LogOut, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getCookie, getRoleName } from "@/lib/utils";

export function LayoutUserMenu() {
  const router = useRouter();
  const handleLogout = () => {
    // Implement logout logic here
    // delete tp.access-token cookie
    Cookies.remove("tp.access-token");

    router.replace("/auth/login");
  };

  const queryClient = useQueryClient();

  const user = queryClient.getQueryData(["me"]) as any;

  const locale = getCookie("tp.locale");
  const t = useTranslations("General");

  const switchLang = () => {
    if (locale == "ar") {
      Cookies.set("tp.locale", "en");
    } else {
      Cookies.set("tp.locale", "ar");
    }
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full hover:bg-accent"
          >
            <Avatar className="h-9 w-9 ring-2 ring-primary/10 hover:ring-primary/20 transition-all">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {"TQ"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-84 p-3 shadow-none"
          align="end"
          forceMount
        >
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                TQ
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground truncate">
                  {`${user?.firstName} ${user?.lastName}` || "Unknown"}
                </p>
                <Badge variant="blue" className="absolute top-4 right-4">
                  {getRoleName(user?.role?.name)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "Unknown"}
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <DropdownMenuItem className="cursor-pointer" onClick={switchLang}>
            <Globe className="mr-3 h-4 w-4" />
            <span>{locale == "ar" ? "English" : "Arabic"}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
