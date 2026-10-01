const dateInput = document.getElementById("date");
const searchInput = document.getElementById("search");

let students =
    JSON.parse(localStorage.getItem("students")) || {};

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || {};


// Today's date
const today = new Date().toISOString().split("T")[0];

dateInput.value = today;


// 7 periods
const periods = [
    "P1",
    "P2",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7"
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
        document.getElementById("roll").value.trim();

    const name =
        document.getElementById("name").value.trim();


    if (roll === "" || name === "") {
        alert("Please enter roll number and student name.");
        return;
    }


    if (students[roll]) {
        alert("Roll number already exists.");
        return;
    }


    students[roll] = {
        roll: roll,
        name: name
    };


    saveData();

    document.getElementById("roll").value = "";
    document.getElementById("name").value = "";

    displayStudents();
}


// Get attendance
function getStatus(roll, period) {

    const date = dateInput.value;

    if (!attendance[date]) {
        return "";
    }

    if (!attendance[date][roll]) {
        return "";
    }

    return attendance[date][roll][period] || "";
}


// Set attendance
function setAttendance(
    roll,
    period,
    status
) {

    const date = dateInput.value;


    if (!attendance[date]) {
        attendance[date] = {};
    }


    if (!attendance[date][roll]) {
        attendance[date][roll] = {};
    }


    attendance[date][roll][period] = status;

    saveData();

    displayStudents();
}


// Display students
function displayStudents() {

    const table =
        document.getElementById("tableBody");

    table.innerHTML = "";


    const search =
        searchInput.value.toLowerCase();


    const studentList =
        Object.values(students).filter(student =>

            student.name
                .toLowerCase()
                .includes(search)

            ||

            student.roll
                .toLowerCase()
                .includes(search)
        );


    if (studentList.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="10">
                    No students found
                </td>
            </tr>
        `;

        updateStats();

        return;
    }


    studentList.forEach(student => {

        let row = `
            <tr>

                <td>
                    ${student.roll}
                </td>

                <td>
                    ${student.name}
                </td>
        `;


        // Create 7 periods
        periods.forEach(period => {

            const status =
                getStatus(
                    student.roll,
                    period
                );


            row += `
                <td>

                    <div class="attendance-buttons">

                        <button
                            class="present-btn
                            ${status === "Present" ? "selected" : ""}"
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
                            class="absent-btn
                            ${status === "Absent" ? "selected" : ""}"
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
        });


        row += `

                <td>

                    <button
                        class="delete-btn"
                        onclick="
                            deleteStudent('${student.roll}')
                        "
                    >
                        Delete
                    </button>

                </td>

            </tr>
        `;


        table.innerHTML += row;
    });


    updateStats();
}


// Delete student
function deleteStudent(roll) {

    const student = students[roll];

    if (!student) return;


    const confirmDelete =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmDelete) {
        return;
    }


    delete students[roll];


    // Delete attendance
    Object.keys(attendance).forEach(date => {

        if (attendance[date]) {
            delete attendance[date][roll];
        }

    });


    saveData();

    displayStudents();
}


// Statistics
function updateStats() {

    let present = 0;
    let absent = 0;


    Object.values(students).forEach(student => {

        periods.forEach(period => {

            const status =
                getStatus(
                    student.roll,
                    period
                );


            if (status === "Present") {
                present++;
            }

            if (status === "Absent") {
                absent++;
            }

        });

    });


    const total =
        Object.keys(students).length * 7;


    const percentage =
        total > 0
            ? ((present / total) * 100).toFixed(1)
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


// Search
searchInput.addEventListener(
    "input",
    displayStudents
);


// Change date
dateInput.addEventListener(
    "change",
    displayStudents
);


// Export CSV
function exportCSV() {

    const date = dateInput.value;

    let csv =
        "Roll Number,Student Name,Date," +
        "P1,P2,P3,P4,P5,P6,P7\n";


    Object.values(students).forEach(student => {

        let row = [
            student.roll,
            student.name,
            date
        ];


        periods.forEach(period => {

            row.push(
                getStatus(
                    student.roll,
                    period
                ) || "-"
            );

        });


        csv +=
            row.map(value => `"${value}"`)
               .join(",") + "\n";

    });


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
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


// Start
displayStudents();
