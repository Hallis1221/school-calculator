import "./style.css";

// Find the text field with the id "input" and connect a listener to it
const input = document.getElementById("input") as HTMLInputElement;
const output = document.getElementById("output") as HTMLParagraphElement;

// Focus the text field when the page loads
input.focus();
setTimeout(() => {
  input.focus();
}, 1);

input.addEventListener("blur", () => {
  input.focus();
  setTimeout(() => {
    input.focus();
  }, 1);
});

input.addEventListener("input", () => {
  // Remove all characters that are not numbers, parentheses, operators, or decimals
  let str = input.value.replace(/[^0-9\(\)\+\-\*\/\^\.]/g, "");

  // Replace ** with ^
  str = str.replace(/\*\*/g, "^");

  // Replace all decimals with .
  str = str.replace(/,/g, ".");

  // Return if the string starts with an operator
  if (str.startsWith("*") || str.startsWith("/") || str.startsWith("^")) {
    return;
  }

  // Calculate the result
  const result = calculateFromStr(str);

  output.innerText = result.toString();
  console.log(result);
});

input.addEventListener("keydown", (e) => {
  // Make sure the user can't type anything other than numbers, parentheses, operators, or decimals. Allow backspace, delete and keys that move the cursor

  if (
    e.key === "Backspace" ||
    e.key === "Delete" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown"
  ) {
    return;
  } else if (e.key.match(/[^0-9\(\)\+\-\*\/\^\.]/g)) {
    e.preventDefault();
  }
});

function calculateFromStr(str: string): number {
  let parts = Array.from(str);
  let newParts: string[] = [];
  // Combine parts of a number into a single number
  parts.forEach((part, index) => {
    if (!isNaN(Number(part))) {
      if (index === 0) {
        newParts.push(part);
      } else {
        newParts[newParts.length - 1] += part;
      }
    } else {
      newParts.push(part);
      newParts.push("");
    }
  });

  console.log(newParts);

  // Remove empty elements
  newParts = newParts.filter((part) => part !== "");

  parts = newParts;

  // Solve the parentheses first using recursion

  // IF there are any parentheses, both the opening and closing parentheses must be present
  if (parts.includes("(") && parts.includes(")")) {
    let parentheses = parts.filter((part) => part === "(" || part === ")");
    if (parentheses.length > 0) {
      let start = parts.indexOf("(");
      let end = parts.indexOf(")");
      let subStr = parts.slice(start + 1, end).join("");
      let subResult = calculateFromStr(subStr);
      parts.splice(start, end - start + 1, subResult.toString());
      return calculateFromStr(parts.join(""));
    }
  }

  // Solve the exponents
  let exponents = parts.filter((part) => part === "^");
  if (exponents.length > 0) {
    let index = parts.indexOf("^");
    let base = Number(parts[index - 1]);
    let exponent = Number(parts[index + 1]);
    let subResult = Math.pow(base, exponent);
    parts.splice(index - 1, 3, subResult.toString());
    return calculateFromStr(parts.join(""));
  }

  // Solve the multiplication and division
  let multDiv = parts.filter((part) => part === "*" || part === "/");
  if (multDiv.length > 0) {
    let index = parts.indexOf("*");
    if (index === -1) {
      index = parts.indexOf("/");
    }
    let subResult = 0;
    if (parts[index] === "*") {
      subResult = Number(parts[index - 1]) * Number(parts[index + 1]);
    } else {
      subResult = Number(parts[index - 1]) / Number(parts[index + 1]);
    }
    parts.splice(index - 1, 3, subResult.toString());
    return calculateFromStr(parts.join(""));
  }

  // Solve the addition and subtraction
  let addSub = parts.filter((part) => part === "+" || part === "-");
  if (addSub.length > 0) {
    let index = parts.indexOf("+");
    if (index === -1) {
      index = parts.indexOf("-");
    }
    let subResult = 0;
    if (parts[index] === "+") {
      subResult = Number(parts[index - 1]) + Number(parts[index + 1]);
    } else {
      subResult = Number(parts[index - 1]) - Number(parts[index + 1]);
    }
    parts.splice(index - 1, 3, subResult.toString());
    return calculateFromStr(parts.join(""));
  }

  // If there are no more operations, return the result
  return Number(parts.join(""));
}
