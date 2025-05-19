document.addEventListener('DOMContentLoaded', () => {
    const encodedTextInput = document.getElementById('encodedText');
    const secretKeyInput = document.getElementById('secretKey');
    const decryptButton = document.getElementById('decryptButton');
    const outputTextarea = document.getElementById('outputText');
    const exportPdfButton = document.getElementById('exportPdfButton');

    // Ensure jsPDF is loaded
    const { jsPDF } = window.jspdf;

    decryptButton.addEventListener('click', () => {
        // Add click animation
        decryptButton.classList.add('button-clicked-animation');
        setTimeout(() => {
            decryptButton.classList.remove('button-clicked-animation');
        }, 300); // Duration of the animation

        const encodedText = encodedTextInput.value;
        const secretKey = secretKeyInput.value.toUpperCase(); // Vigenere key is typically case-insensitive

        if (!encodedText) {
            alert('Please enter the encoded text.');
            return;
        }
        if (!secretKey) {
            alert('Please enter the secret key.');
            return;
        }
        if (!/^[A-Z]+$/.test(secretKey)) {
            alert('Secret key must contain only uppercase English alphabet characters (A-Z).');
            return;
        }

        try {
            const decryptedText = vigenereDecrypt(encodedText, secretKey);
            outputTextarea.value = decryptedText;
        } catch (error) {
            alert('An error occurred during decryption: ' + error.message);
            outputTextarea.value = ''; // Clear output on error
        }
    });

    function vigenereDecrypt(cipherText, key) {
        let plainText = "";
        let keyIndex = 0;

        for (let i = 0; i < cipherText.length; i++) {
            const char = cipherText[i];
            const charCode = char.charCodeAt(0);

            if (char >= 'A' && char <= 'Z') {
                const keyChar = key[keyIndex % key.length];
                const keyCode = keyChar.charCodeAt(0) - 'A'.charCodeAt(0);
                const plainCharCode = (charCode - 'A'.charCodeAt(0) - keyCode + 26) % 26;
                plainText += String.fromCharCode('A'.charCodeAt(0) + plainCharCode);
                keyIndex++;
            } else if (char >= 'a' && char <= 'z') {
                const keyChar = key[keyIndex % key.length];
                const keyCode = keyChar.charCodeAt(0) - 'A'.charCodeAt(0); // Key is already uppercase
                const plainCharCode = (charCode - 'a'.charCodeAt(0) - keyCode + 26) % 26;
                plainText += String.fromCharCode('a'.charCodeAt(0) + plainCharCode);
                keyIndex++;
            } else {
                plainText += char; // Non-alphabetic characters are passed through
            }
        }
        return plainText;
    }

    exportPdfButton.addEventListener('click', () => {
        const textToExport = outputTextarea.value;
        if (!textToExport.trim()) {
            alert('There is no decrypted message to export.');
            return;
        }

        if (typeof jsPDF === 'undefined') {
            alert('Error: PDF generation library (jsPDF) is not loaded.');
            return;
        }

        try {
            const doc = new jsPDF();
            // Add a title
            doc.setFontSize(18);
            doc.text("Decrypted Message for Shreyu", 14, 22);

            // Add the message content
            doc.setFontSize(12);
            // Split text into lines that fit the PDF width
            const lines = doc.splitTextToSize(textToExport, 180); // 180 is approx width in mm
            doc.text(lines, 14, 35);

            // Add a footer
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text("Made by Puchku ❤️", 14, doc.internal.pageSize.height - 10);

            doc.save('decrypted_message_for_shreyu.pdf');
        } catch (error) {
            alert('An error occurred while generating the PDF: ' + error.message);
            console.error("PDF Generation Error:", error);
        }
    });
});