import { useState, useEffect } from "react";
import { Users, Clock, Shield, CheckCircle, AlertTriangle, Play, FileText, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const collationStats = [
  { label: "INEC OFFICERS", value: "450", sub: "TOTAL PERSONNEL", icon: Users, color: "text-primary" },
  { label: "FEMALE OFFICERS", value: "192", sub: "42.6% REPRESENTATION", icon: Users, color: "text-primary" },
  { label: "SECURITY PRESENCE", value: "Confirmed", sub: "ALL CENTERS MONITORED", icon: Shield, color: "text-primary" },
  { label: "PARTY AGENTS", value: "1,240", sub: "TOTAL ACROSS CENTERS", icon: CheckCircle, color: "text-primary" },
];

const arrivalBars = [
  { label: "Before 4:00 PM", value: 65, color: "bg-primary" },
  { label: "4:01 PM - 6:00 PM", value: 45, color: "bg-chart-blue" },
  { label: "6:01 PM - 9:00 PM", value: 20, color: "bg-chart-orange" },
  { label: "After 9:00 PM", value: 10, color: "bg-chart-red" },
];

const commencementData = [
  { name: "Immediate", value: 40, fill: "hsl(160, 85%, 48%)" },
  { name: "Scheduled (6-8PM)", value: 30, fill: "hsl(210, 85%, 58%)" },
  { name: "Delayed (8-10PM)", value: 20, fill: "hsl(30, 95%, 58%)" },
  { name: "Night (Post 10PM)", value: 10, fill: "hsl(0, 78%, 58%)" },
];

const auditItems = [
  { label: "EC 8B Forms Submitted", value: 98.5 },
  { label: "EC 8C Properly Collated", value: 96.2 },
  { label: "CSRVS Crosscheck Done", value: 92.4 },
  { label: "EC 40G Checklist Transferred", value: 89 },
  { label: "EC 40H (PWD) Transferred", value: 87.5 },
  { label: "Votes Announced Loudly", value: 99.1 },
  { label: "Agents Requested to Sign", value: 95.8 },
  { label: "EC 8C Copies Distributed", value: 84.2 },
  { label: "EC 60E Poster Displayed", value: 81.6 },
];

const alertData = [
  { label: "Result Disputes Recorded", value: 12, color: "text-chart-yellow" },
  { label: "Intimidation Incidents", value: 4, color: "text-chart-orange" },
  { label: "Disruption Attempts", value: 2, color: "text-destructive" },
];

const signatureData = [
  { party: "ADC", signed: 85, refused: 15 },
  { party: "APC", signed: 78, refused: 22 },
  { party: "PDP", signed: 80, refused: 20 },
  { party: "ZLP", signed: 75, refused: 25 },
  { party: "Others", signed: 70, refused: 30 },
];

export default function ResultCollation() {
  const [stats, setStats] = useState({
    collation_started: 0,
    results_uploaded: 0
  });

  const [displayData, setDisplayData] = useState({
    stats: collationStats,
    arrival: arrivalBars,
    commencement: commencementData,
    audit: auditItems,
    alerts: alertData,
    signatures: signatureData
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
        const response = await fetch(`${baseURL}/dashboard/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);

          // If no collation started or results uploaded, zero out relevant data
          if (data.collation_started === 0 && data.results_uploaded === 0) {
            setDisplayData({
              stats: [
                { label: "INEC OFFICERS", value: "0", sub: "TOTAL PERSONNEL", icon: Users, color: "text-primary" },
                { label: "FEMALE OFFICERS", value: "0", sub: "0% REPRESENTATION", icon: Users, color: "text-primary" },
                { label: "SECURITY PRESENCE", value: "Pending", sub: "AWAITING REPORTS", icon: Shield, color: "text-primary" },
                { label: "PARTY AGENTS", value: "0", sub: "TOTAL ACROSS CENTERS", icon: CheckCircle, color: "text-primary" },
              ],
              arrival: arrivalBars.map(b => ({ ...b, value: 0 })),
              commencement: commencementData.map(c => ({ ...c, value: 0 })),
              audit: auditItems.map(a => ({ ...a, value: 0 })),
              alerts: [],
              signatures: []
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch public stats", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 stagger-children">
        {displayData.stats.map((s) => (
          <div key={s.label} className="stat-card-glow flex items-start justify-between hover:scale-[1.02] transition-transform duration-200">
            <div>
              <div className="text-[10px] tracking-wider text-muted-foreground">{s.label}</div>
              <div className="text-2xl lg:text-3xl font-bold text-foreground mt-1">{s.value}</div>
              <div className={`text-[10px] tracking-wider mt-1 ${s.color}`}>{s.sub}</div>
            </div>
            <div className="rounded-full bg-accent p-2 glow-green">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        ))}
      </div>

      {/* Officer Arrival + Commencement Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="dashboard-section animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-accent p-2"><Clock className="h-5 w-5 text-primary" /></div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Officer Arrival Distribution</h3>
              <p className="text-sm text-muted-foreground">Timing of official arrival at collation centers</p>
            </div>
          </div>
          <div className="space-y-5 mt-6">
            {displayData.arrival.map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground w-32 lg:w-36 text-right shrink-0">{bar.label}</div>
                <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                  <div className={`h-full rounded-full bar-animate ${bar.color}`} style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-accent p-2"><Play className="h-5 w-5 text-primary" /></div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Commencement Timeline</h3>
              <p className="text-sm text-muted-foreground">Distribution of when collation officially began</p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie data={displayData.commencement} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" strokeWidth={0} animationBegin={200} animationDuration={1000}>
                  {displayData.commencement.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {displayData.commencement.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="text-[10px] tracking-wider text-muted-foreground uppercase">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Integrity Audit + Alert Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 dashboard-section animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent p-2"><FileText className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Process Integrity Audit</h3>
                <p className="text-sm text-muted-foreground">Compliance status for collation protocols</p>
              </div>
            </div>
            <span className="text-xs tracking-wider text-primary border border-primary/30 rounded-full px-3 py-1 glow-green">OPERATIONAL EXCELLENCE</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
            {displayData.audit.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-border bg-accent/30 px-4 py-3 hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <span className={`text-sm font-bold ${item.value >= 90 ? "text-primary" : item.value >= 85 ? "text-chart-yellow" : "text-chart-orange"}`}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-destructive/20 p-2"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
            <h3 className="text-lg font-bold text-foreground">Alert Monitoring</h3>
          </div>
          <div className="space-y-4">
            {displayData.alerts.length > 0 ? (
              displayData.alerts.map((alert) => (
                <div key={alert.label} className="flex items-center justify-between rounded-lg border border-border bg-accent/30 px-4 py-4 hover:border-primary/30 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                    <span className="text-sm text-foreground">{alert.label}</span>
                  </div>
                  <span className={`text-2xl font-bold ${alert.color}`}>{alert.value}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">No alerts reported</div>
            )}
          </div>
          <div className="mt-4 rounded-lg border border-border bg-accent/30 px-4 py-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">Verified monitoring reports indicate 98% stability in current centers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Signature Rate */}
      <div className="dashboard-section animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-accent p-2"><Activity className="h-5 w-5 text-primary" /></div>
          <h3 className="text-lg font-bold text-foreground">Agent Signature Rate</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={displayData.signatures} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 20%, 18%)" />
            <XAxis dataKey="party" stroke="hsl(160, 10%, 55%)" tick={{ fontSize: 12 }} />
            <YAxis stroke="hsl(160, 10%, 55%)" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(160, 25%, 11%)", border: "1px solid hsl(160, 20%, 18%)", borderRadius: 8, color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => <span className="text-muted-foreground uppercase tracking-wider text-[10px]">{value}</span>} />
            <Bar dataKey="refused" name="Refused/Absent" stackId="a" fill="hsl(160, 10%, 40%)" radius={[0, 0, 0, 0]} animationDuration={1200} />
            <Bar dataKey="signed" name="Signed Results" stackId="a" fill="hsl(160, 85%, 48%)" radius={[6, 6, 0, 0]} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
