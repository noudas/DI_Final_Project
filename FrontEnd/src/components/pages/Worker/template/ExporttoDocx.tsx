import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

interface Template {
  _id: string;
  title: string;
  workerName: string;
  content: Record<string, string>;
}

interface Props {
  templates: Template[];
}

const ExportToDocx: React.FC<Props> = ({ templates }) => {
  const generateDocx = () => {
    if (templates.length === 0) {
      alert("Please select at least one template.");
      return;
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: templates.map((template) => [
            new Paragraph({
              children: [
                new TextRun({ text: template.title, bold: true, size: 28 }),
                new TextRun(` - ${template.workerName}`),
              ],
            }),
            ...Object.entries(template.content).map(
              ([key, value]) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `${key}: `, bold: true }),
                    new TextRun(value),
                  ],
                })
            ),
            new Paragraph(""), // Space between templates
          ]).flat(),
        },
      ],
    });

    // Generate and save document
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Templates.docx");
    });
  };

  return (
    <div>
      <h2>Selected Templates</h2>
      <ul>
        {templates.length === 0 ? (
          <p>No templates selected.</p>
        ) : (
          templates.map((template) => (
            <li key={template._id}>
              {template.title} - {template.workerName}
            </li>
          ))
        )}
      </ul>

      <button onClick={generateDocx} disabled={templates.length === 0}>
        Export to DOCX
      </button>
    </div>
  );
};

export default ExportToDocx;
