
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CustomerLocations from "@/components/feasibility/CustomerLocations";
import StudiesList from "@/components/feasibility/StudiesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewStudyDialog from "@/components/feasibility/NewStudyDialog";
import { useState } from "react";
import NewLocationDialog from "@/components/feasibility/NewLocationDialog";

export default function FeasibilityStudies() {
  const [isNewStudyOpen, setIsNewStudyOpen] = useState(false);
  const [isNewLocationOpen, setIsNewLocationOpen] = useState(false);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feasibility Studies</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsNewLocationOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
          <Button onClick={() => setIsNewStudyOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Study
          </Button>
        </div>
      </div>

      <Tabs defaultValue="studies">
        <TabsList>
          <TabsTrigger value="studies">Studies</TabsTrigger>
          <TabsTrigger value="locations">Customer Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="studies">
          <StudiesList />
        </TabsContent>
        <TabsContent value="locations">
          <CustomerLocations />
        </TabsContent>
      </Tabs>

      <NewStudyDialog open={isNewStudyOpen} onOpenChange={setIsNewStudyOpen} />
      <NewLocationDialog open={isNewLocationOpen} onOpenChange={setIsNewLocationOpen} />
    </div>
  );
}
