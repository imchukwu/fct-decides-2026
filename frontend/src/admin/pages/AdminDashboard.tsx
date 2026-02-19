
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Activity,
    CheckCircle,
    AlertCircle,
    FileText,
    Users,
    BarChart3
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import api from "../services/api";
import { ELECTION_DATA } from "../../constants/electionData";

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        {
            title: "Polling Units Opened",
            value: "0",
            total: `${ELECTION_DATA.delimitation.pollingUnits.toLocaleString()}`,
            percent: "0%",
            icon: CheckCircle,
            color: "text-green-500",
        },
        {
            title: "Incidents Reported",
            value: "0",
            total: "Live",
            percent: "-",
            icon: AlertCircle,
            color: "text-red-500",
        },
        {
            title: "Results Uploaded",
            value: "0",
            total: `${ELECTION_DATA.delimitation.pollingUnits.toLocaleString()}`,
            percent: "0%",
            icon: FileText,
            color: "text-blue-500",
        },
        {
            title: "Collation Started",
            value: "0",
            total: `${ELECTION_DATA.delimitation.wards} Wards`,
            percent: "0%",
            icon: Activity,
            color: "text-orange-500",
        },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/dashboard/stats");
                const data = response.data;
                const totalPus = ELECTION_DATA.delimitation.pollingUnits;
                const totalWards = ELECTION_DATA.delimitation.wards;

                setStats([
                    {
                        title: "Polling Units Opened",
                        value: data.pus_opened.toLocaleString(),
                        total: `${totalPus.toLocaleString()}`,
                        percent: `${Math.round((data.pus_opened / totalPus) * 100)}%`,
                        icon: CheckCircle,
                        color: "text-green-500",
                    },
                    {
                        title: "Incidents Reported",
                        value: data.incidents_reported.toString(),
                        total: "Live",
                        percent: "-", // Incidents don't have a clear percentage base
                        icon: AlertCircle,
                        color: "text-red-500",
                    },
                    {
                        title: "Results Uploaded",
                        value: data.results_uploaded.toLocaleString(),
                        total: `${totalPus.toLocaleString()}`,
                        percent: `${Math.round((data.results_uploaded / totalPus) * 100)}%`,
                        icon: FileText,
                        color: "text-blue-500",
                    },
                    {
                        title: "Collation Started",
                        value: data.collation_started.toLocaleString(),
                        total: `${totalWards} Wards`,
                        percent: `${Math.round((data.collation_started / totalWards) * 100)}%`,
                        icon: Activity,
                        color: "text-orange-500",
                    },
                ]);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };

        fetchStats();
        // Poll every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Overview of election day operations and data submission.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.percent} • {stat.total}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Delimitation and Voter Registration Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                        <th className="p-2 font-medium">Area Council</th>
                                        <th className="p-2 font-medium">Wards</th>
                                        <th className="p-2 font-medium">PUs</th>
                                        <th className="p-2 font-medium">RACs</th>
                                        <th className="p-2 font-medium">Sub RACs</th>
                                        <th className="p-2 font-medium">Super RACs</th>
                                        <th className="p-2 font-medium text-right">Reg. Voters</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ELECTION_DATA.areaCouncils.map((ac) => (
                                        <tr key={ac.name} className="border-t hover:bg-muted/50 transition-colors">
                                            <td className="p-2 font-medium">{ac.name}</td>
                                            <td className="p-2">{ac.wards}</td>
                                            <td className="p-2">{ac.pus.toLocaleString()}</td>
                                            <td className="p-2">{ac.racs}</td>
                                            <td className="p-2">{ac.subRacs || "-"}</td>
                                            <td className="p-2">{ac.superRacs || "-"}</td>
                                            <td className="p-2 text-right">{ac.votersFormatted}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-t bg-muted/30 font-bold">
                                        <td className="p-2">TOTAL</td>
                                        <td className="p-2">{ELECTION_DATA.totals.wards}</td>
                                        <td className="p-2">{ELECTION_DATA.totals.pus.toLocaleString()}</td>
                                        <td className="p-2">{ELECTION_DATA.totals.racs}</td>
                                        <td className="p-2">{ELECTION_DATA.totals.subRacs}</td>
                                        <td className="p-2">{ELECTION_DATA.totals.superRacs}</td>
                                        <td className="p-2 text-right">{ELECTION_DATA.totals.votersFormatted}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-muted/40 p-3 rounded-lg border">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Registered Voters</div>
                                <div className="text-xl font-bold">{ELECTION_DATA.voters.formatted}</div>
                                <div className="text-xs text-muted-foreground mt-1">As at February 2026</div>
                            </div>
                            <div className="bg-muted/40 p-3 rounded-lg border">
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Demographics</div>
                                <div className="flex justify-between mt-1 text-sm">
                                    <span>Male: <span className="font-bold">{ELECTION_DATA.voters.maleFormatted}</span></span>
                                    <span>Female: <span className="font-bold">{ELECTION_DATA.voters.femaleFormatted}</span></span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 text-right">PWDs: {ELECTION_DATA.voters.pwdsFormatted}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 h-fit">
                    <CardHeader>
                        <CardTitle>System Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <h4 className="flex items-center gap-2 font-semibold text-destructive mb-2">
                                <AlertCircle className="h-4 w-4" />
                                Danger Zone
                            </h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                Resetting the database will delete all election data including results, incidents, and collation records. This action cannot be undone.
                            </p>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={async () => {
                                    if (confirm("ARE YOU SURE? This will delete ALL election data!")) {
                                        try {
                                            await api.post("/admin/reset-db");
                                            alert("Database has been reset successfully.");
                                            window.location.reload();
                                        } catch (error) {
                                            console.error("Failed to reset DB", error);
                                            alert("Failed to reset database.");
                                        }
                                    }
                                }}
                            >
                                Reset Database
                            </Button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">System Status</span>
                                <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">OPERATIONAL</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>API Gateway</span>
                                    <span>v1.0.2</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Database</span>
                                    <span>PostgreSQL 16</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
