import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ChainBadge, chains } from "@/components/ChainSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Search, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

interface License {
  id: string;
  name: string;
  type: "license" | "certification";
  heldBy: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: "valid" | "expiring" | "expired";
  fileUrl: string;
  fileName: string;
}

const mockLicenses: Record<string, License[]> = {
  "chain-1": [
    {
      id: "1",
      name: "Food Service License",
      type: "license",
      heldBy: "Marco Rodriguez",
      issuedBy: "NYC Department of Health",
      issueDate: "2026-01-15",
      expiryDate: "2027-01-15",
      status: "valid",
      fileUrl: "#",
      fileName: "food_service_license_2024.pdf",
    },
    {
      id: "2",
      name: "Liquor License",
      type: "license",
      heldBy: "Sarah Chen",
      issuedBy: "State Liquor Authority",
      issueDate: "2023-06-01",
      expiryDate: "2027-06-01",
      status: "valid",
      fileUrl: "#",
      fileName: "liquor_license_2023.pdf",
    },
    {
      id: "3",
      name: "Food Safety Certification",
      type: "certification",
      heldBy: "James Thompson",
      issuedBy: "ServSafe",
      issueDate: "2024-03-10",
      expiryDate: "2027-03-10",
      status: "valid",
      fileUrl: "#",
      fileName: "servsafe_cert.pdf",
    },
    {
      id: "4",
      name: "Fire Safety Certificate",
      type: "certification",
      heldBy: "Marco Rodriguez",
      issuedBy: "FDNY",
      issueDate: "2023-09-20",
      expiryDate: "2027-09-20",
      status: "valid",
      fileUrl: "#",
      fileName: "fire_safety_cert.pdf",
    },
    {
      id: "5",
      name: "Health Inspection Certificate",
      type: "certification",
      heldBy: "Emily Davis",
      issuedBy: "NYC Health Department",
      issueDate: "2025-11-01",
      expiryDate: "2026-05-01",
      status: "expiring",
      fileUrl: "#",
      fileName: "health_inspection_2025.pdf",
    },
  ],
  "chain-2": [
    {
      id: "6",
      name: "Food Service License",
      type: "license",
      heldBy: "David Park",
      issuedBy: "LA County Health Dept",
      issueDate: "2024-02-20",
      expiryDate: "2026-02-20",
      status: "valid",
      fileUrl: "#",
      fileName: "food_license_la.pdf",
    },
    {
      id: "7",
      name: "Business Operating Permit",
      type: "license",
      heldBy: "Michelle Wong",
      issuedBy: "City of Los Angeles",
      issueDate: "2023-04-15",
      expiryDate: "2025-04-15",
      status: "expiring",
      fileUrl: "#",
      fileName: "business_permit_la.pdf",
    },
    {
      id: "8",
      name: "Food Handler Certification",
      type: "certification",
      heldBy: "Carlos Mendez",
      issuedBy: "California Food Handler",
      issueDate: "2024-06-01",
      expiryDate: "2027-06-01",
      status: "valid",
      fileUrl: "#",
      fileName: "food_handler_cert.pdf",
    },
  ],
  "chain-3": [
    {
      id: "9",
      name: "Food Establishment License",
      type: "license",
      heldBy: "Robert Johnson",
      issuedBy: "Chicago CDPH",
      issueDate: "2024-01-01",
      expiryDate: "2026-01-01",
      status: "valid",
      fileUrl: "#",
      fileName: "food_license_chicago.pdf",
    },
    {
      id: "10",
      name: "Allergen Awareness Certification",
      type: "certification",
      heldBy: "Lisa Martinez",
      issuedBy: "AllerTrain",
      issueDate: "2024-08-15",
      expiryDate: "2026-08-15",
      status: "valid",
      fileUrl: "#",
      fileName: "allergen_cert.pdf",
    },
    {
      id: "11",
      name: "Outdoor Dining Permit",
      type: "license",
      heldBy: "Robert Johnson",
      issuedBy: "City of Chicago",
      issueDate: "2023-05-01",
      expiryDate: "2025-05-01",
      status: "expiring",
      fileUrl: "#",
      fileName: "outdoor_permit.pdf",
    },
  ],
};

const Licenses = () => {
  const [selectedChain, setSelectedChain] = useState("chain-1");
  const [searchQuery, setSearchQuery] = useState("");

  const licenses = mockLicenses[selectedChain] || [];

  const filteredLicenses = licenses.filter(
    (license) =>
      license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.issuedBy.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownload = (license: License) => {
    // In a real app, this would download the actual file
    const blob = new Blob([`Mock content for ${license.name}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = license.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: License["status"]) => {
    switch (status) {
      case "valid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        );
      case "expiring":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
    }
  };

  const validCount = filteredLicenses.filter((l) => l.status === "valid").length;
  const expiringCount = filteredLicenses.filter((l) => l.status === "expiring").length;
  const expiredCount = filteredLicenses.filter((l) => l.status === "expired").length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader>
        <ChainBadge chainId={selectedChain} />
      </AppHeader>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Licenses & Certifications</h2>
          <p className="text-muted-foreground">Manage and download all restaurant licenses and certifications</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Valid Documents</CardDescription>
              <CardTitle className="text-2xl text-emerald-600">{validCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Expiring Soon</CardDescription>
              <CardTitle className="text-2xl text-amber-600">{expiringCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Expired</CardDescription>
              <CardTitle className="text-2xl text-red-600">{expiredCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search licenses and certifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Licenses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
            <CardDescription>
              {filteredLicenses.length} document{filteredLicenses.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Held By</TableHead>
                  <TableHead>Issued By</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow key={license.id}>
                    <TableCell className="font-medium">{license.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {license.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{license.heldBy}</TableCell>
                    <TableCell>{license.issuedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(license.issueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(license.expiryDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(license.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(license)} className="gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLicenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No licenses or certifications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Licenses;
