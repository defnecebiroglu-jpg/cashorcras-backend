import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Users, Shield, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { type Team } from "@shared/schema";
import { z } from "zod";

const teamPasswordFormSchema = z.object({
  teamId: z.number().min(1, "Lütfen bir takım seçin"),
  newAccessCode: z.string().min(4, "Erişim kodu en az 4 karakter olmalıdır"),
});

const adminPasswordFormSchema = z.object({
  newPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export function PasswordManagement() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { toast } = useToast();

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const teamPasswordForm = useForm({
    resolver: zodResolver(teamPasswordFormSchema),
    defaultValues: {
      teamId: 0,
      newAccessCode: "",
    },
  });

  const adminPasswordForm = useForm({
    resolver: zodResolver(adminPasswordFormSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const updateTeamPasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof teamPasswordFormSchema>) => {
      const response = await fetch("/api/admin/update-team-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update team password");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ 
        title: "Başarılı", 
        description: "Takım erişim kodu güncellendi" 
      });
      teamPasswordForm.reset();
      setSelectedTeam(null);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Hata", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateAdminPasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof adminPasswordFormSchema>) => {
      const response = await fetch("/api/admin/update-admin-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update admin password");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "Başarılı", 
        description: "Admin şifresi güncellendi" 
      });
      adminPasswordForm.reset();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Hata", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleTeamPasswordSubmit = (data: z.infer<typeof teamPasswordFormSchema>) => {
    updateTeamPasswordMutation.mutate(data);
  };

  const handleAdminPasswordSubmit = (data: z.infer<typeof adminPasswordFormSchema>) => {
    updateAdminPasswordMutation.mutate(data);
  };

  const handleTeamSelection = (teamId: string) => {
    const team = teams?.find(t => t.id === parseInt(teamId));
    setSelectedTeam(team || null);
    teamPasswordForm.setValue("teamId", parseInt(teamId));
  };

  if (teamsLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Key className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Şifre Yönetimi</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Team Password Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Takım Erişim Kodları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...teamPasswordForm}>
              <form onSubmit={teamPasswordForm.handleSubmit(handleTeamPasswordSubmit)} className="space-y-4">
                <FormField
                  control={teamPasswordForm.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Takım Seçin</FormLabel>
                      <Select onValueChange={handleTeamSelection}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Bir takım seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams?.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedTeam && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium">Mevcut Erişim Kodu:</div>
                    <div className="text-lg font-mono">{selectedTeam.accessCode}</div>
                  </div>
                )}

                <FormField
                  control={teamPasswordForm.control}
                  name="newAccessCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yeni Erişim Kodu</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Yeni erişim kodunu girin" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={updateTeamPasswordMutation.isPending || !selectedTeam}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {updateTeamPasswordMutation.isPending ? "Güncelleniyor..." : "Erişim Kodunu Güncelle"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Admin Password Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Şifresi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...adminPasswordForm}>
              <form onSubmit={adminPasswordForm.handleSubmit(handleAdminPasswordSubmit)} className="space-y-4">
                <FormField
                  control={adminPasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yeni Admin Şifresi</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="Yeni admin şifresini girin" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-sm text-muted-foreground">
                  <p>• Şifre en az 6 karakter olmalıdır</p>
                  <p>• Güvenli bir şifre kullanın</p>
                  <p>• Bu şifreyi güvenli bir yerde saklayın</p>
                </div>

                <Button 
                  type="submit" 
                  disabled={updateAdminPasswordMutation.isPending}
                  className="w-full"
                  variant="destructive"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {updateAdminPasswordMutation.isPending ? "Güncelleniyor..." : "Admin Şifresini Güncelle"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Teams List with Current Access Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Tüm Takım Erişim Kodları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams?.map((team) => (
              <div key={team.id} className="p-4 border rounded-lg">
                <div className="font-medium">{team.name}</div>
                <div className="text-sm text-muted-foreground">
                  Erişim Kodu: <span className="font-mono font-bold">{team.accessCode}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Bakiye: ₺{parseFloat(team.cashBalance).toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}