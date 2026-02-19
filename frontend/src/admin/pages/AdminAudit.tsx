
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download } from "lucide-react";

// Mock Data
const initialLogs = [
    { id: 1, action: "LOGIN", user: "Super Admin", details: "Successful login from IP 192.168.1.1", time: "2026-02-18 08:15:22", status: "success" },
    { id: 2, action: "USER_CREATE", user: "Super Admin", details: "Created user 'John Doe' (Clerk)", time: "2026-02-18 08:20:10", status: "success" },
    { id: 3, action: "UPLOAD_PROCESS", user: "John Doe", details: "Uploaded process data for PU 004", time: "2026-02-18 09:05:45", status: "success" },
    { id: 4, action: "LOGIN_FAILED", user: "Unknown", details: "Failed login attempt (admin@yiaga.org)", time: "2026-02-18 09:12:00", status: "failure" },
    { id: 5, action: "UPLOAD_RESULT", user: "Jane Smith", details: "Uploaded result sheet for PU 012", time: "2026-02-18 10:30:15", status: "success" },
    { id: 6, action: "EDIT_DATA", user: "Super Admin", details: "Corrected result entry for PU 008", time: "2026-02-18 11:00:00", status: "warning" },
];

export default function AdminAudit() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    const filteredLogs = initialLogs.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || log.action.includes(filterType.toUpperCase());
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Audit Trails</h2>
                <p className="text-muted-foreground">
                    System-wide activity logs and security events.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>
                        Monitoring user actions and system events.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search user or details..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Activities</SelectItem>
                                <SelectItem value="login">Logins</SelectItem>
                                <SelectItem value="upload">Data Uploads</SelectItem>
                                <SelectItem value="user">User Management</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-mono text-xs">{log.time}</TableCell>
                                        <TableCell className="font-medium">{log.user}</TableCell>
                                        <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                                        <TableCell className="max-w-[300px] truncate" title={log.details}>{log.details}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                log.status === "success" ? "secondary" :
                                                    log.status === "failure" ? "destructive" :
                                                        "outline"
                                            }>
                                                {log.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredLogs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">No results found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
