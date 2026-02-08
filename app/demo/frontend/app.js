const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileinput');
const preview = document.getElementById('preview');
const resultDiv = document.getElementById('result');

uploadBtn.onclick = async () => {
  const file = fileInput.files[0];
  if (!file) return alert('Choose an image first');
  preview.innerHTML = '';
  const imgEl = document.createElement('img');
  imgEl.src = URL.createObjectURL(file);
  preview.appendChild(imgEl);

  const form = new FormData();
  form.append('file', file, file.name);
  resultDiv.innerText = 'Uploading...';
  try {
    const resp = await fetch('/api/v1/mock/predict', { method: 'POST', body: form });
    const data = await resp.json();
    resultDiv.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    resultDiv.innerText = 'Error: ' + err.message;
  }
}
