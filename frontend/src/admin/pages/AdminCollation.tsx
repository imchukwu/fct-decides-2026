
import { useState } from "react";
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
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

// --- Schema Definitions ---

const collationSchema = z.object({
    level: z.enum(["ward", "lga"]),
    location: z.string().min(1, "Location is required"),

    // Collation Commencement
    collationStarted: z.enum(["yes", "no"]),
    startTime: z.string().optional(),
    delayReason: z.string().optional(),

    // Presence Monitoring
    inecPresent: z.boolean().default(false),
    securityPresent: z.boolean().default(false),
    partyAgentsPresent: z.boolean().default(false),
    observersPresent: z.boolean().default(false),

    // Process Status
    resultsReceived: z.enum(["yes", "no"]).default("no"),
    resultsEntered: z.enum(["yes", "no"]).default("no"),
    resultsAnnounced: z.enum(["yes", "no"]).default("no"),
    collationCompleted: z.enum(["yes", "no"]).default("no"),

    // Incidents
    disputes: z.enum(["yes", "no"]).default("no"),
    rejections: z.enum(["yes", "no"]).default("no"),
    severity: z.enum(["minor", "moderate", "major"]).optional(),
});

export default function AdminCollation() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof collationSchema>>({
        resolver: zodResolver(collationSchema),
        defaultValues: {
            collationStarted: "no",
            inecPresent: false,
            securityPresent: false,
            partyAgentsPresent: false,
            observersPresent: false,
        },
    });

    const collationStarted = form.watch("collationStarted");
    const disputes = form.watch("disputes");
    const rejections = form.watch("rejections");

    const onSubmit = async (values: z.infer<typeof collationSchema>) => {
        setIsSubmitting(true);
        // Simulate API call
        console.log("Submitting Collation Data:", values);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Collation data submitted successfully");
        setIsSubmitting(false);
        form.reset();
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Collation Center Upload</h2>
                <p className="text-muted-foreground">
                    Submit status reports from Ward and LGA collation centers.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Location & Commencement */}
                    <Card>
                        <CardHeader><CardTitle>Location & Status</CardTitle></CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="level" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Collation Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="ward">Ward Level</SelectItem><SelectItem value="lga">LGA Level</SelectItem></SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="location" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location Name</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select Center" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="center1">Collation Center A</SelectItem>
                                                <SelectItem value="center2">Collation Center B</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <FormField control={form.control} name="collationStarted" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Has Collation Started?</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="yes" /></FormControl>
                                                    <FormLabel className="font-normal">Yes</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="no" /></FormControl>
                                                    <FormLabel className="font-normal">No</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )} />

                                {collationStarted === "yes" && (
                                    <FormField control={form.control} name="startTime" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Time Band" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="before_1200">Before 12:00 PM</SelectItem>
                                                    <SelectItem value="1201_200">12:01 PM – 2:00 PM</SelectItem>
                                                    <SelectItem value="201_400">2:01 PM – 4:00 PM</SelectItem>
                                                    <SelectItem value="after_400">After 4:00 PM</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                )}

                                {collationStarted === "no" && (
                                    <FormField control={form.control} name="delayReason" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reason for Delay</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select Reason" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="awaiting">Awaiting PU Results</SelectItem>
                                                    <SelectItem value="logistics">Logistics Delay</SelectItem>
                                                    <SelectItem value="security">Security Issues</SelectItem>
                                                    <SelectItem value="disputes">Disputes</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Presence Monitoring */}
                    <Card>
                        <CardHeader><CardTitle>Presence Monitoring</CardTitle><CardDescription>Who is present at the collation center?</CardDescription></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="inecPresent" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5"><FormLabel>INEC Officials</FormLabel></div>
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="securityPresent" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5"><FormLabel>Security Agencies</FormLabel></div>
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="partyAgentsPresent" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5"><FormLabel>Party Agents</FormLabel></div>
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="observersPresent" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5"><FormLabel>Election Observers</FormLabel></div>
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Process Status */}
                    <Card>
                        <CardHeader><CardTitle>Collation Stages</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {["resultsReceived", "resultsEntered", "resultsAnnounced", "collationCompleted"].map((name) => (
                                    <FormField key={name} control={form.control} name={name as any} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase text-muted-foreground">{name.replace(/([A-Z])/g, ' $1').trim()}?</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="-" /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Incidents */}
                    <Card className="border-destructive/20">
                        <CardHeader>
                            <CardTitle className="text-destructive">Issues & Incidents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="disputes" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5"><FormLabel>Any Disputes?</FormLabel></div>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="w-[100px]"><SelectValue placeholder="-" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="rejections" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5"><FormLabel>Result Rejections?</FormLabel></div>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="w-[100px]"><SelectValue placeholder="-" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                            </div>

                            {(disputes === "yes" || rejections === "yes") && (
                                <FormField control={form.control} name="severity" render={({ field }) => (
                                    <FormItem className="animate-fade-in">
                                        <FormLabel>Incident Severity</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="minor">Minor</SelectItem>
                                                <SelectItem value="moderate">Moderate</SelectItem>
                                                <SelectItem value="major">Major</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                            )}
                        </CardContent>
                    </Card>

                    <Button type="submit" size="lg" className="w-full font-bold" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : <><Save className="mr-2 h-4 w-4" /> Submit Collation Report</>}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
