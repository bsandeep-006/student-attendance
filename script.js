```javascript
// ==========================================
// STUDENT ATTENDANCE REGISTER
// ==========================================

const PERIODS = 7;


// ==========================================
// LOAD DATA
// ==========================================

let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];

let attendance =
    JSON.parse(
        localStorage.getItem("attendance")
    ) || {};


// ==========================================
// GET TODAY'S DATE
// ==========================================

function getToday() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==========================================
// SET DEFAULT DATE
// ==========================================

document.getElementById(
    "attendanceDate"
).value = getToday();


// ==========================================
// SAVE STUDENTS
// ==========================================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// ==========================================
// SAVE ATTENDANCE
// ==========================================

function saveAttendance() {

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );
}


// ==========================================
// GET SELECTED DATE
// ==========================================

function getSelectedDate() {

    return document.getElementById(
        "attendanceDate"
    ).value;
}


// ==========================================
// ADD STUDENT
// ==========================================

function addStudent() {

    const roll =
        document
            .getElementById("rollNumber")
            .value
            .trim();

    const name =
        document
            .getElementById("studentName")
            .value
            .trim();


    // Check empty fields

    if (!roll || !name) {

        alert(
            "Please enter Roll Number and Student Name."
        );

        return;
    }


    // Check duplicate roll number

    const exists =
        students.some(
            student =>
                student.roll.toLowerCase() ===
                roll.toLowerCase()
        );


    if (exists) {

        alert(
            "This Roll Number already exists."
        );

        return;
    }


    // Create student

    students.push({

        id: Date.now(),

        roll: roll,

        name: name

    });


    saveStudents();


    // Clear inputs

    document.getElementById(
        "rollNumber"
    ).value = "";

    document.getElementById(
        "studentName"
    ).value = "";


    renderAll();
}


// ==========================================
// CREATE ATTENDANCE RECORD
// ==========================================

function createRecord(
    studentId,
    date
) {

    if (!attendance[date]) {

        attendance[date] = {};
    }


    if (!attendance[date][studentId]) {

        attendance[date][studentId] =
            Array(PERIODS).fill(null);
    }


    return attendance[date][studentId];
}


// ==========================================
// TOGGLE ATTENDANCE
// ==========================================

function toggleAttendance(
    studentId,
    period
) {

    const date =
        getSelectedDate();


    const record =
        createRecord(
            studentId,
            date
        );


    const current =
        record[period];


    // Not marked → Present

    if (current === null) {

        record[period] = "P";

    }

    // Present → Absent

    else if (current === "P") {

        record[period] = "A";

    }

    // Absent → Not marked

    else {

        record[period] = null;
    }


    saveAttendance();

    renderAttendance();
}


// ==========================================
// GET ATTENDANCE BUTTON
// ==========================================

function getStatusButton(
    student,
    period
) {

    const date =
        getSelectedDate();


    const record =
        createRecord(
            student.id,
            date
        );


    const status =
        record[period];


    if (status === "P") {

        return `
            <button
                class="status-btn present"
                onclick="
                    toggleAttendance(
                        ${student.id},
                        ${period}
                    )
                "
            >
                ✓ Present
            </button>
        `;
    }


    if (status === "A") {

        return `
            <button
                class="status-btn absent"
                onclick="
                    toggleAttendance(
                        ${student.id},
                        ${period}
                    )
                "
            >
                ✕ Absent
            </button>
        `;
    }


    return `
        <button
            class="status-btn not-marked"
            onclick="
                toggleAttendance(
                    ${student.id},
                    ${period}
                )
            "
        >
            Mark
        </button>
    `;
}


// ==========================================
// RENDER ATTENDANCE TABLE
// ==========================================

function renderAttendance() {

    const table =
        document.getElementById(
            "attendanceTable"
        );


    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="empty"
                >
                    No students added yet.
                </td>
            </tr>
        `;

        updateSummary();

        return;
    }


    table.innerHTML =
        students.map(
            student => {

                let row = `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    student.roll
                                )}
                            </strong>
                        </td>

                        <td class="student-name">
                            ${escapeHTML(
                                student.name
                            )}
                        </td>
                `;


                // Seven periods

                for (
                    let period = 0;
                    period < PERIODS;
                    period++
                ) {

                    row += `
                        <td>
                            ${getStatusButton(
                                student,
                                period
                            )}
                        </td>
                    `;
                }


                row += `
                    </tr>
                `;


                return row;

            }
        ).join("");


    updateSummary();
}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    const date =
        getSelectedDate();


    let present = 0;

    let absent = 0;


    students.forEach(
        student => {

            const record =
                attendance[date]?.[
                    student.id
                ];


            if (!record) {
                return;
            }


            record.forEach(
                status => {

                    if (
                        status === "P"
                    ) {
                        present++;
                    }

                    if (
                        status === "A"
                    ) {
                        absent++;
                    }

                }
            );
        }
    );


    const totalMarked =
        present + absent;


    const percentage =
        totalMarked > 0
            ? (
                present /
                totalMarked *
                100
            ).toFixed(1)
            : 0;


    document.getElementById(
        "totalStudents"
    ).textContent =
        students.length;


    document.getElementById(
        "totalPresent"
    ).textContent =
        present;


    document.getElementById(
        "totalAbsent"
    ).textContent =
        absent;


    document.getElementById(
        "attendancePercentage"
    ).textContent =
        percentage + "%";
}


// ==========================================
// MARK ALL PRESENT
// ==========================================

function markAllPresent() {

    const date =
        getSelectedDate();


    if (!date) {

        alert(
            "Please select a date."
        );

        return;
    }


    if (students.length === 0) {

        alert(
            "Please add students first."
        );

        return;
    }


    if (
        !confirm(
            "Mark ALL students Present for all 7 periods?"
        )
    ) {
        return;
    }


    students.forEach(
        student => {

            if (!attendance[date]) {
                attendance[date] = {};
            }


            attendance[date][
                student.id
            ] =
                Array(PERIODS).fill("P");
        }
    );


    saveAttendance();

    renderAttendance();
}


// ==========================================
// MARK ALL ABSENT
// ==========================================

function markAllAbsent() {

    const date =
        getSelectedDate();


    if (!date) {

        alert(
            "Please select a date."
        );

        return;
    }


    if (students.length === 0) {

        alert(
            "Please add students first."
        );

        return;
    }


    if (
        !confirm(
            "Mark ALL students Absent for all 7 periods?"
        )
    ) {
        return;
    }


    students.forEach(
        student => {

            if (!attendance[date]) {
                attendance[date] = {};
            }


            attendance[date][
                student.id
            ] =
                Array(PERIODS).fill("A");
        }
    );


    saveAttendance();

    renderAttendance();
}


// ==========================================
// CLEAR ATTENDANCE
// ==========================================

function clearToday() {

    const date =
        getSelectedDate();


    if (!attendance[date]) {

        alert(
            "No attendance found for this date."
        );

        return;
    }


    if (
        !confirm(
            "Clear attendance for this date?"
        )
    ) {
        return;
    }


    delete attendance[date];


    saveAttendance();

    renderAttendance();
}


// ==========================================
// RENDER STUDENT LIST
// ==========================================

function renderStudents() {

    const list =
        document.getElementById(
            "studentList"
        );


    if (students.length === 0) {

        list.innerHTML = `
            <div class="empty">
                No students added.
            </div>
        `;

        return;
    }


    list.innerHTML =
        students.map(
            student => {

                return `

                    <div class="student-item">

                        <div class="student-info">

                            <span class="roll">
                                ${escapeHTML(
                                    student.roll
                                )}
                            </span>

                            <strong>
                                ${escapeHTML(
                                    student.name
                                )}
                            </strong>

                        </div>


                        <button
                            class="danger"
                            onclick="
                                deleteStudent(
                                    ${student.id}
                                )
                            "
                        >
                            Delete
                        </button>

                    </div>

                `;

            }
        ).join("");
}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(id) {

    const student =
        students.find(
            s => s.id === id
        );


    if (!student) {
        return;
    }


    if (
        !confirm(
            `Delete ${student.name}?`
        )
    ) {
        return;
    }


    // Remove student

    students =
        students.filter(
            s => s.id !== id
        );


    // Remove attendance

    Object.keys(
        attendance
    ).forEach(
        date => {

            if (attendance[date]) {

                delete attendance[
                    date
                ][id];
            }
        }
    );


    saveStudents();

    saveAttendance();

    renderAll();
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ==========================================
// RENDER EVERYTHING
// ==========================================

function renderAll() {

    renderAttendance();

    renderStudents();

    updateSummary();
}


// ==========================================
// START APPLICATION
// ==========================================

renderAll();
```

