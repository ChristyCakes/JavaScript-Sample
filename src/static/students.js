document.addEventListener('DOMContentLoaded', () => {
    const allStudentsTable = document.getElementById('all-students-table');

    fetch('http://localhost:4000/api/v1/students')
        .then(response => response.json())
        .then(json => {
            sortStudents(json);
            createTableHead(allStudentsTable)
        })

    // separate names, ids in student data
    const sortStudents = (unsortedStudents) => {
        let separated = [];
        for (let student of unsortedStudents) {
            separated.push(student.match(/[a-zA-Z]+|[0-9]+/g))
        }
        // sort data to { 'firstName': 'Freda', 'lastName': 'Terry', 'id': 'Freda.Terry22' }
        let sorted = [];
        for (let entry of separated) {
            let data = {};
            data.firstName = entry[0];
            data.lastName = (isNaN(entry[1]) ? entry[1] : '');    // last name may be missing
            data.id = unsortedStudents[separated.indexOf(entry)];
            sorted.push(data);
        }
        populateTable(allStudentsTable, sorted)
    }

    // set up table headers
    const createTableHead = (table) => {
        let thead = table.createTHead();
        let row = thead.insertRow();
        let examHeaders = ['First Name', 'Last Name', 'ID'];
        for (let key of examHeaders) {
            let th = document.createElement('th');
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }

    const rowClickable = () => {
        let rows = allStudentsTable.getElementsByTagName('tr');
        for (i = 0; i < rows.length; i++) {
            let currentRow = allStudentsTable.rows[i];
            let createClickHandler = (row) => {
                return () => {
                    let firstNameCell = row.getElementsByTagName('td')[0];
                    let lastNameCell = row.getElementsByTagName('td')[1];
                    let idCell = row.getElementsByTagName('td')[2];
                    let firstName = firstNameCell.innerHTML;
                    let lastName = lastNameCell.innerHTML;
                    let id = idCell.innerHTML;
                    (id === '' ? alert('No student ID provided') : window.location.href = `/student.html?name=${firstName} ${lastName}&studentid=${id}`)
                };
            };
            currentRow.onclick = createClickHandler(currentRow);
        }
    }

    const populateTable = (table, data) => {
        data.forEach(entry => {
            let row = table.insertRow();
            for (key in entry) {
                let cell = row.insertCell();
                let text = document.createTextNode(entry[key])
                cell.appendChild(text);
            }
        })
        // enable nav to student page
        rowClickable()
    }

    // exams button
    const examsBtn = document.getElementById('exams');
    examsBtn.style.backgroundColor = 'transparent';
    examsBtn.addEventListener('click', () => {
        window.location.href = '/index.html';
    })
})
