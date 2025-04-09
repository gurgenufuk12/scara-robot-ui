import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

const API_URL = "http://localhost:8000/api/robot";

const ProgramMode = () => {
  const [program, setProgram] = useState("");
  const lines = program.split("\n");

  // console.log(program);
  const handleSubmitProgramCode = () => {
    if (!program) {
      console.error("Program kodu boş olamaz.");
      return;
    }
    try {
      fetch(`${API_URL}/send-program-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programCode: program,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setProgram("");
        })
        .catch((error) => {
          console.error("API hatası:", error);
        });
    } catch (error) {
      console.error("Program kodu gönderilirken hata oluştu:", error);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full h-full p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h2 className="text-xl text-gray-400 font-medium mb-4">Program Modu</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex w-full h-[60px] rounded-lg border border-gray-700">
            <Button
              onClick={handleSubmitProgramCode}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold  rounded"
            >
              Gönder
            </Button>
          </div>
          <div className="flex w-full h-96 bg-gray-800 text-white rounded overflow-hidden font-mono text-sm border border-gray-600">
            <div className="bg-gray-900 text-gray-400 p-2 text-right select-none">
              {lines.map((_, i) => (
                <div key={i} className="h-5 leading-5">
                  {i + 1}
                </div>
              ))}
            </div>

            <textarea
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="flex-1 p-2 bg-gray-800 resize-none outline-none border-none text-white"
              style={{ lineHeight: "1.25rem" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramMode;
