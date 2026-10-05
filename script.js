```javascript
// =====================================================
// STUDENT ATTENDANCE REGISTER
// =====================================================


// =====================================================
// ROLL NUMBERS
// =====================================================

const ROLL_NUMBERS = [

    "24G01A4301",
    "24G01A4302",
    "24G01A4303",
    "24G01A4304",
    "24G01A4305",
    "24G01A4306",
    "24G01A4307",
    "24G01A4308",
    "24G01A4309",

    "24G01A4310",
    "24G01A4311",
    "24G01A4312",
    "24G01A4313",
    "24G01A4314",
    "24G01A4315",
    "24G01A4316",
    "24G01A4317",
    "24G01A4318",
    "24G01A4319",

    "24G01A4320",
    "24G01A4321",
    "24G01A4322",
    "24G01A4323",
    "24G01A4324",
    "24G01A4325",
    "24G01A4326",
    "24G01A4327",
    "24G01A4328",
    "24G01A4329",

    "24G01A4330",
    "24G01A4331",
    "24G01A4332",
    "24G01A4333",
    "24G01A4334",
    "24G01A4335",
    "24G01A4336",
    "24G01A4337",
    "24G01A4338",
    "24G01A4339",

    "24G01A4340",
    "24G01A4341",
    "24G01A4342",
    "24G01A4343",
    "24G01A4344",
    "24G01A4345",
    "24G01A4346",
    "24G01A4347",
    "24G01A4348",
    "24G01A4349",

    "24G01A4350",
    "24G01A4351",
    "24G01A4352",
    "24G01A4353",
    "24G01A4354",
    "24G01A4355",
    "24G01A4356",
    "24G01A4357",
    "24G01A4358",
    "24G01A4359",

    "24G01A4360",
    "24G01A4361",
    "24G01A4362",
    "24G01A4363",
    "24G01A4364",
    "24G01A4365",
    "24G01A4366",
    "24G01A4367",
    "24G01A4368",
    "24G01A4369",

    "24G01A4370",
    "24G01A4371",
    "24G01A4372",
    "24G01A4373",
    "24G01A4374",
    "24G01A4375",
    "24G01A4376",
    "24G01A4377",
    "24G01A4378",
    "24G01A4379",

    "24G01A4380",
    "24G01A4381",
    "24G01A4382",
    "24G01A4383",
    "24G01A4384",
    "24G01A4385",
    "24G01A4386",
    "24G01A4387",
    "24G01A4388",
    "24G01A4389",

    "24G01A4390",
    "24G01A4391",
    "24G01A4392",
    "24G01A4393",
    "24G01A4394",
    "24G01A4395",
    "24G01A4396",
    "24G01A4397",
    "24G01A4398",
    "24G01A4399",

    "25G05A4301",
    "25G05A4302",
    "25G05A4303",
    "25G05A4304",
    "25G05A4305",
    "25G05A4306"
];


// =====================================================
// DATA
// =====================================================

let students =
    JSON.parse(
        localStorage.getItem("attendanceStudents")
    ) || [];

let attendance =
    JSON.parse(
        localStorage.getItem("attendanceRecords")
    ) || {};


// =====================================================
// INITIALIZE STUDENTS
// =====================================================

function initializeStudents() {

    let changed = false;

    ROLL_NUMBERS.forEach(roll => {

        const exists = students.some(
            student => student.roll === roll
        );

        if (!exists) {

            students.push({
                roll: roll,
                name: ""
            });

            changed = true;
        }
    });

    if (changed) {
        saveStudents();
    }
}


// =====================================================
// SAVE STUDENTS
// =====================================================

function saveStudents() {

    localStorage.setItem(
        "attendanceStudents",
        JSON.stringify(students)
    );
}


// =====================================================
// SAVE ATTENDANCE TO BROWSER
// =====================================================

function saveAttendanceData() {

    try {

        localStorage.setItem(
            "attendanceRecords",
            JSON.stringify(attendance)
        );

        return true;

    } catch (error) {

        console.error(
            "Could not save attendance:",
            error
        );

        alert(
            "Unable to save data in this browser."
        );

        return false;
    }
}


// =====================================================
// TODAY
// =====================================================

function getToday() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(now.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeStudents();

        const dateInput =
            document.getElementById(
                "attendanceDate"
            );

        if (dateInput) {
            dateInput.value = getToday();
        }

        updateStudentDropdown();

        loadAttendance();

        displayStudentSummary();
    }
);


// =====================================================
// STUDENT DROPDOWN
// =====================================================

function updateStudentDropdown() {

    const select =
        document.getElementById(
            "studentEditSelect"
        );

    if (!select) return;

    select.innerHTML = `
        <option value="">
            Select Roll Number
        </option>
    `;

    students.forEach(student => {

        const option =
            document.createElement("option");

        option.value =
            student.roll;

        option.textContent =
            student.name
                ? `${student.roll} - ${student.name}`
                : `${student.roll} - Name not added`;

        select.appendChild(option);
    });
}


// =====================================================
// STUDENT NAME SELECT
// =====================================================

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target.id !==
            "studentEditSelect"
        ) {
            return;
        }

        const roll =
            event.target.value;

        const student =
            students.find(
                item => item.roll === roll
            );

        const input =
            document.getElementById(
                "editStudentName"
            );

        if (input) {

            input.value =
                student?.name || "";
        }
    }
);


// =====================================================
// SAVE STUDENT NAME
// =====================================================

function saveStudentName() {

    const select =
        document.getElementById(
            "studentEditSelect"
        );

    const input =
        document.getElementById(
            "editStudentName"
        );

    const roll =
        select.value;

    const name =
        input.value.trim();

    if (!roll) {

        alert(
            "Please select a roll number."
        );

        return;
    }

    if (!name) {

        alert(
            "Please enter the student name."
        );

        return;
    }

    const student =
        students.find(
            item => item.roll === roll
        );

    if (!student) {

        alert(
            "Student not found."
        );

        return;
    }

    student.name = name;

    saveStudents();

    updateStudentDropdown();

    select.value = roll;

    input.value = name;

    loadAttendance();

    displayStudentSummary();

    alert(
        `${roll} - ${name} saved successfully!`
    );
}


// =====================================================
// RESET STUDENT NAMES
// =====================================================

function resetStudentNames() {

    if (
        !confirm(
            "Remove all saved student names?"
        )
    ) {
        return;
    }

    students.forEach(student => {

        student.name = "";

    });

    saveStudents();

    updateStudentDropdown();

    document.getElementById(
        "editStudentName"
    ).value = "";

    loadAttendance();

    displayStudentSummary();
}


// =====================================================
// GET SELECTED DATE
// =====================================================

function getSelectedDate() {

    const input =
        document.getElementById(
            "attendanceDate"
        );

    return input ? input.value : "";
}


// =====================================================
// GET SELECTED PERIOD
// =====================================================

function getSelectedPeriod() {

    const select =
        document.getElementById(
            "period"
        );

    return select ? select.value : "1";
}


// =====================================================
// GET ATTENDANCE KEY
// =====================================================

function getAttendanceKey() {

    return (
        getSelectedDate() +
        "_period_" +
        getSelectedPeriod()
    );
}


// =====================================================
// LOAD ATTENDANCE
// =====================================================

function loadAttendance() {

    const date =
        getSelectedDate();

    const period =
        getSelectedPeriod();

    if (!date || !period) {
        return;
    }

    const key =
        `${date}_period_${period}`;

    const saved =
        attendance[key] || {};

    const table =
        document.getElementById(
            "attendanceTable"
        );

    if (!table) {
        return;
    }

    table.innerHTML =
        students.map(
            (student, index) => {

                const status =
                    saved[student.roll] || "";

                return `

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

                            ${
                                student.name
                                    ? escapeHTML(
                                        student.name
                                      )
                                    : `
                                        <span class="no-name">
                                            Name not added
                                        </span>
                                      `
                            }

                        </td>

                        <td>

                            <button
                                type="button"
                                class="
                                    attendance-btn
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
                                        'Present'
                                    )
                                ">

                                ✓ Present

                            </button>

                        </td>

                        <td>

                            <button
                                type="button"
                                class="
                                    attendance-btn
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
                                        'Absent'
                                    )
                                ">

                                ✕ Absent

                            </button>

                        </td>

                    </tr>

                `;
            }
        ).join("");

    const currentInfo =
        document.getElementById(
            "currentInfo"
        );

    if (currentInfo) {

        currentInfo.textContent =
            `${formatDate(date)} • Period ${period}`;
    }

    updateCurrentSummary();
}


// =====================================================
// SELECT PRESENT / ABSENT
// =====================================================

function setAttendance(
    roll,
    status
) {

    const date =
        getSelectedDate();

    const period =
        getSelectedPeriod();

    if (!date) {

        alert(
            "Please select a date."
        );

        return;
    }

    if (!period) {

        alert(
            "Please select a period."
        );

        return;
    }

    const key =
        `${date}_period_${period}`;

    if (!attendance[key]) {

        attendance[key] = {};
    }

    attendance[key][roll] =
        status;

    // Refresh screen only.
    // Final saving is done by SAVE ATTENDANCE.
    loadAttendance();

    updateCurrentSummary();
}


// =====================================================
// SAVE ATTENDANCE BUTTON
// =====================================================

function saveAttendance() {

    const date =
        getSelectedDate();

    const period =
        getSelectedPeriod();

    if (!date) {

        alert(
            "Please select a date."
        );

        return;
    }

    if (!period) {

        alert(
            "Please select a period."
        );

        return;
    }

    const key =
        `${date}_period_${period}`;

    const records =
        attendance[key] || {};

    const markedStudents =
        students.filter(
            student =>
                records[student.roll] ===
                "Present" ||
                records[student.roll] ===
                "Absent"
        );

    if (markedStudents.length === 0) {

        alert(
            "Please mark Present or Absent for at least one student."
        );

        return;
    }

    const saved =
        saveAttendanceData();

    if (!saved) {
        return;
    }

    const present =
        markedStudents.filter(
            student =>
                records[student.roll] ===
                "Present"
        ).length;

    const absent =
        markedStudents.filter(
            student =>
                records[student.roll] ===
                "Absent"
        ).length;

    const notMarked =
        students.length -
        markedStudents.length;

    updateCurrentSummary();

    displayStudentSummary();

    alert(
        `✅ Attendance saved!\n\n` +
        `Date: ${formatDate(date)}\n` +
        `Period: ${period}\n\n` +
        `Present: ${present}\n` +
        `Absent: ${absent}\n` +
        `Not Marked: ${notMarked}`
    );
}


// =====================================================
// MARK ALL
// =====================================================

function markAll(status) {

    const date =
        getSelectedDate();

    const period =
        getSelectedPeriod();

    if (!date || !period) {

        alert(
            "Please select date and period."
        );

        return;
    }

    const key =
        `${date}_period_${period}`;

    if (!attendance[key]) {

        attendance[key] = {};
    }

    students.forEach(student => {

        attendance[key][student.roll] =
            status;
    });

    loadAttendance();

    updateCurrentSummary();
}


// =====================================================
// CLEAR CURRENT PERIOD
// =====================================================

function clearCurrentPeriod() {

    const key =
        getAttendanceKey();

    if (!attendance[key]) {

        alert(
            "No attendance found for this period."
        );

        return;
    }

    if (
        !confirm(
            "Clear attendance for this date and period?"
        )
    ) {
        return;
    }

    delete attendance[key];

    saveAttendanceData();

    loadAttendance();

    displayStudentSummary();
}


// =====================================================
// CURRENT SUMMARY
// =====================================================

function updateCurrentSummary() {

    const key =
        getAttendanceKey();

    const current =
        attendance[key] || {};

    let present = 0;

    let absent = 0;

    students.forEach(student => {

        if (
            current[student.roll] ===
            "Present"
        ) {

            present++;
        }

        if (
            current[student.roll] ===
            "Absent"
        ) {

            absent++;
        }
    });

    const notMarked =
        students.length -
        present -
        absent;

    const totalElement =
        document.getElementById(
            "totalStudents"
        );

    const presentElement =
        document.getElementById(
            "presentCount"
        );

    const absentElement =
        document.getElementById(
            "absentCount"
        );

    const notMarkedElement =
        document.getElementById(
            "notMarkedCount"
        );

    if (totalElement) {

        totalElement.textContent =
            students.length;
    }

    if (presentElement) {

        presentElement.textContent =
            present;
    }

    if (absentElement) {

        absentElement.textContent =
            absent;
    }

    if (notMarkedElement) {

        notMarkedElement.textContent =
            notMarked;
    }
}


// =====================================================
// STUDENT SUMMARY
// =====================================================

function displayStudentSummary() {

    const table =
        document.getElementById(
            "summaryTable"
        );

    if (!table) return;

    table.innerHTML =
        students.map(student => {

            let present = 0;

            let absent = 0;

            Object.values(
                attendance
            ).forEach(periodData => {

                const status =
                    periodData[
                        student.roll
                    ];

                if (
                    status ===
                    "Present"
                ) {

                    present++;
                }

                if (
                    status ===
                    "Absent"
                ) {

                    absent++;
                }
            });

            const total =
                present + absent;

            const percentage =
                total > 0
                    ? (
                        present /
                        total *
                        100
                      ).toFixed(1)
                    : "0.0";

            const percentageClass =
                Number(percentage) >= 75
                    ? "percentage-good"
                    : "percentage-bad";

            return `

                <tr>

                    <td>
                        ${escapeHTML(
                            student.roll
                        )}
                    </td>

                    <td>
                        ${
                            student.name
                                ? escapeHTML(
                                    student.name
                                  )
                                : "Name not added"
                        }
                    </td>

                    <td>
                        ${present}
                    </td>

                    <td>
                        ${absent}
                    </td>

                    <td>
                        ${total}
                    </td>

                    <td
                        class="${percentageClass}">

                        ${percentage}%

                    </td>

                </tr>

            `;

        }).join("");
}


// =====================================================
// EXPORT CSV
// =====================================================

function exportCSV() {

    let csv =
        "Date,Period,Roll Number,Student Name,Status\n";

    Object.keys(
        attendance
    ).forEach(key => {

        const parts =
            key.split("_period_");

        const date =
            parts[0];

        const period =
            parts[1];

        const records =
            attendance[key];

        Object.keys(
            records
        ).forEach(roll => {

            const student =
                students.find(
                    item =>
                        item.roll === roll
                );

            const name =
                student?.name || "";

            csv +=
                `"${date}",` +
                `"Period ${period}",` +
                `"${roll}",` +
                `"${name}",` +
                `"${records[roll]}"\n`;
        });
    });

    if (
        csv.trim() ===
        "Date,Period,Roll Number,Student Name,Status"
    ) {

        alert(
            "No attendance data available."
        );

        return;
    }

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
        "student-attendance.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


// =====================================================
// DELETE ALL ATTENDANCE
// =====================================================

function deleteAllAttendance() {

    if (
        !confirm(
            "Delete ALL attendance records? Student names will remain."
        )
    ) {
        return;
    }

    attendance = {};

    saveAttendanceData();

    loadAttendance();

    displayStudentSummary();

    alert(
        "All attendance records deleted."
    );
}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(date) {

    const parts =
        date.split("-");

    if (
        parts.length !== 3
    ) {

        return date;
    }

    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );
}


// =====================================================
// HTML SECURITY
// =====================================================

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
```

