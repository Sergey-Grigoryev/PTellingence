import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PTIntakeUI() {
  const [symptoms, setSymptoms] = useState("");
  const [goal, setGoal] = useState("");
  const [patientFile, setPatientFile] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading state for "Generate"
  const [loadingFollowUp, setLoadingFollowUp] = useState(false); // Loading state for "Follow-Up"

  const handleSubmit = async () => {
    console.log("handleSubmit triggered");
    setLoadingSubmit(true); // Start loading spinner
    try {
      const res = await fetch("https://ptellingence.onrender.com/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          goal,
          patient_file: patientFile,
        }),
      });

      const data = await res.json();
      setSuggestions(parseResponse(data.suggestions));
      setChatHistory([{ role: "assistant", content: data.suggestions }]);
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setLoadingSubmit(false); // Stop loading spinner
    }
  };

  const handleFollowUp = async () => {
    console.log("handleFollowUp triggered");
    setLoadingFollowUp(true); // Start loading spinner
    try {
      const res = await fetch("https://ptellingence.onrender.com/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: followUpQuestion.trim(), // Ensure no leading/trailing spaces
          chat_history: chatHistory.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error with follow-up:", errorText);
        alert(`Error: ${res.status} - ${res.statusText}`);
        return;
      }
  
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: followUpQuestion },
        { role: "assistant", content: data.response },
      ]);
      setFollowUpQuestion("");
    } catch (error) {
      console.error("Error with follow-up:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoadingFollowUp(false); // Stop loading spinner
    }
  };

  const parseResponse = (text) => {
    const lines = text.split(/\n|\r/);
    const rec = lines.filter((line) => line.includes("•") || line.includes("-"));
    return {
      recommended: rec.filter((l) => l.toLowerCase().includes("exercise")),
      contraindications: rec.filter((l) => l.toLowerCase().includes("avoid")),
      notes: text,
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">PTelligence</h1>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <h3 className="font-bold">Reminder: Please remove or anonymize any personal information before pasting patient files.
          Avoid including names, birth dates, contact info, or other details that could identify the patient.</h3>
          <Textarea
            placeholder="Paste patient's clinical notes here - DO NOT include any personal information (max: 2000 characters)"
            value={patientFile}
            onChange={(e) => setPatientFile(e.target.value)}
            maxLength={2000}
          />
          <Textarea
            placeholder="Describe symptoms or diagnosis (max: 500 characters)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            maxLength={500}
          />
          <Textarea
            placeholder="Rehab goals (e.g. return to sport, reduce pain - max: 500 characters)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            maxLength={500}
          />
          <Button onClick={handleSubmit} disabled={loadingSubmit}>
            {loadingSubmit ? <Spinner /> : "Generate Recommendations and Contraindications"}
          </Button>
        </CardContent>
      </Card>

      {suggestions && (
        <>
          <Tabs defaultValue="plan">
            <TabsList>
              <TabsTrigger value="plan">Recommended Plan</TabsTrigger>
              <TabsTrigger value="cautions">Contraindications</TabsTrigger>
              {/* <TabsTrigger value="notes">AI Notes</TabsTrigger> */}
            </TabsList>
            <TabsContent value="plan">
              <ul className="list-disc pl-6">
                {suggestions.recommended.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="cautions">
              <ul className="list-disc pl-6 text-red-600">
                {suggestions.contraindications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="notes">
              <p>{suggestions.notes}</p>
            </TabsContent>
          </Tabs>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-xl font-bold">Continue Clarification:</h2>
              <ul className="space-y-2">
                {chatHistory.map((message, index) => (
                  <li
                    key={index}
                    className={message.role === "user" ? "text-blue-600" : "text-gray-800"}
                  >
                    <strong>{message.role === "user" ? "You" : "AI"}:</strong>{" "}
                    {message.content}
                  </li>
                ))}
              </ul>
              <Textarea
                placeholder="Ask a follow-up question..."
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
              />
              <Button onClick={handleFollowUp} disabled={loadingFollowUp}>
                {loadingFollowUp ? <Spinner /> : "Submit"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
  );
}