
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

// --- Schema Definitions ---

const openingSchema = z.object({
    areaCouncil: z.string().min(1, "Area Council is required"),
    lga: z.string().min(1, "LGA is required"),
    ward: z.string().min(1, "Ward is required"),
    pollingUnit: z.string().min(1, "Polling Unit Name/Code is required"),
    puOpen: z.enum(["yes", "no"], { required_error: "Please select if PU opened" }),
    openTime: z.string().optional(),
    delayReason: z.string().optional(),
    delayReasonOther: z.string().optional(),
});

// Simplified schema for demo purposes - ideally would valid conditional logic
const formSchema = openingSchema.extend({
    // Materials
    bvasAvailable: z.boolean().default(false),
    bvasFunctional: z.boolean().default(false),
    ballotPapersAvailable: z.boolean().default(false),
    resultSheetsAvailable: z.boolean().default(false),
    voterRegisterAvailable: z.boolean().default(false),
    adequacyRating: z.enum(["adequate", "partially", "inadequate"]).optional(),

    // Accreditation
    accreditationStarted: z.enum(["yes", "no"]).optional(),
    accreditationTime: z.string().optional(),
    bvasUsed: z.enum(["yes", "no"]).optional(),
    manualAccreditation: z.enum(["yes", "no"]).optional(),
    votingCommenced: z.enum(["yes", "no"]).optional(),
    votingEndTime: z.string().optional(),

    // Counting
    sortingCompleted: z.enum(["yes", "no"]).optional(),
    countingCompleted: z.enum(["yes", "no"]).optional(),
    resultSheetFilled: z.enum(["yes", "no"]).optional(),
    resultsAnnounced: z.enum(["yes", "no"]).optional(),

    // Incident
    incidentOccurred: z.enum(["yes", "no"]).optional(),
    incidentType: z.string().optional(),
    incidentSeverity: z.string().optional(),
    incidentTime: z.string().optional(),
    securityResponded: z.enum(["yes", "no"]).optional(),
});

export default function AdminProcessData() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            puOpen: "yes",
            bvasAvailable: false,
            bvasFunctional: false,
            ballotPapersAvailable: false,
            resultSheetsAvailable: false,
            voterRegisterAvailable: false,
        },
    });

    const puOpen = form.watch("puOpen");
    const incidentOccurred = form.watch("incidentOccurred");

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        // Simulate API call
        console.log("Submitting Process Data:", values);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Process data submitted successfully", { description: "Verified and logged to audit trail." });
        setIsSubmitting(false);
        form.reset();
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Process Data Upload</h2>
                <p className="text-muted-foreground">
                    Capture operational election checklist information per Polling Unit.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Tabs defaultValue="opening" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1">
                            <TabsTrigger value="opening">Opening</TabsTrigger>
                            <TabsTrigger value="materials">Materials</TabsTrigger>
                            <TabsTrigger value="accreditation">Accreditation</TabsTrigger>
                            <TabsTrigger value="counting">Counting</TabsTrigger>
                            <TabsTrigger value="incident">Incident</TabsTrigger>
                        </TabsList>

                        {/* --- Opening Tab --- */}
                        <TabsContent value="opening" className="space-y-4 py-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Polling Unit Opening</CardTitle>
                                    <CardDescription>Location and opening status details.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="areaCouncil" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Area Council</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select AC" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="none">Select...</SelectItem>
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
                                                <FormLabel>Polling Unit Code/Name</FormLabel>
                                                <FormControl><Input placeholder="e.g. 001 - Market Square" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <FormField control={form.control} name="puOpen" render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Did the Polling Unit Open?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="yes" /></FormControl>
                                                            <FormLabel className="font-normal">Yes</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="no" /></FormControl>
                                                            <FormLabel className="font-normal">No</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        {puOpen === "yes" && (
                                            <FormField control={form.control} name="openTime" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Opening Time</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select Time Band" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="before_730">Before 7:30 AM</SelectItem>
                                                            <SelectItem value="731_830">7:31 AM – 8:30 AM</SelectItem>
                                                            <SelectItem value="831_930">8:31 AM – 9:30 AM</SelectItem>
                                                            <SelectItem value="931_1030">9:31 AM – 10:30 AM</SelectItem>
                                                            <SelectItem value="after_1030">After 10:30 AM</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        )}

                                        {(puOpen === "no" || form.watch("openTime") === "after_1030" || form.watch("openTime") === "931_1030") && (
                                            <FormField control={form.control} name="delayReason" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Reason for Delay/closure</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select Reason" /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="late_arrival">Late Arrival of Officials</SelectItem>
                                                            <SelectItem value="security">Security Issues</SelectItem>
                                                            <SelectItem value="logistics">Logistics Delay</SelectItem>
                                                            <SelectItem value="bvas">BVAS Malfunction</SelectItem>
                                                            <SelectItem value="protest">Protest / Violence</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* --- Materials Tab --- */}
                        <TabsContent value="materials" className="space-y-4 py-4">
                            <Card>
                                <CardHeader><CardTitle>Materials Availability</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Checkboxes for boolean fields for cleaner UI than yes/no dropdowns */}
                                        <FormField control={form.control} name="bvasAvailable" render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                <div className="space-y-1 leading-none"><FormLabel>BVAS Device Available?</FormLabel></div>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="bvasFunctional" render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                <div className="space-y-1 leading-none"><FormLabel>BVAS Functional?</FormLabel></div>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="ballotPapersAvailable" render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                <div className="space-y-1 leading-none"><FormLabel>Ballot Papers Available?</FormLabel></div>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="resultSheetsAvailable" render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                <div className="space-y-1 leading-none"><FormLabel>Result Sheets Available?</FormLabel></div>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="adequacyRating" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Overall Material Adequacy</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Rating" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="adequate">Fully Adequate</SelectItem>
                                                    <SelectItem value="partially">Partially Adequate</SelectItem>
                                                    <SelectItem value="inadequate">Grossly Inadequate</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* --- Accreditation & Voting Tab --- */}
                        <TabsContent value="accreditation" className="space-y-4 py-4">
                            <Card>
                                <CardHeader><CardTitle>Accreditation & Voting</CardTitle></CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="accreditationStarted" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Accreditation Started?</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                                                    <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="accreditationTime" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Time</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Time Band" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="before_800">Before 8:00 AM</SelectItem>
                                                        <SelectItem value="801_900">8:01 AM – 9:00 AM</SelectItem>
                                                        <SelectItem value="901_1000">9:01 AM – 10:00 AM</SelectItem>
                                                        <SelectItem value="after_1100">After 11:00 AM</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="bvasUsed" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>BVAS Used?</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                                                    <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="votingEndTime" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Voting End Time</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Time Band" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="before_200">Before 2:00 PM</SelectItem>
                                                        <SelectItem value="201_300">2:01 PM – 3:00 PM</SelectItem>
                                                        <SelectItem value="301_400">3:01 PM – 4:00 PM</SelectItem>
                                                        <SelectItem value="after_400">After 4:00 PM</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* --- Counting Tab --- */}
                        <TabsContent value="counting" className="space-y-4 py-4">
                            <Card>
                                <CardHeader><CardTitle>Counting & Result Documentation</CardTitle></CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {["sortingCompleted", "countingCompleted", "resultSheetFilled", "resultsAnnounced"].map((name) => (
                                            <FormField key={name} control={form.control} name={name as any} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}?</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                                                        <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* --- Incident Tab --- */}
                        <TabsContent value="incident" className="space-y-4 py-4">
                            <Card>
                                <CardHeader><CardTitle>Incident Reporting</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField control={form.control} name="incidentOccurred" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Did any incident occur?</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />

                                    {incidentOccurred === "yes" && (
                                        <div className="grid gap-4 p-4 border rounded-lg bg-muted/20 animate-fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField control={form.control} name="incidentType" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Incident Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="security">Security Disruption</SelectItem>
                                                                <SelectItem value="violence">Violence</SelectItem>
                                                                <SelectItem value="bvas">BVAS Failure</SelectItem>
                                                                <SelectItem value="logistics">Logistics Issue</SelectItem>
                                                                <SelectItem value="dispute">Party Agent Dispute</SelectItem>
                                                                <SelectItem value="other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="incidentSeverity" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Severity</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="low">Low</SelectItem>
                                                                <SelectItem value="moderate">Moderate</SelectItem>
                                                                <SelectItem value="severe">Severe</SelectItem>
                                                                <SelectItem value="critical">Critical</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="incidentTime" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Time of Incident</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Time Band" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="morning">Morning (Before 10 AM)</SelectItem>
                                                                <SelectItem value="midday">Midday (10 AM - 2 PM)</SelectItem>
                                                                <SelectItem value="afternoon">Afternoon (2 PM - 5 PM)</SelectItem>
                                                                <SelectItem value="evening">Evening (After 5 PM)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="securityResponded" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Security Responded?</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Assessment" /></SelectTrigger></FormControl>
                                                            <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )} />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>

                    <Button type="submit" size="lg" className="w-full font-bold" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading Data...</> : <><Save className="mr-2 h-4 w-4" /> Submit Process Data</>}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
