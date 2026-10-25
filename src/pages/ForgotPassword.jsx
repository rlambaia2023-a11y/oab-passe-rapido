import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await base44.auth.resetPasswordRequest(email); } catch { /* ignore */ }
    finally { setLoading(false); setSent(true); }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Redefinir senha"
      subtitle="Modo local: sem envio por e-mail"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          <ArrowLeft className="w-3 h-3 inline mr-1" />Voltar para o login
        </Link>
      }
    >
      {sent ? (
        <div className="text-sm text-center space-y-3">
          <p>Se a conta existir neste navegador, você pode definir uma nova senha agora.</p>
          <Link to="/reset-password"><Button className="w-full h-12">Definir nova senha</Button></Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail da conta</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input id="email" type="email" autoComplete="email" autoFocus placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verificando...</> : "Continuar"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
