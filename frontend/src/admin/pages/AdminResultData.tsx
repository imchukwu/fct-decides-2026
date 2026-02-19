
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Calculator } from "lucide-react";

// --- Schema Definitions ---

const resultSchema = z.object({
    areaCouncil: z.string().min(1, "Area Council is required"),
    lga: z.string().min(1, "LGA is required"),
    ward: z.string().min(1, "Ward is required"),
    pollingUnit: z.string().min(1, "Polling Unit Name/Code is required"),

    // Party Votes (Using strings for inputs to handle empty states, coerced to numbers)
    apc: z.coerce.number().min(0),
    pdp: z.coerce.number().min(0),
    lp: z.coerce.number().min(0),
    nnpp: z.coerce.number().min(0),
    others: z.coerce.number().min(0),

    // Totals
    totalValid: z.coerce.number().min(0),
    rejected: z.coerce.number().min(0),
    totalCast: z.coerce.number().min(0),
    accreditedVoters: z.coerce.number().min(0, "Must be positive"),
});

export default function AdminResultData() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof resultSchema>>({
        resolver: zodResolver(resultSchema),
        defaultValues: {
            apc: 0,
            pdp: 0,
            lp: 0,
            nnpp: 0,
            others: 0,
            totalValid: 0,
            rejected: 0,
            totalCast: 0,
            accreditedVoters: 0,
        },
    });

    // Watch values to auto-calculate totals
    const apc = form.watch("apc");
    const pdp = form.watch("pdp");
    const lp = form.watch("lp");
    const nnpp = form.watch("nnpp");
    const others = form.watch("others");
    const acceptedValid = form.watch("totalValid");
    const rejected = form.watch("rejected");
    const accredited = form.watch("accreditedVoters");

    // Auto-calculate Valid Votes
    useEffect(() => {
        const sum = (Number(apc) || 0) + (Number(pdp) || 0) + (Number(lp) || 0) + (Number(nnpp) || 0) + (Number(others) || 0);
        if (sum !== acceptedValid) {
            form.setValue("totalValid", sum);
        }
    }, [apc, pdp, lp, nnpp, others, form]);

    // Auto-calculate Total Cast
    useEffect(() => {
        const sum = (Number(acceptedValid) || 0) + (Number(rejected) || 0);
        form.setValue("totalCast", sum);
    }, [acceptedValid, rejected, form]);

    const turnout = accredited > 0 ? ((form.watch("totalCast") / accredited) * 100).toFixed(1) : "0.0";

    const onSubmit = async (values: z.infer<typeof resultSchema>) => {
        // Validation: Total Cast cannot exceed Accredited
        if (values.totalCast > values.accreditedVoters) {
            form.setError("totalCast", { message: "Total Votes Cast cannot exceed Accredited Voters" });
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        console.log("Submitting Results:", values);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Result data submitted successfully", { description: "Result sheet captured." });
        setIsSubmitting(false);
        form.reset();
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Result Data Upload</h2>
                <p className="text-muted-foreground">
                    Capture raw polling unit election results.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Location Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="areaCouncil" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Area Council</FormLabel>
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
                            <FormField control={form.control} name="lga" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LGA</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select LGA" /></SelectTrigger></FormControl>
                                        <SelectContent><SelectItem value="generic">Generic LGA</SelectItem></SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="ward" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ward</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select Ward" /></SelectTrigger></FormControl>
                                        <SelectContent><SelectItem value="generic">Generic Ward</SelectItem></SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="pollingUnit" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Polling Unit</FormLabel>
                                    <FormControl><Input placeholder="Name/Code" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="accreditedVoters" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Accredited Voters</FormLabel>
                                    <FormControl><Input type="number" {...field} className="font-bold" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Party Votes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Party Votes</CardTitle>
                                <CardDescription>Enter votes for each party.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="apc" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>APC</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="pdp" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PDP</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="lp" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>LP</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="nnpp" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NNPP</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="others" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Others</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        {/* Summary / Confirmation */}
                        <Card className="bg-muted/10 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Result Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-background rounded-lg border space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Total Valid Votes (Auto)</span>
                                        <span className="font-mono font-bold text-lg">{form.watch("totalValid")}</span>
                                    </div>
                                    <FormField control={form.control} name="rejected" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rejected Votes</FormLabel>
                                            <FormControl><Input type="number" {...field} className="text-right" /></FormControl>
                                        </FormItem>
                                    )} />
                                    <div className="h-px bg-border" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">Total Votes Cast</span>
                                        <span className="font-mono font-bold text-xl text-primary">{form.watch("totalCast")}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                                        <span>Turnout Percentage</span>
                                        <span>{turnout}%</span>
                                    </div>
                                </div>

                                {Number(turnout) > 100 && (
                                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 font-medium">
                                        Warning: Total votes exceed accredited voters!
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Button type="submit" size="lg" className="w-full font-bold" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : <><Save className="mr-2 h-4 w-4" /> Submit Result Data</>}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
