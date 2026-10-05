```javascript
// ============================================
// STUDENT ATTENDANCE SYSTEM
// ============================================


// Get saved data

let attendanceData =
    JSON.parse(
        localStorage.getItem(
            "attendanceData"
        )
    ) || [];


// ============================================
// SET TODAY'S DATE
// ============================================

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


// ============================================
// ADD ATTENDANCE
// ============================================

function addAttendance() {

    const name =
        document
            .getElementById(
                "studentName"
            )
            .value
            .trim();


    const roll =
        document
            .getElementById(
                "rollNumber"
            )
            .value
            .trim();


    const date =
        document
            .getElementById(
                "attendanceDate"
            )
            .value;


    const period =
        document
            .getElementById(
                "period"
            )
            .value;


    const status =
        document
            .getElementById(
                "status"
            )
            .value;


    // Validate

    if (
        !name ||
        !roll ||
        !date ||
        !period ||
        !status
    ) {

        alert(
            "Please fill all fields."
        );

        return;
    }


    // Check duplicate attendance

    const duplicate =
        attendanceData.some(
            record =>
                record.date === date &&
                record.roll === roll &&
                record.period === period
        );


    if (duplicate) {

        alert(
            "Attendance for this student, date and period already exists."
        );

        return;
    }


    // Create record

    const record = {

        id: Date.now(),

        name: name,

        roll: roll,

        date: date,

        period: period,

        status: status

    };


    // Add record

    attendanceData.push(record);


    // Save data

    saveData();


    // Clear fields except date

    document.getElementById(
        "studentName"
    ).value = "";

    document.getElementById(
        "rollNumber"
    ).value = "";

    document.getElementById(
        "period"
    ).value = "";

    document.getElementById(
        "status"
    ).value = "";


    // Display

    displayAttendance();


    alert(
        "Attendance added successfully!"
    );
}


// ============================================
// SAVE DATA
// ============================================

function saveData() {

    localStorage.setItem(
        "attendanceData",
        JSON.stringify(
            attendanceData
        )
    );
}


// ============================================
// DISPLAY ATTENDANCE
// ============================================

function displayAttendance() {

    const table =
        document.getElementById(
            "attendanceTable"
        );


    const search =
        document
            .getElementById(
                "search"
            )
            .value
            .toLowerCase()
            .trim();


    const filterDate =
        document.getElementById(
            "filterDate"
        ).value;


    const filterPeriod =
        document.getElementById(
            "filterPeriod"
        ).value;


    // Filter records

    const filtered =
        attendanceData.filter(
            record => {

                const matchesSearch =
                    !search ||
                    record.name
                        .toLowerCase()
                        .includes(search) ||
                    record.roll
                        .toLowerCase()
                        .includes(search);


                const matchesDate =
                    !filterDate ||
                    record.date ===
                    filterDate;


                const matchesPeriod =
                    !filterPeriod ||
                    record.period ===
                    filterPeriod;


                return (
                    matchesSearch &&
                    matchesDate &&
                    matchesPeriod
                );

            }
        );


    // Empty

    if (filtered.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty">

                    No attendance records found.

                </td>

            </tr>

        `;

        updateSummary();

        return;
    }


    // Display records

    table.innerHTML =
        filtered
            .map(
                (record, index) => {

                    const statusClass =
                        record.status ===
                        "Present"
                            ? "status-present"
                            : "status-absent";


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
                                <strong>
                                    ${escapeHTML(
                                        record.roll
                                    )}
                                </strong>
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
                                    class="status
                                    ${statusClass}">

                                    ${record.status === "Present"
                                        ? "✓ Present"
                                        : "✕ Absent"}

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
            )
            .join("");


    updateSummary();
}


// ============================================
// UPDATE SUMMARY
// ============================================

function updateSummary() {

    const total =
        attendanceData.length;


    const present =
        attendanceData.filter(
            record =>
                record.status ===
                "Present"
        ).length;


    const absent =
        attendanceData.filter(
            record =>
                record.status ===
                "Absent"
        ).length;


    const percentage =
        total > 0
            ? (
                present /
                total *
                100
            ).toFixed(1)
            : 0;


    document.getElementById(
        "totalRecords"
    ).textContent = total;


    document.getElementById(
        "totalPresent"
    ).textContent = present;


    document.getElementById(
        "totalAbsent"
    ).textContent = absent;


    document.getElementById(
        "percentage"
    ).textContent =
        percentage + "%";
}


// ============================================
// DELETE ONE RECORD
// ============================================

function deleteAttendance(id) {

    const confirmDelete =
        confirm(
            "Delete this attendance record?"
        );


    if (!confirmDelete) {
        return;
    }


    attendanceData =
        attendanceData.filter(
            record =>
                record.id !== id
        );


    saveData();

    displayAttendance();
}


// ============================================
// DELETE ALL DATA
// ============================================

function deleteAllAttendance() {

    if (
        attendanceData.length === 0
    ) {

        alert(
            "There is no data to delete."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete ALL attendance data?"
        );


    if (!confirmDelete) {
        return;
    }


    attendanceData = [];


    saveData();

    displayAttendance();


    alert(
        "All attendance data deleted."
    );
}


// ============================================
// CLEAR FILTERS
// ============================================

function clearFilters() {

    document.getElementById(
        "search"
    ).value = "";


    document.getElementById(
        "filterDate"
    ).value = "";


    document.getElementById(
        "filterPeriod"
    ).value = "";


    displayAttendance();
}


// ============================================
// FORMAT DATE
// ============================================

function formatDate(date) {

    if (!date) {
        return "";
    }


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


// ============================================
// ESCAPE HTML
// ============================================

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


// ============================================
// EXPORT DATA
// ============================================

function exportData() {

    if (
        attendanceData.length === 0
    ) {

        alert(
            "No attendance data to export."
        );

        return;
    }


    let csv =
        "Date,Roll Number,Student Name,Period,Status\n";


    attendanceData.forEach(
        record => {

            csv +=
                `"${record.date}",` +
                `"${record.roll}",` +
                `"${record.name}",` +
                `"Period ${record.period}",` +
                `"${record.status}"\n`;

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "attendance.csv";


    link.click();


    URL.revokeObjectURL(url);
}


// ============================================
// INITIAL DISPLAY
// ============================================

displayAttendance();
```


