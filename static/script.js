/* document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const checkButton = document.querySelector("button");
    const resultDiv = document.createElement("div");
    resultDiv.style.marginTop = "20px";
    resultDiv.style.textAlign = "center";
    document.querySelector("main").appendChild(resultDiv);

    checkButton.addEventListener("click", async () => {
        if (!fileInput.files[0]) {
            resultDiv.innerHTML = `<p style="color: red;">Please select a file to upload.</p>`;
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            const response = await fetch("/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process the image.");
            }

            const result = await response.json();
            if (result.error) {
                resultDiv.innerHTML = `<p style="color: red;">Error: ${result.error}</p>`;
            } else {
                resultDiv.innerHTML = `
                    <p><strong>Result:</strong> ${result.result}</p>
                    <p><strong>Original Percentage:</strong> ${result.original_percentage}%</p>
                    <p><strong>Morphed Percentage:</strong> ${result.morphed_percentage}%</p>
                `;
            }
        } catch (error) {
            resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    });
});
*/

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const checkButton = document.querySelector("button");
    const generateReportButton = document.getElementById("generateReport");
    const resultDiv = document.createElement("div");
    resultDiv.style.marginTop = "20px";
    resultDiv.style.textAlign = "center";
    document.querySelector("main").appendChild(resultDiv);

    checkButton.addEventListener("click", async () => {
        if (!fileInput.files[0]) {
            resultDiv.innerHTML = `<p style="color: red;">Please select a file to upload.</p>`;
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            const response = await fetch("/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process the image.");
            }

            const result = await response.json();
            if (result.error) {
                resultDiv.innerHTML = `<p style="color: red;">Error: ${result.error}</p>`;
            } else {
                resultDiv.innerHTML = `
                    <p><strong>Result:</strong> ${result.result}</p>
                    <p><strong>Original Percentage:</strong> ${result.original_percentage}%</p>
                    <p><strong>Morphed Percentage:</strong> ${result.morphed_percentage}%</p>
                `;

                // Store data for the report page
                localStorage.setItem("imageName", fileInput.files[0].name);
                localStorage.setItem("morphProbability", result.morphed_percentage);
                localStorage.setItem("classification", result.result);

                // Show the "Generate Report" button
                generateReportButton.style.display = "block";
            }
        } catch (error) {
            resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    });

    // Redirect to report page when clicking "Generate Report"
    generateReportButton.addEventListener("click", () => {
        window.location.href = "report.html";
    });
});

