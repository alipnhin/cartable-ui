"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_USER } from "@/mocks/mockUsers";
import { User, Bell, Lock, Globe, Palette } from "lucide-react";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    fullName: CURRENT_USER.fullName,
    email: CURRENT_USER.email,
    phone: "09123456789",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderApproved: true,
    orderRejected: true,
    newOrderAssigned: true,
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = () => {
    toast({
      title: t("common.success"),
      description: t("settings.profileUpdated"),
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: t("common.success"),
      description: t("settings.notificationsUpdated"),
    });
  };

  const handleChangePassword = () => {
    if (password.new !== password.confirm) {
      toast({
        title: t("common.error"),
        description: t("settings.passwordMismatch"),
        variant: "destructive",
      });
      return;
    }
    toast({
      title: t("common.success"),
      description: t("settings.passwordChanged"),
    });
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("settings.description")}</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.profile")}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.security")}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.notifications")}</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.preferences")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.profileInformation")}</CardTitle>
              <CardDescription>{t("settings.profileDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">
                    {CURRENT_USER.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">{t("settings.changeAvatar")}</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">{t("settings.fullName")}</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t("settings.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t("settings.phone")}</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>{t("settings.role")}</Label>
                  <Input
                    value={CURRENT_USER.role}
                    disabled
                    className="mt-2 bg-muted"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">{t("common.buttons.cancel")}</Button>
                <Button onClick={handleSaveProfile}>
                  {t("common.buttons.save")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.changePassword")}</CardTitle>
              <CardDescription>{t("settings.passwordDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">{t("settings.currentPassword")}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">{t("settings.newPassword")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">{t("settings.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={password.confirm}
                  onChange={(e) =>
                    setPassword({ ...password, confirm: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">{t("common.buttons.cancel")}</Button>
                <Button onClick={handleChangePassword}>
                  {t("settings.updatePassword")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notificationSettings")}</CardTitle>
              <CardDescription>{t("settings.notificationsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t("settings.emailNotifications")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.emailNotificationsDesc")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t("settings.smsNotifications")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.smsNotificationsDesc")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, smsNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t("settings.pushNotifications")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.pushNotificationsDesc")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, pushNotifications: checked })
                    }
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-medium mb-4">{t("settings.notifyMeWhen")}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="orderApproved">{t("settings.orderApproved")}</Label>
                    <Switch
                      id="orderApproved"
                      checked={notifications.orderApproved}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, orderApproved: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="orderRejected">{t("settings.orderRejected")}</Label>
                    <Switch
                      id="orderRejected"
                      checked={notifications.orderRejected}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, orderRejected: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="newOrderAssigned">{t("settings.newOrderAssigned")}</Label>
                    <Switch
                      id="newOrderAssigned"
                      checked={notifications.newOrderAssigned}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newOrderAssigned: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">{t("common.buttons.cancel")}</Button>
                <Button onClick={handleSaveNotifications}>
                  {t("common.buttons.save")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.appearance")}</CardTitle>
              <CardDescription>{t("settings.appearanceDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.language")}</p>
                  <p className="text-sm text-muted-foreground">فارسی</p>
                </div>
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.theme")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.themeDescription")}
                  </p>
                </div>
                <Palette className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                {t("settings.moreSettingsComingSoon")}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
