
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import RecordsAnalysis from "@/components/RecordsAnalysis";
import ThreatDetection from "@/components/ThreatDetection";
import DataUploader from "@/components/DataUploader";
import CDRModule from "@/components/CDRModule";
import IPDRModule from "@/components/IPDRModule";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">CDR/IPDR Analysis Dashboard</h1>
        <Button variant="outline" asChild>
          <Link to="/feasibility">Feasibility Studies</Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Threats Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-destructive">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analysis Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-muted-foreground">Ready</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <DataUploader />
      </div>

      <Tabs defaultValue="cdr" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cdr">CDR Analysis</TabsTrigger>
          <TabsTrigger value="ipdr">IPDR Analysis</TabsTrigger>
          <TabsTrigger value="analysis">Records Analysis</TabsTrigger>
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
        </TabsList>
        <TabsContent value="cdr">
          <CDRModule />
        </TabsContent>
        <TabsContent value="ipdr">
          <IPDRModule />
        </TabsContent>
        <TabsContent value="analysis">
          <RecordsAnalysis />
        </TabsContent>
        <TabsContent value="threats">
          <ThreatDetection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
