import { useState } from "react";
import { Users, Target, TrendingUp, AlertCircle, Search, Filter, ChevronRight, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const councils = ["ABUJA MUNICIPAL", "ABAJI", "BWARI", "GWAGWALADA", "KUJE", "KWALI"];

const resultStats = [
  { label: "REGISTERED VOTERS", value: "650,000", icon: Users, color: "bg-chart-blue text-white" },
  { label: "ACCREDITED VOTERS", value: "412,000", icon: Target, color: "bg-chart-cyan text-white" },
  { label: "VALID VOTES", value: "401,500", icon: TrendingUp, color: "bg-primary text-primary-foreground" },
  { label: "REJECTED VOTES", value: "10,500", icon: AlertCircle, color: "bg-destructive text-white" },
  { label: "TURNOUT %", value: "63.4%", icon: Users, color: "bg-chart-yellow text-primary-foreground" },
];

const barData = [
  { name: "Party A", votes: 185000 },
  { name: "Party APC", votes: 142000 },
  { name: "Party PDP", votes: 62000 },
  { name: "Party ADC", votes: 12500 },
];
const barColors = ["hsl(var(--primary))", "hsl(var(--chart-blue))", "hsl(var(--chart-orange))", "hsl(var(--chart-yellow))"];

const voteShare = [
  { party: "Party A", share: 46.1, color: "bg-primary" },
  { party: "Party APC", share: 35.4, color: "bg-chart-blue" },
  { party: "Party PDP", share: 15.4, color: "bg-chart-orange" },
  { party: "Party ADC", share: 3.1, color: "bg-chart-yellow" },
];

const wardData = [
  { name: "City Centre", sector: "ABUJA MUNICIPAL SECTOR", regVoters: "45,000", accredited: "28,000", turnout: 62.2, leadingParty: "PARTY A", validVotes: "27,500" },
  { name: "Garki", sector: "ABUJA MUNICIPAL SECTOR", regVoters: "52,000", accredited: "34,000", turnout: 65.4, leadingParty: "PARTY APC", validVotes: "33,200" },
  { name: "Wuse", sector: "ABUJA MUNICIPAL SECTOR", regVoters: "48,000", accredited: "31,000", turnout: 64.6, leadingParty: "PARTY A", validVotes: "30,500" },
  { name: "Maitama", sector: "ABUJA MUNICIPAL SECTOR", regVoters: "38,000", accredited: "25,000", turnout: 65.8, leadingParty: "PARTY APC", validVotes: "24,200" },
  { name: "Asokoro", sector: "ABUJA MUNICIPAL SECTOR", regVoters: "41,000", accredited: "27,000", turnout: 65.9, leadingParty: "PARTY A", validVotes: "26,100" },
];

export default function ResultData() {
  const [activeCouncil, setActiveCouncil] = useState(0);

  return (
    <div className="space-y-6">
      {/* Area Council Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto scrollbar-hide">
          {councils.map((c, i) => (
            <button
              key={c}
              onClick={() => setActiveCouncil(i)}
              className={`rounded-full px-4 lg:px-5 py-2 text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${i === activeCouncil ? "bg-primary text-primary-foreground glow-green scale-105" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">STATUS</span>
          <span className="flex items-center gap-1 text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            Live Collation
          </span>
        </div>
      </div>

      {/* Result Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 stagger-children">
        {resultStats.map((s) => (
          <div key={s.label} className={`rounded-xl flex items-start justify-between p-5 hover:scale-[1.02] transition-transform duration-200 shadow-md ${s.color}`}>
            <div>
              <div className="text-[10px] tracking-wider opacity-90">{s.label}</div>
              <div className="text-xl lg:text-2xl font-bold mt-1">{s.value}</div>
            </div>
            <s.icon className="h-4 w-4 opacity-80" />
          </div>
        ))}
      </div>

      {/* Party Performance + Vote Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 dashboard-section animate-fade-in border-chart-blue/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Party Performance</h3>
              <p className="text-sm text-muted-foreground">Council-wide Vote Distribution for {councils[activeCouncil]}</p>
            </div>
            <button className="rounded-lg border border-primary/40 p-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
              <Download className="h-4 w-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} layout="vertical" barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="votes" radius={[0, 6, 6, 0]} animationDuration={1200}>
                {barData.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-section space-y-5 animate-fade-in border-chart-orange/50">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-chart-orange/20 p-2 glow-green"><TrendingUp className="h-5 w-5 text-chart-orange" /></div>
            <h3 className="text-lg font-bold text-foreground">Vote Share %</h3>
          </div>
          {voteShare.map((v) => (
            <div key={v.party} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-1 rounded-full ${v.color}`} />
                  <span className="text-sm font-medium text-foreground">{v.party}</span>
                </div>
                <span className="text-sm font-bold text-primary">{v.share}%</span>
              </div>
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full bar-animate ${v.color}`} style={{ width: `${v.share * 2}%` }} />
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-primary/20 bg-accent/50 p-4 mt-4 glow-green">
            <div className="text-xs text-primary tracking-wider font-medium">LEAD ANALYSIS</div>
            <p className="text-sm text-muted-foreground mt-1">Party A leads by 43,000 votes in {councils[activeCouncil]}.</p>
          </div>
        </div>
      </div>

      {/* Ward Intelligence Breakdown */}
      <div className="dashboard-section animate-fade-in border-chart-yellow/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-chart-yellow/20 p-2"><Building2Icon className="h-5 w-5 text-chart-yellow" /></div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Ward Intelligence Breakdown</h3>
              <p className="text-sm text-muted-foreground">Comparative metrics across all wards in {councils[activeCouncil]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-accent/50 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-36" placeholder="Search ward..." />
            </div>
            <button className="rounded-lg border border-primary/40 p-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-primary/40">
                {["WARD NAME", "REG. VOTERS", "ACCREDITED", "TURNOUT %", "LEADING PARTY", "VALID VOTES", "ACTION"].map((h) => (
                  <th key={h} className="py-3 text-left text-[10px] tracking-wider text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wardData.map((ward, i) => (
                <tr key={ward.name} className="border-b border-primary/20 hover:bg-accent/30 transition-all duration-200" style={{ animationDelay: `${i * 80}ms` }}>
                  <td className="py-4">
                    <div className="font-medium text-foreground">{ward.name}</div>
                    <div className="text-[10px] text-muted-foreground tracking-wider">{ward.sector}</div>
                  </td>
                  <td className="text-sm text-muted-foreground">{ward.regVoters}</td>
                  <td className="text-sm text-muted-foreground">{ward.accredited}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{ward.turnout}%</span>
                      <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-chart-orange bar-animate" style={{ width: `${ward.turnout}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`text-[10px] font-medium tracking-wider px-2 py-1 rounded ${ward.leadingParty === "PARTY A" ? "bg-primary/20 text-primary" : "bg-chart-blue/20 text-chart-blue"
                      }`}>
                      {ward.leadingParty}
                    </span>
                  </td>
                  <td className="text-sm font-medium text-primary">{ward.validVotes}</td>
                  <td>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
      <path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" />
      <path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  );
}
