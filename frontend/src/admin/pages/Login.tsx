
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const success = await login(email, password);
            if (success) {
                navigate("/admin/dashboard");
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("An error occurred during login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            <Card className="w-full max-w-md z-10 border-primary/20 shadow-2xl bg-card/95 backdrop-blur-sm">
                <CardHeader className="space-y-1 flex flex-col items-center text-center pb-2">
                    <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        Admin Portal
                    </CardTitle>
                    <CardDescription>
                        Enter your official credentials to access the secure election management system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Official Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="officer@yiaga.org"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-background/50 border-input focus:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-background/50 border-input focus:border-primary"
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-destructive font-medium text-center bg-destructive/10 p-2 rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}
                        <Button className="w-full font-bold" type="submit" disabled={isLoading}>
                            {isLoading ? "Authenticating..." : "Access Secure Portal"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground pt-0">
                    <div>Authorized Personnel Only</div>
                    <div>Unauthorized access is prohibited and monitored.</div>
                </CardFooter>
            </Card>

            <div className="absolute bottom-4 text-center w-full text-xs text-muted-foreground/50">
                FCT Decides 2026 Admin System • v1.0.0
            </div>
        </div>
    );
}
