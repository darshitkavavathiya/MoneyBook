"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportAllData } from "@/app/actions/export";
import { Download } from "lucide-react";

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const base64Data = await exportAllData();
      
      // Convert base64 to Blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `moneybook_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      className="w-full" 
      onClick={handleExport}
      disabled={isExporting}
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Exporting..." : "Export All Data (XLSX)"}
    </Button>
  );
}
