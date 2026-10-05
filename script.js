```javascript
// ======================================
// LOAD SAVED DATA
// ======================================

let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


let attendance =
    JSON.parse(
        localStorage.getItem("attendance")
    ) || [];


// ======================================
// TODAY DATE
// ======================================

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


document.getElementById(
    "attendanceDate"
).value = getToday();


// ======================================
// SAVE STUDENTS
// ======================================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// ======================================
// SAVE ATTENDANCE
// ======================================

function saveAttendance() {

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );
}


// ======================================
// ADD STUDENT
// ======================================

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
            "This roll number already exists."
        );

        return;
    }


    // Add student

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


    updateStudentDropdown();

    displayStudents();

    updateSummary();


    alert(
        "Student added successfully!"
    );
}


// ======================================
// STUDENT DROPDOWN
// ======================================

function updateStudentDropdown() {

    const select =
        document.getElementById(
            "studentSelect"
        );


    select.innerHTML = `

        <option value="">
            Select Student
        </option>

    `;


    students.forEach(
        student => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                student.id;


            option.textContent =
                `${student.roll} - ${student.name}`;


            select.appendChild(
                option
            );
        }
    );
}


// ======================================
// ADD ATTENDANCE
// ======================================

function addAttendance() {

    const studentId =
        Number(
            document.getElementById(
                "studentSelect"
            ).value
        );


    const date =
        document.getElementById(
            "attendanceDate"
        ).value;


    const period =
        document.getElementById(
            "period"
        ).value;


    const status =
        document.getElementById(
            "status"
        ).value;


    if (
        !studentId ||
        !date ||
        !period ||
        !status
    ) {

        alert(
            "Please select Student, Date, Period and Attendance."
        );

        return;
    }


    // Find student

    const student =
        students.find(
            item =>
                item.id === studentId
        );


    if (!student) {

        alert(
            "Student not found."
        );

        return;
    }


    // Check duplicate

    const duplicate =
        attendance.some(
            record =>

                record.studentId ===
                studentId &&

                record.date ===
                date &&

                record.period ===
                period
        );


    if (duplicate) {

        alert(
            "Attendance already exists for this student, date and period."
        );

        return;
    }


    // Create attendance

    attendance.push({

        id: Date.now(),

        studentId: studentId,

        roll: student.roll,

        name: student.name,

        date: date,

        period: period,

        status: status

    });


    saveAttendance();


    // Reset attendance fields

    document.getElementById(
        "period"
    ).value = "";


    document.getElementById(
        "status"
    ).value = "";


    displayAttendance();

    updateSummary();


    alert(
        "Attendance added successfully!"
    );
}


// ======================================
// DISPLAY STUDENTS
// ======================================

function displayStudents() {

    const table =
        document.getElementById(
            "studentTable"
        );


    if (students.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty">

                    No students added yet.

                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML =
        students.map(
            (student, index) => `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(
                                student.roll
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(
                            student.name
                        )}
                    </td>

                    <td>

                        <button
                            class="delete-button"
                            onclick="
                                deleteStudent(
                                    ${student.id}
                                )
                            ">

                            Delete

                        </button>

                    </td>

                </tr>

            `
        ).join("");
}


// ======================================
// DISPLAY ATTENDANCE
// ======================================

function displayAttendance() {

    const table =
        document.getElementById(
            "attendanceTable"
        );


    if (attendance.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty">

                    No attendance records yet.

                </td>

            </tr>

        `;

        return;
    }


    // Newest first

    const records =
        [...attendance].reverse();


    table.innerHTML =
        records.map(
            (record, index) => {

                const statusClass =
                    record.status ===
                    "Present"
                        ? "present"
                        : "absent";


                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${formatDate(
                                record.date
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                record.roll
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                record.name
                            )}
                        </td>

                        <td>
                            Period
                            ${record.period}
                        </td>

                        <td>

                            <span
                                class="${statusClass}">

                                ${
                                    record.status ===
                                    "Present"
                                    ? "✓ Present"
                                    : "✕ Absent"
                                }

                            </span>

                        </td>

                        <td>

                            <button
                                class="delete-button"
                                onclick="
                                    deleteAttendance(
                                        ${record.id}
                                    )
                                ">

                                Delete

                            </button>

                        </td>

                    </tr>

                `;
            }
        ).join("");
}


// ======================================
// DELETE STUDENT
// ======================================

function deleteStudent(id) {

    const student =
        students.find(
            item =>
                item.id === id
        );


    if (!student) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete ${student.name} and all attendance records?`
        );


    if (!confirmDelete) {
        return;
    }


    // Delete student

    students =
        students.filter(
            item =>
                item.id !== id
        );


    // Delete student's attendance

    attendance =
        attendance.filter(
            record =>
                record.studentId !== id
        );


    saveStudents();

    saveAttendance();


    updateStudentDropdown();

    displayStudents();

    displayAttendance();

    updateSummary();
}


// ======================================
// DELETE ATTENDANCE
// ======================================

function deleteAttendance(id) {

    if (
        !confirm(
            "Delete this attendance record?"
        )
    ) {
        return;
    }


    attendance =
        attendance.filter(
            record =>
                record.id !== id
        );


    saveAttendance();

    displayAttendance();

    updateSummary();
}


// ======================================
// SUMMARY
// ======================================

function updateSummary() {

    const totalStudents =
        students.length;


    const present =
        attendance.filter(
            record =>
                record.status ===
                "Present"
        ).length;


    const absent =
        attendance.filter(
            record =>
                record.status ===
                "Absent"
        ).length;


    const total =
        present + absent;


    const percentage =
        total > 0
            ? (
                present /
                total *
                100
            ).toFixed(1)
            : 0;


    document.getElementById(
        "totalStudents"
    ).textContent =
        totalStudents;


    document.getElementById(
        "totalPresent"
    ).textContent =
        present;


    document.getElementById(
        "totalAbsent"
    ).textContent =
        absent;


    document.getElementById(
        "percentage"
    ).textContent =
        percentage + "%";
}


// ======================================
// DELETE ALL DATA
// ======================================

function deleteAllData() {

    if (
        !confirm(
            "Delete ALL students and attendance data?"
        )
    ) {
        return;
    }


    students = [];

    attendance = [];


    saveStudents();

    saveAttendance();


    updateStudentDropdown();

    displayStudents();

    displayAttendance();

    updateSummary();


    alert(
        "All data deleted."
    );
}


// ======================================
// FORMAT DATE
// ======================================

function formatDate(date) {

    const parts =
        date.split("-");


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );
}


// ======================================
// ESCAPE HTML
// ======================================

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


// ======================================
// INITIAL LOAD
// ======================================

updateStudentDropdown();

displayStudents();

displayAttendance();

updateSummary();
```


