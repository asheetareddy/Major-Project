document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generatedTime").textContent = new Date().toLocaleString();
    document.getElementById("imageName").textContent = localStorage.getItem("imageName") || "N/A";
    document.getElementById("reportProbability").textContent = localStorage.getItem("morphProbability") || "N/A";
    document.getElementById("reportClassification").textContent = localStorage.getItem("classification") || "N/A";
    document.getElementById("reportID").textContent = Math.floor(Math.random() * 90000) + 10000;
});

document.getElementById("downloadReport").addEventListener("click", function () {
    let reportHTML = document.documentElement.outerHTML;
    let blob = new Blob([reportHTML], { type: "text/html" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "MorphDetecto_Report.html";
    link.click();
});
