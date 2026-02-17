import { Users, Clock, Shield, Package, CheckCircle, AlertCircle, Send, ClipboardList } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const summaryStats = [
  { label: "UNITS OBSERVING", value: "1,842", sub: "VERIFIED FIELD REPORTS", icon: Users, color: "text-chart-green" },
  { label: "STAFF ARRIVAL RATE", value: "89.5%", sub: "PRESENT BY 7:30 AM", icon: Clock, color: "text-chart-yellow" },
  { label: "SECURITY PRESENCE", value: "94.2%", sub: "LAW ENFORCEMENT ON-SITE", icon: Shield, color: "text-chart-orange" },
  { label: "SUPPLY READINESS", value: "96.1%", sub: "MATERIALS VERIFIED", icon: Package, color: "text-chart-cyan" },
];

const punctualityData = [
  { name: "On Time", value: 89, fill: "hsl(160, 85%, 48%)" },
  { name: "Late", value: 11, fill: "hsl(260, 50%, 40%)" },
];

const genderData = [
  { name: "Male", value: 53, fill: "hsl(210, 85%, 58%)" },
  { name: "Female", value: 47, fill: "hsl(330, 75%, 62%)" },
];

const complianceBars = [
  { label: "Early (Before 8:30 AM)", value: 70, color: "bg-primary" },
  { label: "On Time (8:31 - 9:30 AM)", value: 90, color: "bg-primary" },
  { label: "Slight Delay (9:31 - 10:30 AM)", value: 45, color: "bg-chart-red" },
  { label: "Major Delay (10:31 - 12:00 PM)", value: 25, color: "bg-chart-orange" },
  { label: "Failed to Open (Not Opened)", value: 5, color: "bg-chart-red" },
];

const materialItems = [
  { label: "BVAS Device", value: 97 },
  { label: "Voter Register", value: 99 },
  { label: "Indelible Ink", value: 94 },
  { label: "Official Stamp", value: 92 },
  { label: "Voting Cubicle", value: 89 },
  { label: "Results Form", value: 95 },
  { label: "Ballot Box", value: 98 },
];

const velocityData = [
  { time: "7:30", value: 10 },
  { time: "8:00", value: 35 },
  { time: "8:30", value: 65 },
  { time: "9:00", value: 85 },
];

const countingOps = [
  { label: "Agents Present During Count", value: 98.2 },
  { label: "Ballots Sorted in Piles", value: 94.5 },
  { label: "Results Posted Publicly", value: 88 },
  { label: "Transmitted via BVAS", value: 76.4 },
];

const incidents = [
  { severity: "CRITICAL", title: "Ballot Box Snatching", location: "Gwagwalada Center", source: "Real-time Feed", victim: "Party Agent", perpetrator: "Gang of Supporters" },
  { severity: "HIGH", title: "BVAS Malfunction", location: "Bwari PU 021", source: "Real-time Feed", victim: "Observers", perpetrator: "Technical Failure" },
  { severity: "HIGH", title: "Results Not Posted", location: "Kuje Central", source: "Real-time Feed", victim: "General Public", perpetrator: "Unknown Agents" },
];

function DonutChart({ data, centerValue, centerLabel }: { data: { name: string; value: number; fill: string }[]; centerValue: string; centerLabel: string }) {
  return (
    <div className="relative flex flex-col items-center">
      <ResponsiveContainer width={200} height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={85} dataKey="value" strokeWidth={0} animationBegin={200} animationDuration={1000}>
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-2xl font-bold text-primary animate-count-up">{centerValue}</div>
      </div>
      <div className="text-xs text-muted-foreground tracking-wider mt-1 text-center">{centerLabel}</div>
    </div>
  );
}

export default function ProcessData() {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 stagger-children">
        {summaryStats.map((s) => (
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 stagger-children">
        <div className="dashboard-section flex flex-col items-center animate-slide-up">
          <div className="flex items-center gap-3 w-full mb-4">
            <div className="rounded-full bg-accent p-2"><Clock className="h-5 w-5 text-primary" /></div>
            <h3 className="text-lg font-bold text-foreground">Staff Punctuality</h3>
          </div>
          <DonutChart data={punctualityData} centerValue="89%" centerLabel="OFFICIALS ARRIVED BEFORE 7:30 AM" />
        </div>

        <div className="dashboard-section flex flex-col items-center animate-slide-up">
          <div className="flex items-center gap-3 w-full mb-4">
            <div className="rounded-full bg-accent p-2"><Users className="h-5 w-5 text-primary" /></div>
            <h3 className="text-lg font-bold text-foreground">Gender Distribution</h3>
          </div>
          <DonutChart data={genderData} centerValue="" centerLabel="" />
          <div className="flex gap-8 mt-2">
            <div className="text-center">
              <div className="text-xl font-bold text-chart-blue">53%</div>
              <div className="text-[10px] text-muted-foreground tracking-wider">MALE STAFF</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-chart-pink">47%</div>
              <div className="text-[10px] text-muted-foreground tracking-wider">FEMALE STAFF</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-accent p-2"><Clock className="h-5 w-5 text-primary" /></div>
            <h3 className="text-lg font-bold text-foreground">Opening Compliance</h3>
          </div>
          <div className="space-y-4">
            {complianceBars.map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <div className="text-[11px] text-muted-foreground w-28 lg:w-32 text-right shrink-0">{bar.label}</div>
                <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                  <div className={`h-full rounded-full bar-animate ${bar.color}`} style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Material Supply Status */}
      <div className="dashboard-section animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-full bg-accent p-2"><Package className="h-5 w-5 text-primary" /></div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Material Supply Status</h3>
            <p className="text-sm text-muted-foreground">Inventory presence tracking by Area Council and Ward</p>
          </div>
        </div>
        <div className="grid grid-cols-4 lg:grid-cols-7 gap-4 mt-6 stagger-children">
          {materialItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200">
              <div className="relative h-16 w-16 rounded-full border-2 border-primary/30 flex items-center justify-center glow-green">
                <span className="text-sm font-bold text-primary">{item.value}%</span>
              </div>
              <span className="text-xs text-muted-foreground text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reporting Velocity + PU Counting Ops */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 dashboard-section animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-accent p-2"><Send className="h-5 w-5 text-primary" /></div>
            <h3 className="text-lg font-bold text-foreground">Reporting Velocity</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={velocityData}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 85%, 48%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(160, 85%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 20%, 18%)" />
              <XAxis dataKey="time" stroke="hsl(160, 10%, 55%)" tick={{ fontSize: 12 }} />
              <YAxis stroke="hsl(160, 10%, 55%)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(160, 25%, 11%)", border: "1px solid hsl(160, 20%, 18%)", borderRadius: 8, color: "#fff" }} />
              <Area type="monotone" dataKey="value" stroke="hsl(160, 85%, 48%)" fill="url(#greenGrad)" strokeWidth={2.5} animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 dashboard-section animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-accent p-2"><ClipboardList className="h-5 w-5 text-primary" /></div>
            <h3 className="text-lg font-bold text-foreground">PU Counting Ops</h3>
          </div>
          <div className="space-y-5">
            {countingOps.map((op) => (
              <div key={op.label} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground">{op.label}</span>
                  <span className="text-sm font-bold text-primary">{op.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary bar-animate" style={{ width: `${op.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Serious Election Incidents */}
      <div className="dashboard-section animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/20 p-2"><AlertCircle className="h-5 w-5 text-destructive" /></div>
            <h3 className="text-lg font-bold text-foreground">Serious Election Incidents</h3>
          </div>
          <span className="text-xs text-muted-foreground tracking-wider cursor-pointer hover:text-primary transition-colors">VIEW FULL AUDIT LOG</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
          {incidents.map((inc, i) => (
            <div key={i} className="rounded-xl border border-border bg-accent/50 p-5 space-y-3 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${inc.severity === "CRITICAL" ? "bg-destructive text-foreground" : "bg-chart-orange/20 text-chart-orange"}`}>
                  {inc.severity}
                </span>
                <span className="text-xs text-muted-foreground">{inc.source}</span>
              </div>
              <div>
                <div className={`font-bold ${inc.severity === "CRITICAL" ? "text-destructive" : "text-chart-orange"}`}>{inc.title}</div>
                <div className="text-sm text-muted-foreground">{inc.location}</div>
              </div>
              <div className="flex gap-8">
                <div>
                  <div className="text-[10px] tracking-wider text-muted-foreground">VICTIM AFFILIATION</div>
                  <div className="text-sm text-foreground">{inc.victim}</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-wider text-muted-foreground">PERPETRATOR</div>
                  <div className="text-sm text-foreground">{inc.perpetrator}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
