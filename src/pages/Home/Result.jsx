const Result = ({ inputString }) => {
  const formatText = (text) => {
    // Split the input string into lines
    const lines = text.split("\n\n");
    return lines.map((line, index) => {
      // Check for conclusion and chapters
      if (line.trim().toLowerCase() === "conclusion") {
        return (
          <h2 key={index} style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Conclusion
          </h2>
        );
      } else if (line.trim().toLowerCase().startsWith("chapter")) {
        return (
          <h3 key={index} style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {line}
          </h3>
        );
      } else {
        // For other text, return it as a paragraph
        return (
          <p key={index} style={{ fontSize: "1rem" }}>
            {line}
          </p>
        );
      }
    });
  };

  return <div>{formatText(inputString)}</div>;
};

export default Result;
