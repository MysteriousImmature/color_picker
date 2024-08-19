document.addEventListener('DOMContentLoaded', function () {
    const colorInput = document.getElementById('colorInput');
    const colorCode = document.getElementById('colorCode');
    const copyBtn = document.getElementById('copyBtn');

    // Update color code when the color input changes
    colorInput.addEventListener('input', function () {
        colorCode.textContent = colorInput.value;
    });

    // Copy color code to clipboard
    copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(colorCode.textContent)
            .then(() => {
                alert('Color code copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy color code: ', err);
            });
    });
});
