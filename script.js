```javascript
const dateInput =
    document.getElementById("date");

const searchInput =
    document.getElementById("search");


// ========================================
// LOAD SAVED STUDENT DATA
// ========================================

let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || {};


// ========================================
// LOAD SAVED ATTENDANCE
// ========================================

let attendance =
    JSON.parse(
        localStorage.getItem("attendance")
    ) || {};


// ========================================
// TODAY'S DATE
// ========================================

const today =
    new Date()
        .toISOString()
        .split("T")[0];

dateInput.value = today;


// ========================================
// PERIODS
// ========================================

const periods = [
    "P1",
    "P2",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7"
];


// ========================================
// SAVE DATA TO BROWSER
// ========================================

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


// ========================================
// ADD STUDENT
// ========================================

function addStudent() {

    const roll =
        document
            .getElementById("roll")
            .value
            .trim();

    const name =
        document
            .getElementById("studentName")
            .value
            .trim();

    const studentClass =
        document
            .getElementById("studentClass")
            .value
            .trim();


    if (
        roll === "" ||
        name === "" ||
        studentClass === ""
    ) {

        alert(
            "Please enter Roll Number, Student Name and Class."
        );

        return;
    }


    if (students[roll]) {

        alert(
            "This roll number already exists."
        );

        return;
    }


    // CREATE STUDENT

    students[roll] = {

        roll: roll,

        name: name,

        className: studentClass

    };


    // SAVE IMMEDIATELY

    saveData();


    // CLEAR FORM

    document.getElementById("roll").value = "";

    document.getElementById("studentName").value = "";

    document.getElementById("studentClass").value = "";


    displayStudents();


    alert(
        "Student added and saved successfully!"
    );
}


// ========================================
// GET ATTENDANCE STATUS
// ========================================

function getStatus(
    roll,
    period
) {

    const date =
        dateInput.value;


    if (!attendance[date]) {
        return "";
    }


    if (!attendance[date][roll]) {
        return "";
    }


    return (
        attendance[date][roll][period]
        || ""
    );
}


// ========================================
// SET ATTENDANCE
// ========================================

function setAttendance(
    roll,
    period,
    status
) {

    const date =
        dateInput.value;


    if (!attendance[date]) {

        attendance[date] = {};

    }


    if (!attendance[date][roll]) {

        attendance[date][roll] = {};

    }


    attendance[date][roll][period] =
        status;


    // SAVE ATTENDANCE

    saveData();


    displayStudents();
}


// ========================================
// DISPLAY STUDENTS
// ========================================

function displayStudents() {

    const table =
        document.getElementById(
            "tableBody"
        );


    table.innerHTML = "";


    const search =
        searchInput.value
            .toLowerCase();


    const studentList =
        Object.values(students)
            .filter(student =>

                student.name
                    .toLowerCase()
                    .includes(search)

                ||

                student.roll
                    .toLowerCase()
                    .includes(search)

                ||

                student.className
                    .toLowerCase()
                    .includes(search)

            );


    if (
        studentList.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="11">
                    No students found.
                </td>
            </tr>
        `;

        updateStats();

        return;
    }


    studentList.forEach(
        student => {

            let row = `

                <tr>

                    <td>
                        ${student.roll}
                    </td>

                    <td>
                        ${student.name}
                    </td>

                    <td>
                        ${student.className}
                    </td>

            `;


            // ==============================
            // 7 PERIODS
            // ==============================

            periods.forEach(
                period => {

                    const status =
                        getStatus(
                            student.roll,
                            period
                        );


                    row += `

                        <td>

                            <div
                                class="attendance-buttons"
                            >

                                <button
                                    class="
                                        present-btn
                                        ${
                                            status ===
                                            "Present"
                                            ? "selected"
                                            : ""
                                        }
                                    "

                                    onclick="
                                        setAttendance(
                                            '${student.roll}',
                                            '${period}',
                                            'Present'
                                        )
                                    "
                                >
                                    P
                                </button>


                                <button
                                    class="
                                        absent-btn
                                        ${
                                            status ===
                                            "Absent"
                                            ? "selected"
                                            : ""
                                        }
                                    "

                                    onclick="
                                        setAttendance(
                                            '${student.roll}',
                                            '${period}',
                                            'Absent'
                                        )
                                    "
                                >
                                    A
                                </button>

                            </div>

                        </td>

                    `;
                }
            );


            // ==============================
            // ACTION BUTTONS
            // ==============================

            row += `

                    <td>

                        <button
                            class="edit-btn"
                            onclick="
                                editStudent(
                                    '${student.roll}'
                                )
                            "
                        >
                            Edit
                        </button>


                        <button
                            class="delete-btn"
                            onclick="
                                deleteStudent(
                                    '${student.roll}'
                                )
                            "
                        >
                            Delete
                        </button>

                    </td>

                </tr>
            `;


            table.innerHTML += row;

        }
    );


    updateStats();
}


// ========================================
// EDIT STUDENT
// ========================================

function editStudent(roll) {

    const student =
        students[roll];


    if (!student) {
        return;
    }


    const newName =
        prompt(
            "Enter student name:",
            student.name
        );


    if (
        newName === null ||
        newName.trim() === ""
    ) {

        return;

    }


    const newClass =
        prompt(
            "Enter class:",
            student.className
        );


    if (
        newClass === null ||
        newClass.trim() === ""
    ) {

        return;

    }


    students[roll].name =
        newName.trim();


    students[roll].className =
        newClass.trim();


    saveData();

    displayStudents();
}


// ========================================
// DELETE STUDENT
// ========================================

function deleteStudent(roll) {

    const student =
        students[roll];


    if (!student) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmDelete) {
        return;
    }


    delete students[roll];


    // Delete attendance

    Object.keys(
        attendance
    ).forEach(
        date => {

            if (
                attendance[date]
            ) {

                delete attendance[date][roll];

            }

        }
    );


    saveData();

    displayStudents();
}


// ========================================
// STATISTICS
// ========================================

function updateStats() {

    let present = 0;

    let absent = 0;


    Object.values(
        students
    ).forEach(
        student => {

            periods.forEach(
                period => {

                    const status =
                        getStatus(
                            student.roll,
                            period
                        );


                    if (
                        status === "Present"
                    ) {

                        present++;

                    }


                    if (
                        status === "Absent"
                    ) {

                        absent++;

                    }

                }
            );

        }
    );


    const total =
        Object.keys(students).length
        * 7;


    const percentage =
        total > 0

            ? (
                present /
                total *
                100
              ).toFixed(1)

            : 0;


    document.getElementById(
        "studentCount"
    ).textContent =
        Object.keys(students).length;


    document.getElementById(
        "presentCount"
    ).textContent =
        present;


    document.getElementById(
        "absentCount"
    ).textContent =
        absent;


    document.getElementById(
        "percentage"
    ).textContent =
        percentage + "%";
}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    displayStudents
);


// ========================================
// DATE CHANGE
// ========================================

dateInput.addEventListener(
    "change",
    displayStudents
);


// ========================================
// SAVE STUDENT DATA TO JSON FILE
// ========================================

function downloadStudentData() {

    const data = JSON.stringify(
        students,
        null,
        4
    );


    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        "student-data.json";


    link.click();


    URL.revokeObjectURL(url);
}


// ========================================
// RESTORE STUDENT DATA
// ========================================

function restoreStudentData(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            try {

                const data =
                    JSON.parse(
                        e.target.result
                    );


                students = data;


                saveData();


                displayStudents();


                alert(
                    "Student data restored successfully!"
                );

            }

            catch(error) {

                alert(
                    "Invalid student data file."
                );

            }

        };


    reader.readAsText(file);
}


// ========================================
// EXPORT ATTENDANCE CSV
// ========================================

function exportCSV() {

    const date =
        dateInput.value;


    let csv =
        "Roll,Student Name,Class,Date," +
        "P1,P2,P3,P4,P5,P6,P7\n";


    Object.values(
        students
    ).forEach(
        student => {

            let row = [

                student.roll,

                student.name,

                student.className,

                date

            ];


            periods.forEach(
                period => {

                    row.push(
                        getStatus(
                            student.roll,
                            period
                        ) || "-"
                    );

                }
            );


            csv +=
                row
                    .map(
                        value =>
                            `"${value}"`
                    )
                    .join(",")
                + "\n";

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


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


// ========================================
// START WEBSITE
// ========================================

displayStudents();
```

