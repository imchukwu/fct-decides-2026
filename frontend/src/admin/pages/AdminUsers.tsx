
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, UserPlus, Trash2, Lock } from "lucide-react";

// Mock Data
const initialUsers = [
    { id: 1, name: "Super Admin", email: "update the voters refistered t", role: "SUPER_ADMIN", status: "active", area: "All" },
    { id: 2, name: "John Doe", email: "john@yiaga.org", role: "CLERK", status: "active", area: "Abaji" },
    { id: 3, name: "Jane Smith", email: "jane@yiaga.org", role: "CLERK", status: "suspended", area: "Bwari" },
];

const userSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number required"),
    areaCouncil: z.string().min(1, "Area Council required"),
    password: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function AdminUsers() {
    const [users, setUsers] = useState(initialUsers);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: { fullName: "", email: "", phone: "", areaCouncil: "", password: "", confirmPassword: "" },
    });

    const onSubmit = (values: z.infer<typeof userSchema>) => {
        const newUser = {
            id: users.length + 1,
            name: values.fullName,
            email: values.email,
            role: "CLERK",
            status: "active",
            area: values.areaCouncil,
        };
        setUsers([...users, newUser]);
        toast.success("Data Clerk created successfully");
        setIsCreateOpen(false);
        form.reset();
    };

    const toggleStatus = (id: number) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));
        toast.success("User status updated");
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">
                        Manage Data Clerks and system access.
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Create Data Clerk</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                            <DialogDescription>
                                Add a new Data Clerk to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input placeholder="john@yiaga.org" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl><Input placeholder="080..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="areaCouncil" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assigned Area Council</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select AC" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Abaji">Abaji</SelectItem>
                                                <SelectItem value="Bwari">Bwari</SelectItem>
                                                <SelectItem value="Gwagwalada">Gwagwalada</SelectItem>
                                                <SelectItem value="Kuje">Kuje</SelectItem>
                                                <SelectItem value="Kwali">Kwali</SelectItem>
                                                <SelectItem value="AMAC">AMAC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl><Input type="password" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm</FormLabel>
                                            <FormControl><Input type="password" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Account</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Area Assigned</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                <TableCell>{user.area}</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === "active" ? "default" : "destructive"}>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" title="Reset Password"><Lock className="h-4 w-4" /></Button>
                                        {user.role !== "SUPER_ADMIN" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleStatus(user.id)}
                                                className={user.status === "active" ? "text-destructive" : "text-green-500"}
                                                title={user.status === "active" ? "Suspend" : "Activate"}
                                            >
                                                {user.status === "active" ? <Trash2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
