
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function DataUploader() {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const csvFile = files.find(file => file.type === 'text/csv');
    
    if (!csvFile) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', csvFile);

      const { data: functionData } = await supabase.functions.invoke('process-cdr-csv', {
        body: formData,
      });

      toast({
        title: "Success",
        description: `Processed ${functionData.recordsProcessed} records from CSV`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card
      className={`p-8 border-2 border-dashed ${
        isDragging ? "border-primary bg-primary/10" : "border-border"
      } transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div className="text-center">
          <p className="text-lg font-medium">Upload CDR/IPDR Files</p>
          <p className="text-sm text-muted-foreground">
            Drag and drop your CSV files here or click to browse
          </p>
        </div>
        <input
          type="file"
          multiple
          accept=".csv"
          className="hidden"
          id="file-upload"
          onChange={handleFileInput}
        />
        <Button disabled={isUploading} asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            {isUploading ? "Uploading..." : "Select Files"}
          </label>
        </Button>
      </div>
    </Card>
  );
}
