const dateInput = document.getElementById("date");
const searchInput = document.getElementById("search");

let students =
    JSON.parse(localStorage.getItem("students")) || [];

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || {};


// Today's date
const today = new Date().toISOString().split("T")[0];

dateInput.value = today;


// Seven periods
const periods = [
    "Period 1",
    "Period 2",
    "Period 3",
    "Period 4",
    "Period 5",
    "Period 6",
    "Period 7"
];


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


// Add student
function addStudent() {

    const roll =
        document.getElementById("rollNumber").value.trim();

    const name =
        document.getElementById("studentName").value.trim();


    if (roll === "" || name === "") {
        alert("Please enter roll number and student name.");
        return;
    }


    const exists = students.some(
        student => student.roll === roll
    );


    if (exists) {
        alert("This roll number already exists.");
        return;
    }


    students.push({
        id: Date.now(),
        roll: roll,
        name: name
    });


    saveData();

    document.getElementById("rollNumber").value = "";
    document.getElementById("studentName").value = "";

    displayStudents();
}


// Get attendance
function getStatus(studentId, period) {

    const date = dateInput.value;

    if (!attendance[date]) {
        return "Absent";
    }

    if (!attendance[date][studentId]) {
        return "Absent";
    }

    return attendance[date][studentId][period] || "Absent";
}


// Change attendance
function changeAttendance(
    studentId,
    period,
    status
) {

    const date = dateInput.value;


    if (!attendance[date]) {
        attendance[date] = {};
    }


    if (!attendance[date][studentId]) {
        attendance[date][studentId] = {};
    }


    attendance[date][studentId][period] = status;

    saveData();

    displayStudents();
}


// Display students
function displayStudents() {

    const table =
        document.getElementById("attendanceTable");

    table.innerHTML = "";


    const search =
        searchInput.value.toLowerCase();


    const filtered =
        students.filter(student =>
            student.name.toLowerCase().includes(search) ||
            student.roll.toLowerCase().includes(search)
        );


    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="10">
                    No students found
                </td>
            </tr>
        `;

        updateStatistics();

        return;
    }


    filtered.forEach(student => {

        const row =
            document.createElement("tr");


        let html = `
            <td>${student.roll}</td>
            <td>${student.name}</td>
        `;


        // Seven periods
        for (let i = 0; i < 7; i++) {

            const status =
                getStatus(student.id, i);


            if (status === "Present") {

                html += `
                    <td>
                        <button
                            class="attendance-btn present-btn"
                            onclick="changeAttendance(
                                ${student.id},
                                ${i},
                                'Absent'
                            )"
                        >
                            ✓ Present
                        </button>
                    </td>
                `;

            } else {

                html += `
                    <td>
                        <button
                            class="attendance-btn absent-btn"
                            onclick="changeAttendance(
                                ${student.id},
                                ${i},
                                'Present'
                            )"
                        >
                            ✕ Absent
                        </button>
                    </td>
                `;
            }
        }


        html += `
            <td>
                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>
            </td>
        `;


        row.innerHTML = html;

        table.appendChild(row);
    });


    updateStatistics();
}


// Delete student
function deleteStudent(id) {

    const student =
        students.find(s => s.id === id);


    if (!student) return;


    const confirmation =
        confirm(
            `Delete ${student.name} from the register?`
        );


    if (!confirmation) return;


    students =
        students.filter(
            student => student.id !== id
        );


    // Delete attendance data
    Object.keys(attendance).forEach(date => {

        if (attendance[date]) {
            delete attendance[date][id];
        }

    });


    saveData();

    displayStudents();
}


// Statistics
function updateStatistics() {

    let present = 0;
    let absent = 0;


    students.forEach(student => {

        for (let period = 0; period < 7; period++) {

            const status =
                getStatus(student.id, period);


            if (status === "Present") {
                present++;
            } else {
                absent++;
            }

        }

    });


    const total =
        students.length * 7;


    const percentage =
        total > 0
            ? ((present / total) * 100).toFixed(1)
            : 0;


    document.getElementById(
        "totalStudents"
    ).textContent = students.length;


    document.getElementById(
        "totalPresent"
    ).textContent = present;


    document.getElementById(
        "totalAbsent"
    ).textContent = absent;


    document.getElementById(
        "percentage"
    ).textContent = percentage + "%";
}


// Search
searchInput.addEventListener(
    "input",
    displayStudents
);


// Date change
dateInput.addEventListener(
    "change",
    displayStudents
);


// Export CSV
function exportCSV() {

    const date = dateInput.value;

    let csv =
        "Roll Number,Student Name,Date," +
        "Period 1,Period 2,Period 3," +
        "Period 4,Period 5,Period 6,Period 7\n";


    students.forEach(student => {

        let row = [
            student.roll,
            student.name,
            date
        ];


        for (let period = 0; period < 7; period++) {

            row.push(
                getStatus(student.id, period)
            );

        }


        csv +=
            row.map(value => `"${value}"`).join(",")
            + "\n";
    });


    const blob =
        new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        `attendance-${date}.csv`;


    link.click();


    URL.revokeObjectURL(url);
}


// Initial display
displayStudents();
