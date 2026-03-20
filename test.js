fetch("http://localhost:3000/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ idea: "I want to start a business" })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
