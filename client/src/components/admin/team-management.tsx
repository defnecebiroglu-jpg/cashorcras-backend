import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Settings, DollarSign, TrendingUp, Briefcase, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertTeamStockSchema, insertTeamCurrencySchema, insertTeamStartupSchema, type Team, type Company, type Currency } from "@shared/schema";
import { z } from "zod";

const teamStockFormSchema = insertTeamStockSchema;
const teamCurrencyFormSchema = insertTeamCurrencySchema;
const teamStartupFormSchema = insertTeamStartupSchema;

export function TeamManagement() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [managementType, setManagementType] = useState<"stocks" | "currencies" | "startup">("stocks");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: companies } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const { data: currencies } = useQuery<Currency[]>({
    queryKey: ["/api/currencies"],
  });

  const stockForm = useForm({
    resolver: zodResolver(teamStockFormSchema),
    defaultValues: {
      teamId: 0,
      companyId: 0,
      shares: 0,
    },
  });

  const currencyForm = useForm({
    resolver: zodResolver(teamCurrencyFormSchema),
    defaultValues: {
      teamId: 0,
      currencyId: 0,
      amount: "",
    },
  });

  const startupForm = useForm({
    resolver: zodResolver(teamStartupFormSchema),
    defaultValues: {
      teamId: 0,
      name: "",
      description: "",
      value: "",
      industry: "",
      riskLevel: "",
    },
  });

  const createStockMutation = useMutation({
    mutationFn: async (data: z.infer<typeof teamStockFormSchema>) => {
      const response = await fetch("/api/team-stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to assign stock");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Hisse başarıyla atandı" });
      setIsDialogOpen(false);
      stockForm.reset();
    },
    onError: () => {
      toast({ title: "Hisse atanamadı", variant: "destructive" });
    },
  });

  const createCurrencyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof teamCurrencyFormSchema>) => {
      const response = await fetch("/api/team-currencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to assign currency");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Döviz başarıyla atandı" });
      setIsDialogOpen(false);
      currencyForm.reset();
    },
    onError: () => {
      toast({ title: "Döviz atanamadı", variant: "destructive" });
    },
  });

  const createStartupMutation = useMutation({
    mutationFn: async (data: z.infer<typeof teamStartupFormSchema>) => {
      const response = await fetch("/api/team-startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to assign startup");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Girişim başarıyla atandı" });
      setIsDialogOpen(false);
      startupForm.reset();
    },
    onError: () => {
      toast({ title: "Girişim atanamadı", variant: "destructive" });
    },
  });

  const handleManageTeam = (team: Team, type: "stocks" | "currencies" | "startup") => {
    setSelectedTeam(team);
    setManagementType(type);
    
    if (type === "stocks") {
      stockForm.reset({ teamId: team.id, companyId: 0, shares: 0 });
    } else if (type === "currencies") {
      currencyForm.reset({ teamId: team.id, currencyId: 0, amount: "" });
    } else if (type === "startup") {
      startupForm.reset({ 
        teamId: team.id, 
        name: "", 
        description: "", 
        value: "", 
        industry: "", 
        riskLevel: "" 
      });
    }
    
    setIsDialogOpen(true);
  };

  const onSubmitStock = (data: z.infer<typeof teamStockFormSchema>) => {
    createStockMutation.mutate(data);
  };

  const onSubmitCurrency = (data: z.infer<typeof teamCurrencyFormSchema>) => {
    createCurrencyMutation.mutate(data);
  };

  const onSubmitStartup = (data: z.infer<typeof teamStartupFormSchema>) => {
    createStartupMutation.mutate(data);
  };

  if (teamsLoading) {
    return <div>Takımlar yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Takım Yönetimi</h3>
      </div>

      <div className="grid gap-4">
        {teams?.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {team.name}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManageTeam(team, "stocks")}
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Hisseler
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManageTeam(team, "currencies")}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Dövizler
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManageTeam(team, "startup")}
                  >
                    <Briefcase className="h-4 w-4 mr-1" />
                    Girişim
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">
                Nakit Bakiye: ₺{parseFloat(team.cashBalance).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </CardContent>

          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTeam?.name} Yönetimi - {managementType === "stocks" ? "Hisseler" : managementType === "currencies" ? "Dövizler" : "Girişim"}
            </DialogTitle>
          </DialogHeader>
          
          {managementType === "stocks" && (
            <Form {...stockForm}>
              <form onSubmit={stockForm.handleSubmit(onSubmitStock)} className="space-y-4">
                <FormField
                  control={stockForm.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şirket</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Şirket seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies?.map((company) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={stockForm.control}
                  name="shares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hisse Sayısı</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createStockMutation.isPending}>
                  Hisse Ata
                </Button>
              </form>
            </Form>
          )}

          {managementType === "currencies" && (
            <Form {...currencyForm}>
              <form onSubmit={currencyForm.handleSubmit(onSubmitCurrency)} className="space-y-4">
                <FormField
                  control={currencyForm.control}
                  name="currencyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Döviz</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Döviz seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies?.map((currency) => (
                            <SelectItem key={currency.id} value={currency.id.toString()}>
                              {currency.name} ({currency.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={currencyForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Miktar</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createCurrencyMutation.isPending}>
                  Döviz Ata
                </Button>
              </form>
            </Form>
          )}

          {managementType === "startup" && (
            <Form {...startupForm}>
              <form onSubmit={startupForm.handleSubmit(onSubmitStartup)} className="space-y-4">
                <FormField
                  control={startupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Girişim Adı</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={startupForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={startupForm.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yatırım Değeri (₺)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={startupForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sektör</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={startupForm.control}
                  name="riskLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Seviyesi</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Risk seviyesi seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Düşük">Düşük</SelectItem>
                          <SelectItem value="Orta">Orta</SelectItem>
                          <SelectItem value="Orta-Yüksek">Orta-Yüksek</SelectItem>
                          <SelectItem value="Yüksek">Yüksek</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createStartupMutation.isPending}>
                  Girişim Ata
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
