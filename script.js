const dateInput = document.getElementById("date");
const searchInput = document.getElementById("search");
const rollInput = document.getElementById("rollNumber");
const nameInput = document.getElementById("studentName");
const addBtn = document.getElementById("addBtn");
const studentTable = document.getElementById("studentTable");
const exportBtn = document.getElementById("exportBtn");

let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

// Set today's date
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;


// Add Student
addBtn.addEventListener("click", addStudent);

function addStudent() {

    const roll = rollInput.value.trim();
    const name = nameInput.value.trim();

    if (roll === "" || name === "") {
        alert("Please enter roll number and student name.");
        return;
    }

    const existingStudent = students.find(
        student => student.roll === roll
    );

    if (existingStudent) {
        alert("This roll number already exists.");
        return;
    }

    students.push({
        id: Date.now(),
        roll: roll,
        name: name
    });

    saveData();

    rollInput.value = "";
    nameInput.value = "";

    displayStudents();
}


// Display Students
function displayStudents() {

    const searchText = searchInput.value.toLowerCase();

    studentTable.innerHTML = "";

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText) ||
        student.roll.toLowerCase().includes(searchText)
    );

    if (filteredStudents.length === 0) {

        studentTable.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No students found
                </td>
            </tr>
        `;

        updateStatistics();
        return;
    }

    filteredStudents.forEach(student => {

        const status = getAttendance(student.id);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.roll}</td>

            <td>${student.name}</td>

            <td>
                ${
                    status === "Present"
                    ? `<button class="status-btn present-btn"
                        onclick="changeStatus(${student.id}, 'Absent')">
                        ✓ Present
                       </button>`
                    : `<button class="status-btn absent-btn"
                        onclick="changeStatus(${student.id}, 'Present')">
                        ✕ Absent
                       </button>`
                }
            </td>

            <td>
                <button class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

        studentTable.appendChild(row);
    });

    updateStatistics();
}


// Get attendance
function getAttendance(studentId) {

    const selectedDate = dateInput.value;

    if (!attendance[selectedDate]) {
        return "Absent";
    }

    return attendance[selectedDate][studentId] || "Absent";
}


// Change attendance status
function changeStatus(studentId, status) {

    const selectedDate = dateInput.value;

    if (!attendance[selectedDate]) {
        attendance[selectedDate] = {};
    }

    attendance[selectedDate][studentId] = status;

    saveData();
    displayStudents();
}


// Delete Student
function deleteStudent(id) {

    const student = students.find(student => student.id === id);

    if (!student) return;

    const confirmDelete = confirm(
        `Delete ${student.name} from the register?`
    );

    if (!confirmDelete) return;

    students = students.filter(student => student.id !== id);

    // Remove attendance records
    Object.keys(attendance).forEach(date => {

        if (attendance[date]) {
            delete attendance[date][id];
        }

    });

    saveData();
    displayStudents();
}


// Update statistics
function updateStatistics() {

    const total = students.length;

    let present = 0;

    students.forEach(student => {

        if (getAttendance(student.id) === "Present") {
            present++;
        }

    });

    const absent = total - present;

    const percentage = total > 0
        ? ((present / total) * 100).toFixed(1)
        : 0;

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("presentStudents").textContent = present;
    document.getElementById("absentStudents").textContent = absent;
    document.getElementById("attendancePercentage").textContent =
        percentage + "%";
}


// Save data
function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );
}


// Search
searchInput.addEventListener("input", displayStudents);


// Change date
dateInput.addEventListener("change", displayStudents);


// Export CSV
exportBtn.addEventListener("click", exportCSV);

function exportCSV() {

    const selectedDate = dateInput.value;

    let csv = "Roll Number,Student Name,Date,Status\n";

    students.forEach(student => {

        const status = getAttendance(student.id);

        csv += `"${student.roll}","${student.name}","${selectedDate}","${status}"\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `attendance-${selectedDate}.csv`;

    link.click();

    URL.revokeObjectURL(url);
}


// Initial display
displayStudents();
