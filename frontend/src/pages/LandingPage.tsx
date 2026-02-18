
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Activity, Clock, FileText } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Background style - using a dark gradient placeholder that fits the green theme
    // If a specific image is provided, replace the background-image below
    const backgroundStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1596464716127-f9a865cb17c7?q=80&w=2940&auto=format&fit=crop')`, // Placeholder generic Abuja/Nigeria or abstract map image
        backgroundSize: "cover",
        backgroundPosition: "center",
    };

    const handleSelect = (value: string) => {
        navigate(value);
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden"
            style={backgroundStyle}
        >
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />

            <div className="relative z-10 max-w-md w-full space-y-8 animate-fade-in">
                <div className="space-y-2">
                    <div className="flex justify-center mb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary font-bold text-primary-foreground text-3xl shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                            F
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
                        FCT DECIDES <span className="text-primary">2026</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                        Real-time election monitoring and result collation dashboard
                    </p>
                </div>

                <div className="bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
                    <label className="text-sm font-medium text-white/80 mb-3 block text-left uppercase tracking-wider">
                        Select Dashboard View
                    </label>
                    <Select onValueChange={handleSelect} onOpenChange={setIsOpen}>
                        <SelectTrigger className="w-full h-14 text-lg bg-card/50 border-white/20 text-white focus:ring-primary/50 focus:border-primary transition-all hover:bg-card/70">
                            <SelectValue placeholder="Choose a destination..." />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border shadow-xl">
                            <SelectItem value="/process-data" className="py-3 cursor-pointer focus:bg-primary/20">
                                <div className="flex items-center gap-3">
                                    <Activity className="h-5 w-5 text-primary" />
                                    <div className="flex flex-col text-left">
                                        <span className="font-semibold">Process Data</span>
                                        <span className="text-xs text-muted-foreground">Monitoring & Logistics</span>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem value="/result-data" className="py-3 cursor-pointer focus:bg-primary/20">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-chart-blue" />
                                    <div className="flex flex-col text-left">
                                        <span className="font-semibold">Result Data</span>
                                        <span className="text-xs text-muted-foreground">Live Results & Trends</span>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem value="/result-collation" className="py-3 cursor-pointer focus:bg-primary/20">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-chart-orange" />
                                    <div className="flex flex-col text-left">
                                        <span className="font-semibold">Result Collation</span>
                                        <span className="text-xs text-muted-foreground">Official Forms & Tables</span>
                                    </div>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-xs text-white/40 pt-8">
                    &copy; 2026 Yiaga Africa • Watching The Vote
                </div>
            </div>
        </div>
    );
}
