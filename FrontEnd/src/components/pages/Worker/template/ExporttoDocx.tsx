import React, { useState, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

interface Props {
  templates: Template[];
  onRemoveFromExport: (templateId: string) => void;
}

const ExportToDocx: React.FC<Props> = ({ templates, onRemoveFromExport }) => {
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>(templates);

  useEffect(() => {
    setSelectedTemplates(templates);
  }, [templates]);

  const generateDocx = () => {
    if (selectedTemplates.length === 0) {
      alert("Please select at least one template.");
      return;
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: selectedTemplates.flatMap((template) => [
            new Paragraph({
              children: [
                new TextRun({ text: template.title, bold: true, size: 28 }),
                new TextRun(` - ${template.workerName}`),
              ],
            }),
            ...Object.entries(template.content).flatMap(([key, value]) => {
              if (Array.isArray(value)) {
                return [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${key}:`, bold: true }),
                      new TextRun(''),
                    ],
                  }),
                  ...value.map((item) => 
                    new Paragraph({
                      children: [new TextRun(`- ${item}`)],
                    })
                  ),
                ];
              } else {
                return [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${key}:`, bold: true }),
                      new TextRun(value),
                    ],
                  }),
                ];
              }
            }),
            new Paragraph(""), // Space between templates
          ]),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Templates.docx");
    });
  };

  return (
    <div>
      <h2>Selected Templates</h2>
      <ul>
        {selectedTemplates.length === 0 ? (
          <p>No templates selected.</p>
        ) : (
          selectedTemplates.map((template) => (
            <li key={template._id}>
              {template.title} - {template.workerName}
              <button onClick={() => onRemoveFromExport(template._id)}>Remove</button>
            </li>
          ))
        )}
      </ul>

      <button onClick={generateDocx} disabled={selectedTemplates.length === 0}>
        Export to DOCX
      </button>
    </div>
  );
};

export default ExportToDocx;