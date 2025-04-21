import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PTIntakeUI() {
  const [patientName, setPatientName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [goal, setGoal] = useState("");
  const [patientFile, setPatientFile] = useState("");
  const [suggestions, setSuggestions] = useState(null);

  const handleSubmit = async () => {
    const res = await fetch("http://127.0.0.1:8000/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_name: patientName,
        symptoms,
        goal,
        patient_file: patientFile,
      }),
    });

    const data = await res.json();
    setSuggestions(parseResponse(data.suggestions));
  };

  const parseResponse = (text) => {
    const lines = text.split(/\n|\r/);
    const rec = lines.filter(line => line.includes("•") || line.includes("-"));
    return {
      recommended: rec.filter(l => l.toLowerCase().includes("exercise")),
      contraindications: rec.filter(l => l.toLowerCase().includes("avoid")),
      notes: text,
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">PT AI Assistant</h1>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <Input placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
          <Textarea placeholder="Paste patient's medical file or clinical notes here" value={patientFile} onChange={(e) => setPatientFile(e.target.value)} />
          <Textarea placeholder="Describe symptoms or diagnosis" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
          <Textarea placeholder="Rehab goals (e.g. return to sport, reduce pain)" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <Button onClick={handleSubmit}>Generate Treatment Plan</Button>
        </CardContent>
      </Card>

      {suggestions && (
        <Tabs defaultValue="plan">
          <TabsList>
            <TabsTrigger value="plan">Recommended Plan</TabsTrigger>
            <TabsTrigger value="cautions">Contraindications</TabsTrigger>
            <TabsTrigger value="notes">AI Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="plan">
            <ul className="list-disc pl-6">{suggestions.recommended.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </TabsContent>
          <TabsContent value="cautions">
            <ul className="list-disc pl-6 text-red-600">{suggestions.contraindications.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </TabsContent>
          <TabsContent value="notes">
            <p>{suggestions.notes}</p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
