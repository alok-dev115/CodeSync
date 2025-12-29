import { useEffect, useState } from "react";

const TypewriterText = ({ text, speed = 80 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= text.length) return;

    const timeout = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, text, speed]);

  return (
    <span>
      {text.slice(0, index)}
      {index < text.length && (
        <span className="ml-1 animate-pulse">|</span>
      )}
    </span>
  );
};

export default TypewriterText;
