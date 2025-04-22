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
    setLoadingSubmit(true); // Start loading spinner
    try {
      const res = await fetch("http://127.0.0.1:8000/generate-plan", {
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
    setLoadingFollowUp(true); // Start loading spinner
    try {
      const res = await fetch("http://127.0.0.1:8000/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: followUpQuestion,
          chat_history: chatHistory,
        }),
      });

      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: followUpQuestion },
        { role: "assistant", content: data.response },
      ]);
      setFollowUpQuestion("");
    } catch (error) {
      console.error("Error with follow-up:", error);
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
      <h1 className="text-3xl font-bold">PT AI Assistant</h1>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <Textarea
            placeholder="Paste patient's clinical notes here"
            value={patientFile}
            onChange={(e) => setPatientFile(e.target.value)}
          />
          <Textarea
            placeholder="Describe symptoms or diagnosis"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <Textarea
            placeholder="Rehab goals (e.g. return to sport, reduce pain)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
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