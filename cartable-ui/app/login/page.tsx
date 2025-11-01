"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !password) {
      toast({
        title: t("common.error"),
        description: t("auth.fillAllFields"),
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push(`/auth/otp?phone=${encodeURIComponent(phone)}`);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("auth.loginError"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handleLogin} className="p-6 md:p-8">
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="mb-2 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <div className="text-2xl font-bold text-primary">کـ</div>
                    </div>
                    <h1 className="text-2xl font-bold">
                      {t("auth.welcomeBack")}
                    </h1>
                    <p className="text-muted-foreground text-balance">
                      {t("auth.loginToYourAccount")}
                    </p>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="phone">
                      {t("auth.phoneNumber")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="09123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pe-10"
                        disabled={isLoading}
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </Field>

                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">
                        {t("auth.password")}
                      </FieldLabel>
                      <Button
                        variant="ghost"
                        type="button"
                        className="mr-auto text-sm p-0 h-auto"
                        disabled={isLoading}
                      >
                        {t("auth.forgotPassword")}
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? t("common.loading") : t("auth.login")}
                    </Button>
                  </Field>

                  <FieldDescription className="text-center">
                    {t("app.version")} 1.0.0
                  </FieldDescription>
                </FieldGroup>
              </form>

              <div className="bg-muted relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">
                      {t("app.title")}
                    </div>
                    <p className="text-lg text-muted-foreground">
                      {t("app.description")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <FieldDescription className="px-6 text-center">
            {t("auth.termsAgreement")}{" "}
            <a href="#" className="underline-offset-2 hover:underline">
              {t("auth.terms")}
            </a>{" "}
            {t("common.and")}{" "}
            <a href="#" className="underline-offset-2 hover:underline">
              {t("auth.privacy")}
            </a>{" "}
            {t("auth.agree")}
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
