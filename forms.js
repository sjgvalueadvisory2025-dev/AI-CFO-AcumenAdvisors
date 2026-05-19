/* ============================================================
   Acumen Advisors — Acumen CFO form interactions
   - Real OTP via /api/send-otp (Resend)
   - Real submission via /api/submit (Resend with attachments)
   ============================================================ */

// ───── MOBILE NAV TOGGLE (runs on every page that includes forms.js) ─────
(function () {
  const btn   = document.querySelector('.nav-toggle');
  const links = document.getElementById('primary-nav');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

(function () {
  // ───── Elements ─────
  const form        = document.getElementById('cfo-form');
  if (!form) return;

  const service     = form.getAttribute('data-service') || 'unknown';

  const emailInput  = document.getElementById('email');
  const sendBtn     = document.getElementById('verify-btn');
  const otpBox      = document.getElementById('otp-box');
  const otpInput    = document.getElementById('otp-input');
  const otpHint     = document.getElementById('otp-hint');
  const otpSuccess  = document.getElementById('otp-success');
  const emailError  = document.getElementById('email-error');

  const dz          = document.getElementById('dropzone');
  const fileInput   = document.getElementById('files');
  const fileList    = document.getElementById('file-list');

  const modal       = document.getElementById('modal');
  const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
  const submitBtn   = document.getElementById('submit-btn');
  const formError   = document.getElementById('form-error');

  // ───── State ─────
  const uploadedFiles = [];
  let otpToken   = null;
  let otpExpires = 0;
  let otpEmail   = '';   // the email the OTP was sent to
  let otpEntered = '';   // the 6-digit code the user typed
  let otpVerifiedClient = false;  // soft client-side verification gate (UI only)

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  // ───── EMAIL OTP ─────
  if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
      const v = (emailInput.value || '').trim();
      if (!isValidEmail(v)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.add('is-on');
        return;
      }
      emailError.classList.remove('is-on');

      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending…';
      try {
        const r = await fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: v, service }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data.ok) {
          throw new Error(data.error || 'Failed to send verification email.');
        }
        otpToken   = data.token;
        otpExpires = data.expires;
        otpEmail   = v.toLowerCase();
        otpEntered = '';
        otpVerifiedClient = false;

        otpBox.classList.add('is-open');
        otpInput.value = '';
        otpInput.disabled = false;
        otpInput.focus();
        otpHint.innerHTML = `A 6-digit code was sent to <strong style="color:var(--ink)">${v}</strong>. It expires in 10 minutes.`;
        sendBtn.textContent = 'Resend code';
        sendBtn.classList.remove('is-verified');
        otpSuccess.classList.remove('is-on');
      } catch (err) {
        emailError.textContent = err.message || 'Could not send verification email.';
        emailError.classList.add('is-on');
        sendBtn.textContent = 'Send code';
      } finally {
        sendBtn.disabled = false;
      }
    });
  }

  if (otpInput) {
    otpInput.addEventListener('input', () => {
      const v = otpInput.value.replace(/\D/g, '').slice(0, 6);
      otpInput.value = v;
      otpEntered = v;
      if (v.length === 6) {
        // Soft client-side gate. The server is the source of truth at submit time.
        otpVerifiedClient = true;
        otpSuccess.classList.add('is-on');
        otpSuccess.textContent = '✓  Code entered';
        sendBtn.classList.add('is-verified');
        sendBtn.textContent = 'Code entered';
        otpHint.innerHTML = `<strong style="color:var(--ok)">Looks good.</strong> Submit to verify and deliver.`;
      } else {
        otpVerifiedClient = false;
        otpSuccess.classList.remove('is-on');
        sendBtn.classList.remove('is-verified');
        sendBtn.textContent = otpToken ? 'Resend code' : 'Send code';
      }
    });
  }

  // ───── FILE UPLOAD ─────
  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(1) + ' MB';
  }

  function renderFiles() {
    fileList.innerHTML = '';
    uploadedFiles.forEach((f, i) => {
      const row = document.createElement('div');
      row.className = 'file-item';
      row.innerHTML = `
        <span class="fname"></span>
        <span style="display:flex;align-items:center;gap:14px;">
          <span class="fsize">${fmtBytes(f.size)}</span>
          <button type="button" data-i="${i}" aria-label="Remove">×</button>
        </span>
      `;
      row.querySelector('.fname').textContent = f.name;
      fileList.appendChild(row);
    });
    fileList.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        const i = parseInt(b.getAttribute('data-i'));
        uploadedFiles.splice(i, 1);
        renderFiles();
      });
    });
  }

  function addFiles(list) {
    Array.from(list).forEach(f => uploadedFiles.push(f));
    if (uploadedFiles.length > 10) uploadedFiles.length = 10;
    renderFiles();
  }

  if (dz && fileInput) {
    dz.addEventListener('click', () => fileInput.click());
    dz.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', (e) => addFiles(e.target.files));
    ['dragenter', 'dragover'].forEach(ev => {
      dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); });
    });
    ['dragleave', 'drop'].forEach(ev => {
      dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); });
    });
    dz.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));
  }

  // ───── MODAL ─────
  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  modalCloseBtns.forEach(b => b.addEventListener('click', closeModal));
  if (modal) {
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });

  // ───── SUBMIT ─────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const required = ['company', 'founder', 'description', 'website', 'email'];
    const missing = [];
    required.forEach(id => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) missing.push(id);
    });
    const consent = document.getElementById('consent');
    if (!consent.checked) missing.push('consent');

    if (missing.length) {
      formError.textContent = 'Please complete all required fields before submitting.';
      formError.classList.add('is-on');
      return;
    }

    const enteredEmail = (emailInput.value || '').trim().toLowerCase();
    if (!otpToken || !otpExpires || enteredEmail !== otpEmail) {
      formError.textContent = 'Please verify your email address before submitting.';
      formError.classList.add('is-on');
      return;
    }
    if (Date.now() > otpExpires) {
      formError.textContent = 'Your verification code expired. Please request a new one.';
      formError.classList.add('is-on');
      return;
    }
    if (!otpVerifiedClient || !/^\d{6}$/.test(otpEntered)) {
      formError.textContent = 'Please enter the 6-digit verification code.';
      formError.classList.add('is-on');
      return;
    }

    formError.classList.remove('is-on');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    // Build multipart form data
    const fd = new FormData();
    fd.append('service', service);
    fd.append('company',     document.getElementById('company').value.trim());
    fd.append('founder',     document.getElementById('founder').value.trim());
    fd.append('website',     document.getElementById('website').value.trim());
    fd.append('description', document.getElementById('description').value.trim());
    fd.append('email',       enteredEmail);
    fd.append('otp',         otpEntered);
    fd.append('otpToken',    otpToken);
    fd.append('otpExpires',  String(otpExpires));
    fd.append('consent',     'true');
    uploadedFiles.forEach((f) => fd.append('files', f, f.name));

    try {
      const r = await fetch('/api/submit', { method: 'POST', body: fd });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        throw new Error(data.error || 'Submission failed. Please try again.');
      }

      // Populate confirmation modal
      const compNode  = document.getElementById('m-company');
      const emailNode = document.getElementById('m-email');
      if (compNode)  compNode.textContent  = data.company || document.getElementById('company').value.trim();
      if (emailNode) emailNode.textContent = data.email || enteredEmail;
      openModal();
    } catch (err) {
      formError.textContent = err.message || 'Submission failed. Please try again.';
      formError.classList.add('is-on');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.getAttribute('data-label') || 'Submit request';
    }
  });
})();
