// script.js
const PATIENTS_KEY = 'lab_patients';
const STAFF_KEY = 'lab_staff';
const TESTS_KEY = 'lab_tests';
const RESULTS_KEY = 'lab_results';

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// تحديث الإحصائيات (آمنة لعدم وجود العناصر)
function updateStats() {
  const patientStat = document.getElementById('patientStat');
  const testStat = document.getElementById('testStat');
  const staffStat = document.getElementById('staffStat');
  const resultStat = document.getElementById('resultStat');
  if (patientStat) patientStat.textContent = getData(PATIENTS_KEY).length;
  if (testStat) testStat.textContent = getData(TESTS_KEY).length;
  if (staffStat) staffStat.textContent = getData(STAFF_KEY).length;
  if (resultStat) resultStat.textContent = getData(RESULTS_KEY).length;
}

// قائمة الجوال
function setupMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('active'));
    });
  }
}

// عرض رسالة نجاح مؤقتة
function showMsg(elementId, text) {
  const el = document.getElementById(elementId);
  if (el) {
    el.style.display = 'block';
    el.innerHTML = `<i class="fas fa-check-circle"></i> ${text}`;
    setTimeout(() => { el.style.display = 'none'; }, 2500);
  }
}

// ========== المرضى ==========
function addPatient() {
  const name = document.getElementById('patientName').value.trim();
  const age = document.getElementById('patientAge').value;
  const gender = document.getElementById('patientGender').value;
  const phone = document.getElementById('patientPhone').value.trim();
  const address = document.getElementById('patientAddress').value.trim();

  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  let valid = true;
  if (!name) { document.getElementById('nameError').textContent = 'الرجاء إدخال اسم المريض'; valid = false; }
  if (!age || age <= 0) { document.getElementById('ageError').textContent = 'الرجاء إدخال عمر صحيح'; valid = false; }
  if (!gender) { document.getElementById('genderError').textContent = 'الرجاء اختيار الجنس'; valid = false; }
  if (!phone) { document.getElementById('phoneError').textContent = 'الرجاء إدخال رقم الهاتف'; valid = false; }
  if (!address) { document.getElementById('addressError').textContent = 'الرجاء إدخال العنوان'; valid = false; }
  if (!valid) return;

  const patients = getData(PATIENTS_KEY);
  patients.push({ id: Date.now(), name, age, gender, phone, address });
  setData(PATIENTS_KEY, patients);
  document.getElementById('patientForm').reset();
  showMsg('patientSuccessMsg', 'تم حفظ المريض بنجاح! جاري الانتقال إلى الموظفين...');
  updateStats();
  if (document.getElementById('patientsTableBody')) renderPatientsTable();
  // الانتقال التلقائي بعد 1.2 ثانية
  setTimeout(() => { window.location.href = 'staff.html'; }, 0);
}

function renderPatientsTable() {
  const tbody = document.getElementById('patientsTableBody');
  const noMsg = document.getElementById('noPatientsMsg');
  if (!tbody) return;
  const patients = getData(PATIENTS_KEY);
  if (patients.length === 0) {
    tbody.innerHTML = '';
    if (noMsg) noMsg.style.display = 'block';
    return;
  }
  if (noMsg) noMsg.style.display = 'none';
  tbody.innerHTML = patients.map(p => `
    <tr>
      <td>${p.name}</td><td>${p.age}</td><td>${p.gender}</td><td>${p.phone}</td><td>${p.address}</td>
      <td><button class="btn-delete" onclick="deletePatient(${p.id})"><i class="fas fa-trash"></i> حذف</button></td>
    </tr>`).join('');
}

function deletePatient(id) {
  if (confirm('هل أنت متأكد من حذف هذا المريض؟')) {
    setData(PATIENTS_KEY, getData(PATIENTS_KEY).filter(p => p.id !== id));
    renderPatientsTable();
    updateStats();
  }
}

// ========== الموظفين ==========
function addStaff() {
  const name = document.getElementById('staffName').value.trim();
  const specialty = document.getElementById('staffSpecialty').value.trim();
  const phone = document.getElementById('staffPhone').value.trim();
  const email = document.getElementById('staffEmail').value.trim();
  if (!name || !specialty || !phone || !email) {
    alert('الرجاء ملء جميع الحقول');
    return;
  }
  const staff = getData(STAFF_KEY);
  staff.push({ id: Date.now(), name, specialty, phone, email });
  setData(STAFF_KEY, staff);
  document.getElementById('staffForm').reset();
  showMsg('staffSuccessMsg', 'تمت إضافة الموظف بنجاح! جاري الانتقال إلى التحاليل...');
  updateStats();
  if (document.getElementById('staffTableBody')) renderStaffTable();
  setTimeout(() => { window.location.href = 'tests.html'; }, 0);
}

function renderStaffTable() {
  const tbody = document.getElementById('staffTableBody');
  const noMsg = document.getElementById('noStaffMsg');
  if (!tbody) return;
  const staff = getData(STAFF_KEY);
  if (staff.length === 0) {
    tbody.innerHTML = '';
    if (noMsg) noMsg.style.display = 'block';
    return;
  }
  if (noMsg) noMsg.style.display = 'none';
  tbody.innerHTML = staff.map(s => `
    <tr>
      <td>${s.name}</td><td>${s.specialty}</td><td>${s.phone}</td><td>${s.email}</td>
      <td><button class="btn-delete" onclick="deleteStaff(${s.id})"><i class="fas fa-trash"></i> حذف</button></td>
    </tr>`).join('');
}

function deleteStaff(id) {
  if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
    setData(STAFF_KEY, getData(STAFF_KEY).filter(s => s.id !== id));
    renderStaffTable();
    updateStats();
  }
}

// ========== التحاليل ==========
function addTest() {
  const name = document.getElementById('testName').value.trim();
  const min = parseFloat(document.getElementById('minValue').value);
  const max = parseFloat(document.getElementById('maxValue').value);
  if (!name || isNaN(min) || isNaN(max)) {
    alert('الرجاء ملء جميع الحقول بشكل صحيح');
    return;
  }
  if (min >= max) {
    alert('الحد الأدنى يجب أن يكون أقل من الحد الأقصى');
    return;
  }
  const tests = getData(TESTS_KEY);
  tests.push({ id: Date.now(), name, min, max });
  setData(TESTS_KEY, tests);
  document.getElementById('testForm').reset();
  showMsg('testSuccessMsg', 'تمت إضافة التحليل بنجاح! جاري الانتقال إلى النتائج...');
  updateStats();
  if (document.getElementById('testsTableBody')) renderTestsTable();
  setTimeout(() => { window.location.href = 'results.html'; }, 0);
}

function renderTestsTable() {
  const tbody = document.getElementById('testsTableBody');
  const noMsg = document.getElementById('noTestsMsg');
  if (!tbody) return;
  const tests = getData(TESTS_KEY);
  if (tests.length === 0) {
    tbody.innerHTML = '';
    if (noMsg) noMsg.style.display = 'block';
    return;
  }
  if (noMsg) noMsg.style.display = 'none';
  tbody.innerHTML = tests.map(t => `
    <tr>
      <td>${t.name}</td><td>${t.min}</td><td>${t.max}</td><td>${t.min} - ${t.max}</td>
      <td><button class="btn-delete" onclick="deleteTest(${t.id})"><i class="fas fa-trash"></i> حذف</button></td>
    </tr>`).join('');
}

function deleteTest(id) {
  if (confirm('هل أنت متأكد من حذف هذا التحليل؟')) {
    setData(TESTS_KEY, getData(TESTS_KEY).filter(t => t.id !== id));
    renderTestsTable();
    updateStats();
  }
}

// ========== النتائج ==========
function populateResultSelects() {
  const patientSelect = document.getElementById('resultPatient');
  const testSelect = document.getElementById('resultTest');
  if (!patientSelect || !testSelect) return;

  const patients = getData(PATIENTS_KEY);
  patientSelect.innerHTML = '<option value="">اختر المريض</option>' +
    patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

  const tests = getData(TESTS_KEY);
  testSelect.innerHTML = '<option value="">اختر التحليل</option>' +
    tests.map(t => `<option value="${t.id}">${t.name} (${t.min}-${t.max})</option>`).join('');
}

function addResult() {
  const patientId = document.getElementById('resultPatient').value;
  const testId = document.getElementById('resultTest').value;
  const value = parseFloat(document.getElementById('resultValue').value);
  if (!patientId || !testId || isNaN(value)) {
    alert('الرجاء اختيار المريض والتحليل وإدخال نتيجة صحيحة');
    return;
  }

  const patients = getData(PATIENTS_KEY);
  const tests = getData(TESTS_KEY);
  const patient = patients.find(p => p.id == patientId);
  const test = tests.find(t => t.id == testId);
  if (!patient || !test) return;

  let status = value >= test.min && value <= test.max ? 'normal' : (value > test.max ? 'high' : 'low');

  const results = getData(RESULTS_KEY);
  results.push({
    id: Date.now(),
    patientName: patient.name,
    testName: test.name,
    value,
    min: test.min,
    max: test.max,
    status
  });
  setData(RESULTS_KEY, results);
  document.getElementById('resultForm').reset();
  showMsg('resultSuccessMsg', 'تم حفظ النتيجة بنجاح! جاري العودة للرئيسية...');
  updateStats();
  if (document.getElementById('resultsTableBody')) renderResultsTable();
  // العودة للرئيسية بدلاً من التواصل
  setTimeout(() => { window.location.href = 'index.html'; }, 0);
}

function renderResultsTable() {
  const tbody = document.getElementById('resultsTableBody');
  const noMsg = document.getElementById('noResultsMsg');
  if (!tbody) return;
  const results = getData(RESULTS_KEY);
  if (results.length === 0) {
    tbody.innerHTML = '';
    if (noMsg) noMsg.style.display = 'block';
    return;
  }
  if (noMsg) noMsg.style.display = 'none';
  tbody.innerHTML = results.map(r => {
    let cls = r.status === 'normal' ? 'status-normal' : (r.status === 'high' ? 'status-high' : 'status-low');
    let txt = r.status === 'normal' ? 'Normal' : (r.status === 'high' ? 'High ↑' : 'Low ↓');
    return `<tr>
      <td>${r.patientName}</td><td>${r.testName}</td><td>${r.value}</td><td>${r.min} - ${r.max}</td>
      <td><span class="${cls}">${txt}</span></td>
      <td><button class="btn-delete" onclick="deleteResult(${r.id})"><i class="fas fa-trash"></i> حذف</button></td>
    </tr>`;
  }).join('');
}

function deleteResult(id) {
  if (confirm('هل أنت متأكد من حذف هذه النتيجة؟')) {
    setData(RESULTS_KEY, getData(RESULTS_KEY).filter(r => r.id !== id));
    renderResultsTable();
    updateStats();
  }
}

// ========== التواصل ==========
function sendContact() {
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  if (!name || !email || !message) {
    alert('الرجاء ملء جميع الحقول');
    return;
  }
  showMsg('contactSuccessMsg', 'شكراً لك، تم إرسال رسالتك بنجاح!');
  document.getElementById('contactForm').reset();
  // لا ننتقل تلقائياً من صفحة التواصل، يبقى المستخدم فيها
}

// تحميل البيانات الأولية
document.addEventListener('DOMContentLoaded', function() {
  setupMobileMenu();
  updateStats();
  // تحميل الجداول في الصفحات المناسبة
  if (document.getElementById('patientsTableBody')) renderPatientsTable();
  if (document.getElementById('staffTableBody')) renderStaffTable();
  if (document.getElementById('testsTableBody')) renderTestsTable();
  if (document.getElementById('resultPatient')) populateResultSelects();
  if (document.getElementById('resultsTableBody')) renderResultsTable();
});